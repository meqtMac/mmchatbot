# SVG Streaming Display Requirements

## Overview

This document outlines the requirements for SVG streaming display behavior, including automatic view mode switching and user interaction handling.

## Requirements

### 1. Streaming Display Behavior

#### 1.1 Initial State
- **During Streaming**: Display SVG content in **Code mode** (syntax-highlighted, read-only)
- **Typewriter Effect**: Show code as it streams in real-time
- **No Loading Indicator**: Do not show "正在思考..." when content is being streamed
- **Immediate Display**: Show SVG prefix and content as soon as streaming starts

#### 1.2 Completion Behavior
- **Auto-switch to Render**: When streaming completes, automatically switch to **Render mode** after 300ms delay
- **Delay Purpose**: Ensure SVG is complete before rendering
- **User Override**: If user manually selects Code mode during or after streaming, respect their choice

### 2. User Interaction

#### 2.1 Manual View Selection
- **Toggle Available**: Users can manually switch between Code and Render modes at any time
- **Persistent Selection**: If user manually selects Code mode, it should remain in Code mode even after streaming completes
- **Reset on New Stream**: User selection resets when a new streaming starts

#### 2.2 View Mode States
- **Code Mode**: Syntax-highlighted XML code view (read-only)
- **Render Mode**: Rendered SVG graphic view
- **Default During Stream**: Code mode
- **Default After Stream**: Render mode (unless user selected Code)

### 3. Loading Indicator Logic

#### 3.1 Display Conditions
- **Show Only When**: Last message exists but has no content yet (before prefix is added)
- **Hide When**: Content starts streaming (even if incomplete)
- **Purpose**: Indicate initial API call delay, not streaming progress

#### 3.2 Implementation
```typescript
const showLoadingIndicator = isLoading && isLastMessage && !message.content.trim()
```

### 4. Bug Fixes

#### 4.1 Auto-switch Override Bug
**Problem**: After user clicks Code button, system still auto-switches to Render when streaming completes.

**Solution**: 
- Track user's manual view selection with `useRef`
- Only auto-switch if user hasn't manually selected a mode
- Reset tracking when new stream starts

#### 4.2 Empty Content Display Bug
**Problem**: Shows "正在思考..." even when content is streaming.

**Solution**:
- Check if message has content before showing loading indicator
- Show SVG display component as soon as prefix is added
- Hide loading indicator once content exists

## Technical Implementation

### Component State Management

```typescript
// SvgDisplay component
const [viewMode, setViewMode] = useState<'code' | 'render'>('code')
const userSelectedMode = useRef<boolean>(false)

// Auto-switch logic (only if user hasn't selected)
useEffect(() => {
  if (!isStreaming && viewMode === 'code' && !userSelectedMode.current) {
    setTimeout(() => setViewMode('render'), 300)
  }
}, [isStreaming, viewMode])

// Handle manual selection
const handleViewModeChange = (mode: 'code' | 'render') => {
  userSelectedMode.current = true
  setViewMode(mode)
}
```

### Message State Updates

```typescript
// During streaming
message.isStreaming = true
message.content = '<svg...>' + streamedContent

// After streaming
message.isStreaming = false
message.content = completeSVG
```

### Loading Indicator Logic

```typescript
// Only show if no content exists yet
const showLoadingIndicator = 
  isLoading && 
  isLastMessage && 
  !message.content.trim()
```

## User Experience Flow

### Scenario 1: Normal Streaming
1. User sends message
2. System shows loading indicator briefly (if API call is slow)
3. SVG prefix appears → Code mode displays immediately
4. Code streams in with typewriter effect
5. Streaming completes → Auto-switches to Render mode after 300ms
6. User can manually switch back to Code if desired

### Scenario 2: User Selects Code During Stream
1. Streaming starts → Code mode displays
2. User clicks Code button (already in Code mode) → No change
3. User clicks Render button → Switches to Render mode
4. Streaming continues → Stays in Render mode
5. Streaming completes → Stays in Render mode (user's choice)

### Scenario 3: User Selects Code After Stream
1. Streaming completes → Auto-switches to Render
2. User clicks Code button → Switches to Code mode
3. User selection is remembered → Stays in Code mode
4. New stream starts → Resets to Code mode (new stream)

## Edge Cases

### Edge Case 1: Rapid Toggle During Stream
- **Behavior**: User can toggle freely during streaming
- **Result**: View mode follows user selection immediately
- **After Stream**: Respects last user selection

### Edge Case 2: Empty Content
- **Behavior**: If message has no content, show loading indicator
- **Transition**: Once prefix is added, show SVG display component
- **No Gap**: Smooth transition from loading to content

### Edge Case 3: Stream Interruption
- **Behavior**: If stream fails, remove message placeholder
- **State**: Reset loading state
- **Error**: Show error message

## Testing Scenarios

1. **Normal Flow**: Stream → Code view → Auto-switch to Render
2. **User Override**: Stream → User selects Code → Stays in Code
3. **Toggle During Stream**: Stream → Toggle Render/Code → Respects selection
4. **Multiple Messages**: Previous messages maintain their view mode
5. **New Stream**: Previous user selection resets for new message

## Files Modified

- `frontend/src/components/SvgDisplay.tsx` - View mode logic and user selection tracking
- `frontend/src/components/ChatMessage.tsx` - Passes streaming state
- `frontend/src/hooks/useChat.ts` - Manages message streaming state
- `frontend/src/App.tsx` - Loading indicator logic
- `frontend/src/types/chat.ts` - Added `isStreaming` field

## Acceptance Criteria

- [x] Streaming shows code view immediately (typewriter effect)
- [x] No "正在思考..." shown when content is streaming
- [x] Auto-switches to Render mode when streaming completes
- [x] User can manually select Code mode and it persists
- [x] User selection resets when new stream starts
- [x] Loading indicator only shows when no content exists
- [x] Smooth transitions between states

