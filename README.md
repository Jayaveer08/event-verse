# EventVerse 🎉

**EventVerse** is a modern event discovery and booking platform where users can find, book, and manage events — concerts, sports, theater, comedy shows, and more.

## Tech Stack

- **Vite** — blazing-fast build tool
- **React 18** — UI library
- **TypeScript** — type-safe development
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible component library
- **Supabase** — backend, auth & database
- **React Query** — server-state management
- **Framer Motion** — animations

## Getting Started

### Prerequisites

- Node.js v18+ and npm installed

### Installation

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate into the project
cd eventverse

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:8080**.

## Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Features

- 🎟️ Browse and book events by category and city
- 🔐 User authentication (email/password + Google OAuth)
- 📅 Seat selection and booking management
- 📊 Organizer dashboard to create and manage events
- 🌙 Dark/Light theme support
- 📱 Fully responsive design
