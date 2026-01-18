import { useEffect, useRef, useState, useCallback } from 'react'
import {
  TelepartyClient,
  type SocketEventHandler,
  type SessionChatMessage,
  type MessageList,
  SocketMessageTypes,
} from 'teleparty-websocket-lib'

type ConnectionStatus = 'connecting' | 'ready' | 'closed'

/**
 * Custom hook for managing Teleparty chat functionality.
 * Encapsulates all SDK logic and provides a clean interface for components.
 */
export function useTelepartyChat() {
  // Store the TelepartyClient instance in a ref to persist across renders
  // and avoid recreating the connection on every render
  const clientRef = useRef<TelepartyClient | null>(null)

  // Connection state - tracks the WebSocket connection lifecycle
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')

  // Chat messages - array of all messages in the current room
  const [messages, setMessages] = useState<SessionChatMessage[]>([])

  // Typing presence - indicates if anyone is currently typing
  const [anyoneTyping, setAnyoneTyping] = useState(false)

  // Room state - tracks which room we're in and user's nickname
  const [roomId, setRoomId] = useState<string | null>(null)
  const [nickname, setNickname] = useState<string | null>(null)

  // Error state - captures errors from create/join operations
  const [error, setError] = useState<string | null>(null)

  // Initialize TelepartyClient once on mount
  useEffect(() => {
    // Implement SocketEventHandler interface to handle connection events
    const eventHandler: SocketEventHandler = {
      // Called when WebSocket connection is established and ready
      // This is when we can safely call createChatRoom or joinChatRoom
      onConnectionReady: () => {
        setConnectionStatus('ready')
      },

      // Called when WebSocket connection is closed
      // Per library docs: "Restart the application" - we set status to closed
      onClose: () => {
        setConnectionStatus('closed')
      },

      // Called when receiving messages from the server
      // We need to route messages based on their type
      onMessage: (message) => {
        // Handle incoming chat messages
        // These are sent by users or the system (join/leave notifications)
        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          // message.data is a SessionChatMessage containing:
          // - body, userNickname, userIcon, isSystemMessage, permId, timestamp
          const chatMessage = message.data as SessionChatMessage
          setMessages((prev) => [...prev, chatMessage])
        }
        // Handle typing presence updates
        // Server sends this when someone starts/stops typing
        else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          // message.data contains: { anyoneTyping: boolean, usersTyping: string[] }
          const typingData = message.data as { anyoneTyping?: boolean; usersTyping?: string[] }
          setAnyoneTyping(Boolean(typingData?.anyoneTyping))
        }
      },
    }

    // Create the TelepartyClient instance
    // This immediately opens a WebSocket connection to the server
    const client = new TelepartyClient(eventHandler)
    clientRef.current = client

    // Cleanup: tear down the connection when component unmounts
    // This prevents memory leaks and ensures proper WebSocket closure
    return () => {
      if (clientRef.current) {
        clientRef.current.teardown()
        clientRef.current = null
      }
    }
  }, []) // Empty deps: only run once on mount

  /**
   * Create a new chat room.
   * Sets nickname and roomId, clears messages for the new room.
   */
  const createRoom = useCallback(async (nick: string, userIcon?: string) => {
    const client = clientRef.current
    if (!client) {
      setError('Client not initialized')
      return
    }
    if (connectionStatus !== 'ready') {
      setError('Connection not ready')
      return
    }

    setError(null)
    try {
      // createChatRoom returns the room ID (sessionId)
      const id = await client.createChatRoom(nick, userIcon)
      // Clear messages since this is a new room
      setMessages([])
      setRoomId(id)
      setNickname(nick)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create room')
    }
  }, [connectionStatus])

  /**
   * Join an existing chat room.
   * Loads previous messages from MessageList and sets room state.
   */
  const joinRoom = useCallback(async (nick: string, id: string, userIcon?: string) => {
    const client = clientRef.current
    if (!client) {
      setError('Client not initialized')
      return
    }
    if (connectionStatus !== 'ready') {
      setError('Connection not ready')
      return
    }

    setError(null)
    try {
      // joinChatRoom returns MessageList with previous messages
      const messageList: MessageList = await client.joinChatRoom(nick, id, userIcon)
      // Load all previous messages into state
      setMessages(messageList.messages ?? [])
      setRoomId(id)
      setNickname(nick)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join room')
    }
  }, [connectionStatus])

  /**
   * Send a chat message to the current room.
   * Uses SEND_MESSAGE type with SendMessageData format.
   */
  const sendChatMessage = useCallback((body: string) => {
    const client = clientRef.current
    if (!client) return

    // Send message using SEND_MESSAGE type
    // Data format: { body: string } (SendMessageData interface)
    client.sendMessage(SocketMessageTypes.SEND_MESSAGE, { body })
  }, [])

  /**
   * Update typing presence indicator.
   * Sends SET_TYPING_PRESENCE to notify others when user is typing.
   */
  const setTyping = useCallback((typing: boolean) => {
    const client = clientRef.current
    if (!client) return

    // Send typing presence update
    // Data format: { typing: boolean }
    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, { typing })
  }, [])

  // Return all state and functions for components to use
  return {
    connectionStatus,
    messages,
    anyoneTyping,
    roomId,
    nickname,
    error,
    createRoom,
    joinRoom,
    sendChatMessage,
    setTyping,
  }
}
