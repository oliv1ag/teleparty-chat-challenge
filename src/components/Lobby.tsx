import { useState } from 'react'

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

  const isReady = connectionStatus === 'ready'
  const hasRoomId = roomId !== null
  const isDisabled = !isReady || hasRoomId

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedNickname = nickname.trim()
    if (!trimmedNickname) return
    createRoom(trimmedNickname)
  }

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedNickname = nickname.trim()
    const trimmedRoomId = inputRoomId.trim()
    if (!trimmedNickname || !trimmedRoomId) return
    joinRoom(trimmedNickname, trimmedRoomId)
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
