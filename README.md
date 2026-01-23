# Portflow Extended

A production-grade Chrome extension that enhances the Portflow portfolio platform by providing real-time goal feedback insights directly in the UI.

## Features

- **Goal Feedback Tracking**: Automatically fetches and displays evaluation data for your portfolio goals
- **Visual Badges**: Shows recent level, highest level achieved, and evaluation counts
- **Real-time Updates**: Monitors API calls and updates the UI dynamically
- **Persistent State**: Saves data locally for quick access via the popup
- **Modern UI**: Clean, professional interface that matches Portflow's design language

## Installation

### Development

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd portflow-extended
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start development server:

   ```bash
   pnpm dev
   ```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` directory

### Production Build

```bash
pnpm build
pnpm zip
```

The packaged extension will be in `.output/`.

## Architecture

### Project Structure

```
portflow-extended/
├── entrypoints/
│   ├── content.ts          # Content script (main coordinator)
│   ├── interceptor.ts      # Fetch interceptor (runs in page context)
│   └── popup/              # Extension popup UI
├── src/
│   ├── constants/          # Configuration and theme
│   ├── services/           # Business logic
│   │   ├── dom.service.ts      # DOM manipulation
│   │   ├── feedback.service.ts # Feedback processing
│   │   ├── goals.service.ts    # Goal processing
│   │   └── state.service.ts    # State management
│   ├── types/              # TypeScript definitions
│   └── utils/              # Helper functions
└── assets/                 # Static assets
```

### How It Works

1. **Interceptor** (`interceptor.ts`): Runs in the page context, intercepts Portflow's API calls to capture goal and feedback data
2. **Content Script** (`content.ts`): Receives data from interceptor, manages state, and coordinates DOM injection
3. **DOM Service**: Injects custom badges into Portflow's goal list UI
4. **State Service**: Persists data to `browser.storage.local` for popup access
5. **Popup**: Displays extension status, goal count, and last update time

## Permissions

- **storage**: Save extension state and cached data
- **host_permissions**: Access Portflow and Canvas domains

## Development

### Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build production bundle
- `pnpm compile` - Type-check without building
- `pnpm zip` - Create distributable ZIP file

### Tech Stack

- **Framework**: [WXT](https://wxt.dev/) - Modern web extension framework
- **UI**: React 19 + Tailwind CSS 4
- **Language**: TypeScript
- **Build Tool**: Vite

## Contributing

This extension is primarily for personal use but contributions are welcome for the Open-ICT community.

## License

MIT
