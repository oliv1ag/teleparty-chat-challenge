import { useTelepartyChat } from './hooks/useTelepartyChat'
import { Lobby } from './components/Lobby'
import { ChatRoom } from './components/ChatRoom'

/**
 * Root App component.
 * Manages the overall application state using useTelepartyChat hook
 * and conditionally renders Lobby or ChatRoom based on room state.
 */
function App() {
  // SINGLE INSTANCE: App.tsx is the only component using useTelepartyChat
  // This ensures all state updates happen in one place and trigger re-renders correctly
  const {
    roomId,
    connectionStatus,
    messages,
    anyoneTyping,
    error,
    createRoom,
    joinRoom,
    sendChatMessage,
    setTyping,
  } = useTelepartyChat()

  // Render Lobby ONLY when roomId is null/undefined
  // Render ChatRoom as soon as roomId has any value
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
          onSendMessage={sendChatMessage}
          onSetTyping={setTyping}
        />
      )}
    </>
  )
}

export default App
