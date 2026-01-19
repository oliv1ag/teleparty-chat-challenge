# Teleparty Chat Challenge

## Overview
A React + TypeScript application that integrates with the Teleparty chat SDK to create and join chat rooms, send and receive messages, and display system events in real-time.

## Features
- ✅ Create a chat room with nickname
- ✅ Join an existing chat room by room ID
- ✅ Send and receive chat messages
- ✅ Display system messages (join/leave notifications) with distinct styling
- ✅ View all previous messages when joining a room
- ✅ Real-time typing presence indicator ("Someone is typing…")
- ✅ Display room ID (session ID) for easy sharing
- ✅ Handle connection status (connecting, ready, closed)
- ✅ Error handling for create/join operations

## Tech Stack
- **React** 18.3+
- **TypeScript** 5.6+
- **Vite** (build tool)
- **Teleparty WebSocket Library** (custom SDK)

## Architecture

### Design Approach
- Treat the Teleparty SDK as a black box
- Use server events as the single source of truth
- Isolate SDK logic in a custom React hook (`useTelepartyChat`)
- Single instance of the hook in `App.tsx` to prevent state conflicts

### Component Structure
- **App.tsx**: Root component managing hook instance and conditional rendering
- **Lobby.tsx**: Room creation/joining interface
- **ChatRoom.tsx**: Message display and input interface
- **useTelepartyChat**: Custom hook encapsulating all SDK interactions

## How to Run

### Prerequisites
- Node.js 18 or higher
- The `teleparty-websocket-lib` is included in the `lib/` directory (MIT licensed)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Opens the app at http://localhost:5173 (or the URL Vite displays).

### Build
```bash
npm run build
```
Output is in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Usage

1. **Create a Room**: 
   - Enter your nickname
   - Click "Create Room"
   - The room ID will be displayed at the top of the chat

2. **Join a Room**:
   - Enter your nickname
   - Enter the room ID
   - Click "Join Room"
   - Previous messages will be loaded automatically

3. **Send Messages**:
   - Type in the message input
   - Click "Send" or press Enter
   - Messages appear in real-time

4. **Typing Indicator**:
   - Typing in the input field shows others you're typing
   - "Someone is typing…" appears when others are typing

## Project Structure
```
src/
├── hooks/
│   └── useTelepartyChat.ts    # Custom hook managing SDK connection
├── components/
│   ├── Lobby.tsx              # Room creation/joining UI
│   └── ChatRoom.tsx           # Chat interface
├── App.tsx                     # Root component
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## Deployment

### GitHub Pages

The app is configured for automatic deployment to GitHub Pages via GitHub Actions. The `teleparty-websocket-lib` library is installed directly from GitHub during the build process.

**Setup Steps:**

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Automatic Deployment**:
   - The workflow (`.github/workflows/deploy.yml`) will automatically build and deploy on every push to `main`
   - The app will be available at: `https://[username].github.io/teleparty-chat-challenge/`

3. **Manual Deployment**:
   - You can also trigger deployment manually via the "Actions" tab → "Deploy to GitHub Pages" → "Run workflow"

## Notes
- UI styling is minimal and functional
- Reconnection logic is not implemented (reload page on connection close)
- The app waits for connection to be ready before allowing create/join operations
- User icon upload is supported (optional feature)
