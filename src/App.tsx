import { useTelepartyChat } from './hooks/useTelepartyChat'
import { Lobby } from './components/Lobby'
import { ChatRoom } from './components/ChatRoom'

function App() {
  const {
    roomId,
    connectionStatus,
    messages,
    anyoneTyping,
    error,
    nickname,
    userIcon,
    createRoom,
    joinRoom,
    sendChatMessage,
    setTyping,
  } = useTelepartyChat()

  return (
    <>
      {!roomId ? (
        <Lobby
          connectionStatus={connectionStatus}
          error={error}
          createRoom={createRoom}
          joinRoom={joinRoom}
          roomId={roomId}
        />
      ) : (
        <ChatRoom
          roomId={roomId}
          messages={messages}
          anyoneTyping={anyoneTyping}
          currentUserNickname={nickname}
          currentUserIcon={userIcon}
          onSendMessage={sendChatMessage}
          onSetTyping={setTyping}
        />
      )}
    </>
  )
}

export default App
