# Teleparty Chat Challenge

## Overview
A minimal React application that integrates with the Teleparty chat SDK to
create and join chat rooms, send and receive messages, and display system events.

## Features
- Create a chat room
- Join an existing chat room
- Send and receive chat messages
- Display system messages
- Handle connection close events

## Tech Stack
- React
- TypeScript
- Teleparty Chat SDK

## Design Approach
- Treat the Teleparty SDK as a black box.
- Use server events as the single source of truth.
- Isolate SDK logic in a custom React hook.

## Assumptions
- UI styling is minimal and not a priority.
- Reconnection logic is out of scope.

## How to Run
(To be added)
