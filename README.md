# Tomie

An interactive AI terminal interface built with Next.js and React, featuring dynamic mood-based responses and a retro terminal aesthetic.

## Features

- **Mood-Based AI Responses**: Tomie analyzes user input and responds with different emotional states
- **Dynamic Visual Feedback**: Eye expressions and color themes change based on Tomie's current mood
- **Terminal-Style Interface**: Retro command-line aesthetic with typing animations
- **Built-in Commands**: System commands for navigation and interaction
- **Real-time Interaction**: Instant mood analysis and contextual responses

## Mood States

Tomie can express five different emotional states:

- **Neutral** - Default calm state with blue theme
- **Angry** - Triggered by hostile input with red theme  
- **Trusted** - Develops when building rapport with purple theme
- **Excited** - Shows enthusiasm with orange theme
- **Confused** - Appears when uncertain with green theme

Each mood state features unique:
- Color schemes and visual styling
- Eye expressions and animations
- Response patterns and personality traits

## Available Commands

- `/clear` - Clear terminal and reset memory
- `/help` - Display available commands
- `/repo` - Open GitHub repository

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/asyntes/tomie.git
cd tomie
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Technology Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with modern hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **ESLint** - Code linting and formatting

## License

MIT License
