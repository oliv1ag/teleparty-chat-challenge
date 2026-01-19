import { useEffect, useRef, useState, useCallback } from 'react'
import {
  TelepartyClient,
  type SocketEventHandler,
  type SessionChatMessage,
  type MessageList,
  SocketMessageTypes,
} from 'teleparty-websocket-lib'

type ConnectionStatus = 'connecting' | 'ready' | 'closed'

export function useTelepartyChat() {
  const clientRef = useRef<TelepartyClient | null>(null)

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const [messages, setMessages] = useState<SessionChatMessage[]>([])
  const [anyoneTyping, setAnyoneTyping] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [nickname, setNickname] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        setConnectionStatus('ready')
      },
      onClose: () => {
        setConnectionStatus('closed')
      },
      onMessage: (message) => {
        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          const chatMessage = message.data as SessionChatMessage
          setMessages((prev) => [...prev, chatMessage])
        } else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          const typingData = message.data as { anyoneTyping?: boolean; usersTyping?: string[] }
          setAnyoneTyping(Boolean(typingData?.anyoneTyping))
        }
      },
    }

    const client = new TelepartyClient(eventHandler)
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        clientRef.current.teardown()
        clientRef.current = null
      }
    }
  }, [])

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
      const id = await client.createChatRoom(nick, userIcon)
      setMessages([])
      setRoomId(id)
      setNickname(nick)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create room')
    }
  }, [connectionStatus])

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
      const messageList: MessageList = await client.joinChatRoom(nick, id, userIcon)
      setMessages(messageList.messages ?? [])
      setRoomId(id)
      setNickname(nick)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join room')
    }
  }, [connectionStatus])

  const sendChatMessage = useCallback((body: string) => {
    const client = clientRef.current
    if (!client) return
    client.sendMessage(SocketMessageTypes.SEND_MESSAGE, { body })
  }, [])

  const setTyping = useCallback((typing: boolean) => {
    const client = clientRef.current
    if (!client) return
    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, { typing })
  }, [])

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
