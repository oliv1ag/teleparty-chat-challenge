import { useState, useEffect } from 'react'
import type { SessionChatMessage } from 'teleparty-websocket-lib'

type ChatRoomProps = {
  roomId: string
  messages: SessionChatMessage[]
  anyoneTyping: boolean
  onSendMessage: (body: string) => void
  onSetTyping: (typing: boolean) => void
}

/**
 * ChatRoom component - displays messages and handles chat input.
 * Shows system messages differently and implements typing presence.
 */
export function ChatRoom({ roomId, messages, anyoneTyping, onSendMessage, onSetTyping }: ChatRoomProps) {
  // Local state for the message input
  const [inputValue, setInputValue] = useState('')

  // Update typing presence based on input value
  // Call onSetTyping(true) when input is non-empty, false when empty
  useEffect(() => {
    if (inputValue.trim()) {
      onSetTyping(true)
    } else {
      onSetTyping(false)
    }
  }, [inputValue, onSetTyping])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    
    // Stop typing indicator before sending
    onSetTyping(false)
    
    // Send the message and clear the input
    onSendMessage(trimmed)
    setInputValue('')
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Display Room ID at the top */}
      <div style={{ marginBottom: '16px' }}>
        <strong>Room ID:</strong> <span>{roomId}</span>
      </div>

      {/* Header showing message count */}
      <h2>Messages: {messages.length}</h2>

      {/* Message list with system/user message distinction */}
      <div style={{ marginBottom: '24px', minHeight: '400px', border: '1px solid #ccc', padding: '16px' }}>
        {messages.length === 0 ? (
          <p style={{ color: '#666' }}>No messages yet</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {messages.map((message, index) => (
              <li
                key={index}
                style={{
                  marginBottom: '8px',
                  fontStyle: message.isSystemMessage ? 'italic' : 'normal',
                  color: message.isSystemMessage ? '#666' : '#000',
                }}
              >
                {message.isSystemMessage ? (
                  // System messages: show nickname if present, then body in italic/muted
                  <>
                    {message.userNickname && <strong>{message.userNickname} </strong>}
                    {message.body}
                  </>
                ) : (
                  // User messages: show nickname and body
                  <>
                    <strong>{message.userNickname || 'Unknown'}:</strong> {message.body}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Typing presence indicator */}
      {anyoneTyping && (
        <div style={{ marginBottom: '8px', color: '#666', fontStyle: 'italic' }}>
          Someone is typing…
        </div>
      )}

      {/* Message input form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              padding: '8px 16px',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
