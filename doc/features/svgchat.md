# SVG Chat Feature

## Overview

The SVG Chat feature automatically generates SVG (Scalable Vector Graphics) content for all AI responses. The system uses DeepSeek's prefix continuation (Beta) feature to force SVG output format, regardless of user input. Users only need to describe what SVG they want (e.g., "draw a red circle", "create a blue square"), and the system will automatically generate complete, valid SVG files with enhanced display capabilities including rendered visualization and syntax-highlighted code view.

## Features

### Always SVG Mode
- **All AI responses are SVG format**: The system automatically forces SVG output for every response
- **No user specification needed**: Users don't need to explicitly request SVG - it's always returned
- **Prefix continuation**: Uses DeepSeek Beta API with prefix continuation feature
- **Automatic prefix injection**: System adds `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">` as prefix
- **Stop sequence**: Automatically stops at `</svg>` to ensure complete SVG files

### Dual View Modes

#### Render Mode (Default)
- Displays the SVG as a rendered graphic
- SVG is automatically normalized for scalability
- Responsive container that adapts to content size
- Uses `dangerouslySetInnerHTML` for safe SVG rendering

#### Code Mode
- Displays syntax-highlighted SVG code
- Uses Prism syntax highlighter with VS Code Dark Plus theme
- XML/HTML syntax highlighting for better readability
- Easy to copy SVG code for use elsewhere

### SVG Normalization

All SVGs are automatically normalized to ensure optimal display:

1. **Removes fixed dimensions**: Strips `width` and `height` attributes
2. **Ensures viewBox**: Adds `viewBox="0 0 100 100"` if missing
3. **Preserves other attributes**: Maintains all other SVG attributes intact
4. **Scalable output**: Results in responsive, scalable SVGs

#### Normalization Example

**Before:**
```xml
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- content -->
</svg>
```

**After:**
```xml
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- content -->
</svg>
```

## Usage

### For Users

1. **Simply describe what SVG you want**: No need to specify "SVG" or "generate SVG code"
2. **Describe the visual content**: Tell the AI what you want to see (e.g., "red circle", "blue square with text")
3. **Automatic SVG generation**: The system automatically generates complete SVG files
4. **Use toggle buttons**: Switch between:
   - **Render**: See the visual representation
   - **Code**: See the syntax-highlighted source code

### Example Prompts

- "画一个红色的圆" (Draw a red circle)
- "创建一个蓝色的正方形" (Create a blue square)
- "画一个带渐变的星星" (Draw a star with gradient)
- "画一个聊天气泡图标" (Draw a chat bubble icon)
- "创建一个带文字的logo" (Create a logo with text)

**Note**: You don't need to mention "SVG" - just describe what you want visually!

## Technical Implementation

### Prefix Continuation Flow

```
User: "画一个红色的圆"
  ↓
API Request with messages:
  [
    { role: "user", content: "画一个红色的圆" },
    { role: "assistant", content: "<svg viewBox=...>", prefix: true }
  ]
  ↓
DeepSeek Beta API continues from SVG prefix
  ↓
Streams: " viewBox=\"0 0 100 100\"...<circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"red\"/></svg>"
  ↓
Complete SVG: <svg viewBox="0 0 100 100"...><circle.../></svg>
  ↓
Stop at: </svg>
```

### Component Architecture

```
ChatMessage
  ├── All assistant messages are SVG (always SVG mode)
  └── Renders SvgDisplay component
      ├── Toggle buttons (Render/Code)
      └── Content area
          ├── Render mode: Normalized SVG
          └── Code mode: Syntax-highlighted XML
```

### Key Components

#### `SvgDisplay` Component
- **Location**: `frontend/src/components/SvgDisplay.tsx`
- **Props**: `svgContent: string`
- **State**: `viewMode: 'code' | 'render'`
- **Features**:
  - Toggle between render and code views
  - Automatic SVG normalization
  - Responsive layout

#### SVG Utilities
- **Location**: `frontend/src/utils/svg.ts`
- **Functions**:
  - `isSvg(content: string): boolean` - Detect SVG presence
  - `extractSvg(content: string): string | null` - Extract SVG markup
  - `normalizeSvg(svgContent: string): string` - Normalize SVG attributes

#### DeepSeek API Integration
- **Location**: `frontend/src/utils/deepseek.ts`
- **API Endpoint**: `https://api.deepseek.com/beta/chat/completions` (Beta API)
- **Prefix Continuation**: Automatically adds SVG prefix with `prefix: true`
- **Stop Sequence**: `['</svg>']` ensures complete SVG files
- **SVG Prefix**: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">`

### Integration Flow

1. **User Input**: User describes desired SVG content (e.g., "red circle")
2. **API Call**: System sends request to DeepSeek Beta API
3. **Prefix Injection**: System automatically adds SVG prefix: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">` with `prefix: true`
4. **Prefix Continuation**: DeepSeek continues from SVG prefix, generating complete SVG
5. **Stop Sequence**: Generation stops at `</svg>` tag
6. **Message Received**: ChatMessage component receives SVG message
7. **Display**: Renders SvgDisplay component with toggle controls
8. **Normalization**: SVG is normalized (removes width/height, ensures viewBox)
9. **User Interaction**: User can toggle between Render/Code views

## Dependencies

- `react-syntax-highlighter`: ^15.5.0 - Syntax highlighting for code view
- `@types/react-syntax-highlighter`: ^15.5.11 - TypeScript types

## API Configuration

### DeepSeek Beta API
- **Endpoint**: `https://api.deepseek.com/beta/chat/completions`
- **Feature**: Prefix Continuation (Beta)
- **Purpose**: Force SVG output format for all responses

### Prefix Message Structure
```json
{
  "role": "assistant",
  "content": "<svg viewBox=\"0 0 100 100\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">",
  "prefix": true
}
```

### Request Parameters
- `model`: `"deepseek-chat"`
- `messages`: Array including user message + SVG prefix message
- `stream`: `true` (enabled)
- `temperature`: `0.7`
- `stop`: `["</svg>"]` (stops generation when SVG closes)

## Styling

- Uses existing design system (shadcn/ui components)
- Responsive container with border and rounded corners
- Dark theme syntax highlighting (works in both light/dark modes)
- Consistent spacing and padding

## Edge Cases Handled

- **Incomplete SVG**: Stop sequence ensures SVG always closes properly
- **Malformed SVG**: Normalization handles missing attributes gracefully
- **SVG without viewBox**: Default viewBox is added automatically during normalization
- **SVG with both width/height and viewBox**: Width/height are removed, viewBox preserved
- **Case-insensitive attributes**: Handles both `viewBox` and `viewbox`
- **API errors**: Graceful error handling with user-friendly messages
- **Stream interruptions**: Buffer management ensures complete SVG reception

## Future Enhancements

Potential improvements for future versions:

- SVG download functionality
- Copy SVG code button
- SVG editor mode
- Multiple SVG support in single message
- SVG animation preview
- Export options (PNG, PDF)

## Examples

### Example 1: Simple Circle

**User**: "画一个红色的圆" (Draw a red circle)

**System Process**:
1. User message sent: "画一个红色的圆"
2. System adds SVG prefix: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">` with `prefix: true`
3. DeepSeek continues from prefix, generating SVG content
4. Streams complete SVG and stops at `</svg>`

**AI Response** (automatically displayed as SVG):
```xml
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="red" />
</svg>
```

### Example 2: Complex Graphic

**User**: "创建一个带星星的logo" (Create a logo with a star)

**AI Response**: Complex SVG with multiple elements, automatically normalized and displayed with toggle between render and code views. The system automatically generates the complete SVG based on the description.

## Notes

- **Always SVG Mode**: All AI responses are SVG format - no need to specify
- **User Input**: Users only describe visual content, not technical SVG requirements
- **Automatic Prefix**: System handles SVG prefix injection automatically
- **Beta API**: Uses DeepSeek Beta API for prefix continuation feature
- **Normalization**: All SVGs are normalized to use viewBox (scalable) instead of width/height
- **Stop Sequence**: Ensures complete SVG files by stopping at closing tag
- **Case-insensitive**: SVG detection and attribute handling are case-insensitive
- **Error Handling**: Graceful fallback for API errors or malformed content

