import { useState, useRef } from 'react'

type ConnectionStatus = 'connecting' | 'ready' | 'closed'

type LobbyProps = {
  connectionStatus: ConnectionStatus
  error: string | null
  createRoom: (nickname: string, userIcon?: string) => Promise<void>
  joinRoom: (nickname: string, roomId: string, userIcon?: string) => Promise<void>
  roomId: string | null
}

export function Lobby({
  connectionStatus,
  error,
  createRoom,
  joinRoom,
  roomId,
}: LobbyProps) {
  const [nickname, setNickname] = useState('')
  const [inputRoomId, setInputRoomId] = useState('')
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [userIcon, setUserIcon] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isReady = connectionStatus === 'ready'
  const hasRoomId = roomId !== null
  const isDisabled = !isReady || hasRoomId

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setUserIcon(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setUserIcon(dataUrl)
    }
    reader.onerror = () => {
      alert('Error reading file')
      setUserIcon(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveIcon = () => {
    setUserIcon(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedNickname = nickname.trim()
    if (!trimmedNickname) return
    createRoom(trimmedNickname, userIcon || undefined)
  }

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedNickname = nickname.trim()
    const trimmedRoomId = inputRoomId.trim()
    if (!trimmedNickname || !trimmedRoomId) return
    joinRoom(trimmedNickname, trimmedRoomId, userIcon || undefined)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Teleparty Chat</h1>

      {connectionStatus === 'connecting' && (
        <p style={{ color: '#666' }}>Connecting...</p>
      )}
      {connectionStatus === 'closed' && (
        <p style={{ color: '#c00' }}>Connection closed. Please reload the page.</p>
      )}

      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setMode('create')}
          style={{
            marginRight: '8px',
            padding: '8px 16px',
            fontWeight: mode === 'create' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Create Room
        </button>
        <button
          type="button"
          onClick={() => setMode('join')}
          style={{
            padding: '8px 16px',
            fontWeight: mode === 'join' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Join Room
        </button>
      </div>

      <form onSubmit={mode === 'create' ? handleCreate : handleJoin}>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="nickname" style={{ display: 'block', marginBottom: '4px' }}>
            Nickname <span style={{ color: '#c00' }}>*</span>
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            disabled={isDisabled}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {mode === 'join' && (
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="roomId" style={{ display: 'block', marginBottom: '4px' }}>
              Room ID <span style={{ color: '#c00' }}>*</span>
            </label>
            <input
              id="roomId"
              type="text"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              placeholder="Enter room ID"
              disabled={isDisabled}
              required
              style={{
                width: '100%',
                padding: '8px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="userIcon" style={{ display: 'block', marginBottom: '4px' }}>
            User Icon (Optional)
          </label>
          <input
            ref={fileInputRef}
            id="userIcon"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isDisabled}
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
          {userIcon && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={userIcon}
                alt="User icon preview"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <button
                type="button"
                onClick={handleRemoveIcon}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled || !nickname.trim() || (mode === 'join' && !inputRoomId.trim())}
          style={{
            padding: '10px 20px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.6 : 1,
          }}
        >
          {mode === 'create' ? 'Create Room' : 'Join Room'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '16px', color: '#c00' }}>
          Error: {error}
        </div>
      )}
    </div>
  )
}
