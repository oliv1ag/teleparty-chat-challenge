import { useState, useEffect } from 'react'
import type { SessionChatMessage } from 'teleparty-websocket-lib'

type ChatRoomProps = {
  roomId: string
  messages: SessionChatMessage[]
  anyoneTyping: boolean
  currentUserNickname: string | null
  currentUserIcon: string | null
  onSendMessage: (body: string) => void
  onSetTyping: (typing: boolean) => void
}

export function ChatRoom({ roomId, messages, anyoneTyping, currentUserNickname, currentUserIcon, onSendMessage, onSetTyping }: ChatRoomProps) {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    onSetTyping(inputValue.trim().length > 0)
  }, [inputValue, onSetTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    
    onSetTyping(false)
    onSendMessage(trimmed)
    setInputValue('')
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <strong>Room ID:</strong> <span>{roomId}</span>
      </div>

      <h2>Messages: {messages.filter(m => !m.isSystemMessage).length}</h2>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {(() => {
                    const iconToShow = message.userIcon || 
                      (message.userNickname === currentUserNickname ? currentUserIcon : null)
                    return (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: iconToShow ? 'transparent' : '#ccc',
                          color: '#666',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          overflow: 'hidden',
                        }}
                      >
                        {iconToShow ? (
                          <img
                            src={iconToShow}
                            alt={message.userNickname || 'User'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const parent = target.parentElement
                              if (parent) {
                                parent.textContent = (message.userNickname || 'U')[0].toUpperCase()
                                parent.style.backgroundColor = '#ccc'
                              }
                            }}
                          />
                        ) : (
                          <span>{(message.userNickname || 'U')[0].toUpperCase()}</span>
                        )}
                      </div>
                    )
                  })()}
                  <div>
                    {message.isSystemMessage ? (
                      <>
                        {message.userNickname && <strong>{message.userNickname} </strong>}
                        {message.body}
                      </>
                    ) : (
                      <>
                        <strong>{message.userNickname || 'Unknown'}:</strong> {message.body}
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {anyoneTyping && (
        <div style={{ marginBottom: '8px', color: '#666', fontStyle: 'italic' }}>
          Someone is typing…
        </div>
      )}

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
