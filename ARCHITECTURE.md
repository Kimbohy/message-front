# Frontend Architecture

## Overview

This frontend follows modern React best practices with clear separation of concerns, strong typing, and maintainable code structure.

## Directory Structure

```
src/
├── assets/                 # Static assets (images, fonts, etc.)
├── components/             # React components
│   ├── auth/              # Authentication components
│   └── chat/              # Chat-related components
├── constants/              # Application constants
│   ├── config.ts          # Configuration constants
│   ├── socketEvents.ts    # WebSocket event names
│   └── index.ts
├── context/                # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── ChatContext.tsx    # Chat state
├── hooks/                  # Custom React hooks (future)
├── services/               # External services
│   ├── api.ts             # HTTP REST API service
│   └── socket.ts          # WebSocket service
├── types/                  # TypeScript type definitions
│   ├── user.types.ts      # User-related types
│   ├── chat.types.ts      # Chat-related types
│   ├── message.types.ts   # Message-related types
│   ├── socket.types.ts    # WebSocket-related types
│   └── index.ts
├── utils/                  # Utility functions (future)
├── App.tsx                 # Main App component
└── main.tsx                # Application entry point
```

## Architecture Layers

### 1. **Types Layer** (`types/`)

**Purpose**: Centralized TypeScript type definitions

**Benefits**:

- Single source of truth for data structures
- Type safety across the application
- Easy to maintain and refactor
- Auto-completion support

**Organization**:

- `user.types.ts` - User, authentication types
- `chat.types.ts` - Chat, conversations types
- `message.types.ts` - Message types
- `socket.types.ts` - WebSocket event types

### 2. **Constants Layer** (`constants/`)

**Purpose**: Centralized application constants

**Benefits**:

- No magic strings
- Easy to update
- Prevents typos
- Type-safe constants

**Files**:

- `socketEvents.ts` - WebSocket event names (must match backend)
- `config.ts` - Configuration values (URLs, limits, timeouts)

### 3. **Services Layer** (`services/`)

**Purpose**: External communication and business logic

#### API Service (`api.ts`)

- Handles HTTP REST API calls
- Manages authentication tokens
- Provides typed methods for all endpoints
- Centralized error handling

```typescript
// Clean, typed API calls
const user = await apiService.getProfile();
const chats = await apiService.getChats();
```

#### Socket Service (`socket.ts`)

- Manages WebSocket connection
- Provides clean event API
- Handles reconnection logic
- Type-safe event emitting/listening

```typescript
// Clean socket operations
socketService.connect();
socketService.sendMessage(chatId, content);
socketService.on({ onMessage: handleMessage });
```

### 4. **Context Layer** (`context/`)

**Purpose**: Global state management

#### AuthContext

- User authentication state
- Login/logout functionality
- Protected route logic
- User session management

#### ChatContext

- Chat list state
- Active chat management
- Message state
- Real-time updates

**Benefits**:

- Centralized state
- No prop drilling
- Easy to test
- Clear data flow

### 5. **Components Layer** (`components/`)

**Purpose**: UI components

**Organization**:

- `/auth` - Authentication UI (SignIn, SignUp, etc.)
- `/chat` - Chat UI (ChatList, MessageInput, etc.)
- Each feature in its own directory
- Co-located styles and tests

**Component Best Practices**:

```typescript
// Clean, focused components
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return <div className="message-bubble">{message.content}</div>;
};
```

## Key Design Patterns

### 1. Service Pattern

Separates business logic from UI components:

```typescript
// ❌ Bad: Logic in component
const MyComponent = () => {
  const response = await fetch("/api/chats");
  // ...
};

// ✅ Good: Logic in service
const MyComponent = () => {
  const chats = await apiService.getChats();
  // ...
};
```

### 2. Context Pattern

Provides global state without prop drilling:

```typescript
// ❌ Bad: Props through many levels
<Parent chats={chats}>
  <Child chats={chats}>
    <GrandChild chats={chats} />

// ✅ Good: Context
const { chats } = useChatContext();
```

### 3. Custom Hooks Pattern (Future)

Encapsulates reusable logic:

```typescript
// Future improvement
const useChat = (chatId: string) => {
  const [messages, setMessages] = useState([]);
  // ... logic
  return { messages, sendMessage };
};
```

### 4. Type-First Development

Always define types before implementation:

```typescript
// 1. Define types
interface User {
  _id: string;
  email: string;
  name: string;
}

// 2. Use types everywhere
const getUser = (): User => { ... };
```

## State Management

### Current Approach: Context + Reducer

**Benefits**:

- Built-in to React
- No external dependencies
- Type-safe with TypeScript
- Easy to understand

**Flow**:

```
User Action → Dispatch Action → Reducer → New State → UI Update
```

### Future Considerations:

- **React Query** for server state
- **Zustand** for lightweight global state
- **Jotai** for atomic state management

## Communication Flow

### HTTP REST API

```
Component → API Service → Backend REST → Response → Component
```

### WebSocket Real-time

```
Backend Event → Socket Service → Context → Component Update
```

## Best Practices

### 1. **Type Everything**

```typescript
// ✅ Always use explicit types
const user: User = { ... };
const handleClick = (id: string): void => { ... };
```

### 2. **Use Constants**

```typescript
// ❌ Bad
socket.emit("sendMessage", data);

// ✅ Good
socket.emit(SOCKET_EVENTS.SEND_MESSAGE, data);
```

### 3. **Service Layer for Logic**

```typescript
// ❌ Bad: Logic in component
const Component = () => {
  const token = localStorage.getItem("token");
  fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Good: Logic in service
const Component = () => {
  const user = await apiService.getProfile();
};
```

### 4. **Small, Focused Components**

```typescript
// ✅ Each component does one thing well
const ChatListItem: React.FC<Props> = ({ chat }) => { ... };
const ChatHeader: React.FC<Props> = ({ chat }) => { ... };
const MessageInput: React.FC<Props> = ({ onSend }) => { ... };
```

### 5. **Error Handling**

```typescript
// ✅ Always handle errors
try {
  const chats = await apiService.getChats();
  setChats(chats);
} catch (error) {
  setError("Failed to load chats");
  console.error(error);
}
```

## Testing Strategy

### Unit Tests

- Test services independently
- Mock API/Socket responses
- Test utility functions

### Component Tests

- Test user interactions
- Test rendering logic
- Mock context providers

### Integration Tests

- Test complete user flows
- Test service integrations
- Test state updates

## Performance Optimization

### Current

- React Context for state
- Memoization where needed
- Efficient re-renders

### Future Improvements

- [ ] Code splitting
- [ ] Lazy loading components
- [ ] Virtual scrolling for messages
- [ ] Service worker for offline support
- [ ] Optimistic UI updates

## Accessibility

- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] ARIA labels
- [ ] Focus management
- [ ] Color contrast

## Security

- [x] Token stored in localStorage
- [x] JWT authentication
- [x] HTTPS in production
- [ ] XSS protection
- [ ] CSRF protection

## Future Improvements

1. **Custom Hooks**

   - `useChat(chatId)` - Chat operations
   - `useMessages(chatId)` - Message handling
   - `useSocket()` - Socket management

2. **Better State Management**

   - React Query for server state
   - Zustand for client state

3. **Testing**

   - Vitest for unit tests
   - React Testing Library
   - Cypress for E2E

4. **Performance**

   - Virtual scrolling
   - Image optimization
   - Bundle optimization

5. **Developer Experience**
   - Storybook for components
   - Better error boundaries
   - Development tools

## Adding New Features

### Add a New Socket Event

1. Add to constants:

```typescript
// constants/socketEvents.ts
export const SOCKET_EVENTS = {
  NEW_EVENT: "newEvent",
};
```

2. Add type:

```typescript
// types/socket.types.ts
export interface NewEventData {
  // ...
}
```

3. Add service method:

```typescript
// services/socket.ts
emitNewEvent(data: NewEventData): void {
  this.emit(SOCKET_EVENTS.NEW_EVENT, data);
}
```

4. Use in component:

```typescript
socketService.emitNewEvent(data);
```

### Add a New API Endpoint

1. Add to constants:

```typescript
// constants/config.ts
export const API_ENDPOINTS = {
  NEW: "/new-endpoint",
};
```

2. Add types:

```typescript
// types/
export interface NewData { ... }
```

3. Add service method:

```typescript
// services/api.ts
async newMethod(): Promise<NewData> {
  return this.request(API_ENDPOINTS.NEW);
}
```

4. Use in component:

```typescript
const data = await apiService.newMethod();
```

## Documentation

- Keep this file updated
- Document complex logic
- Use JSDoc for functions
- Add README per feature

## Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Consistent naming conventions
