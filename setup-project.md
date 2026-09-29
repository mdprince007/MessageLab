# MessageLab Project Setup

## Overview
This document outlines the setup and configuration for the MessageLab project, a React-based messaging application.

## Project Structure

The project is organized as follows:

```text
messagelab/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── DemoControls.tsx
│   │   ├── FeatureSwitcher.tsx
│   │   └── MessageTimeline.tsx
│   ├── features/
│   ├── styles/
│   ├── types/
│   │   └── message.ts
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Dependencies

The following dependencies are required:

- `react` and `react-dom` for the UI components.
- `vite` for the build tool.
- `@vitejs/plugin-react` for React support in Vite.
- `tailwindcss` for styling.
- `typescript` for type safety.
- `eslint` and `prettier` for code quality and formatting.

## Configuration Files

### `package.json`

```json
{
  "name": "messagelab",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1",
    "@vitejs/plugin-react": "^4.7.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-react": "^7.34.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "postcss": "^8.4.38",
    "prettier": "^3.3.2",
    "prettier-plugin-tailwindcss": "^0.6.5",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.5",
    "vite": "^5.4.21"
  }
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx},"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Running the Application

### Development Server

1. Navigate to the project directory:
   ```bash
   cd C:\messenger
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` to view the application.

## Testing the Application

1. **Basic Messaging**:
   - Type a message in the Sender panel.
   - Click 