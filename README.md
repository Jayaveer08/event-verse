<div align="center">

<img src="https://raw.githubusercontent.com/Jayaveer08/eventverse1/main/public/favicon.svg" width="90" height="90" alt="EventVerse Logo" />

# EventVerse

### Discover. Book. Experience.

**A full-stack event discovery & ticketing platform** — concerts, sports, theater, comedy, and more — with real-time seat selection, authenticated user accounts, an organizer dashboard, and integrated payment processing.

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-eventverse--lime.vercel.app-6366f1?style=for-the-badge)](https://eventverse-lime.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Supabase-0f172a?style=for-the-badge)](https://github.com/Jayaveer08/eventverse1)
[![Deploy Status](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✨ What is EventVerse?

EventVerse is a production-ready event ticketing platform built to demonstrate end-to-end full-stack engineering — from real-time database reads and authenticated user sessions, to seat map selection, payment checkout, and downloadable PDF tickets.

It's the kind of project that solves a real problem: discovering and booking events is fragmented across a dozen different platforms. EventVerse brings it all into one seamless, modern experience.

---

## 🚀 Live Demo

👉 **[https://eventverse-lime.vercel.app](https://eventverse-lime.vercel.app)**

> **💳 Test Payment Mode**
> Payments are integrated in **Stripe test mode** — no real money is charged.
> Use the test card: `4242 4242 4242 4242` · Any future expiry · Any CVC

---

## 🖼️ Features at a Glance

| Feature | Description |
|---|---|
| 🔍 **Event Discovery** | Browse events by category (concerts, sports, theater, comedy) and city |
| 🔐 **Authentication** | Email/password + Google OAuth via Supabase Auth |
| 🪑 **Seat Selection** | Interactive seat map with real-time availability |
| 💳 **Payment Checkout** | Stripe-powered checkout in test mode |
| 🎫 **PDF Tickets** | Downloadable tickets generated client-side with jsPDF |
| 📊 **Organizer Dashboard** | Create, manage, and analyze events with live Recharts analytics |
| 🌙 **Dark / Light Mode** | Full theme toggle with next-themes |
| 📱 **Fully Responsive** | Mobile-first design across all screen sizes |
| ✨ **Smooth Animations** | Page transitions and micro-interactions via Framer Motion |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| **React 18** | UI library with concurrent features |
| **TypeScript** | Type-safe development throughout |
| **Vite + SWC** | Blazing-fast builds and HMR |
| **Tailwind CSS** | Utility-first responsive styling |
| **shadcn/ui + Radix UI** | Accessible, unstyled component primitives |
| **Framer Motion** | Declarative animations and transitions |
| **React Router v6** | Client-side routing |
| **TanStack Query v5** | Server-state management, caching, and background sync |
| **React Hook Form + Zod** | Schema-validated forms |
| **Recharts** | Analytics charts on the organizer dashboard |
| **jsPDF** | Client-side PDF ticket generation |
| **Embla Carousel** | Event image carousels |

### Backend & Infrastructure
| Technology | Role |
|---|---|
| **Supabase** | PostgreSQL database, Auth, Realtime, Edge Functions |
| **Supabase Auth** | Email + Google OAuth session management |
| **PL/pgSQL** | Database migrations and stored procedures |
| **Stripe (Test Mode)** | Secure payment processing via Supabase Edge Function |
| **Vercel** | CI/CD deployment with edge network delivery |

---

## 📁 Project Structure

```
eventverse1/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components (shadcn/ui based)
│   ├── pages/               # Route-level page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Supabase client, utility functions
│   ├── types/               # TypeScript type definitions
│   └── App.tsx              # Root component with router
├── supabase/
│   ├── migrations/          # SQL migration files (PL/pgSQL)
│   └── functions/           # Edge Functions (payment processing)
├── .env.example             # Environment variable template
├── vercel.json              # Vercel SPA routing config
└── vite.config.ts           # Vite build configuration
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- A [Supabase](https://supabase.com) project
- (Optional) A [Stripe](https://stripe.com) account for payment testing

### 1. Clone the repository

```bash
git clone https://github.com/Jayaveer08/eventverse1.git
cd eventverse1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then fill in your values:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 4. Apply database migrations

In your Supabase dashboard → SQL Editor, run the migration files from `supabase/migrations/` in order.

### 5. Start the dev server

```bash
npm run dev
```

App runs at **http://localhost:8080** 🚀

---

## 💳 Test Payment Instructions

EventVerse uses **Stripe in test mode** — no real transactions occur.

Use these credentials at checkout:

```
Card Number : 4242 4242 4242 4242
Expiry      : Any future date (e.g. 12/28)
CVC         : Any 3 digits (e.g. 123)
ZIP         : Any 5 digits (e.g. 10001)
```

You'll receive a booking confirmation and a downloadable PDF ticket immediately after.

---

## 📜 Available Scripts

```bash
npm run dev        # Start development server (localhost:8080)
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint across the codebase
```

---

## 🏗️ Architecture Highlights

- **Auth flow** — Supabase Auth handles sessions; protected routes redirect unauthenticated users via React Router guards
- **Data layer** — TanStack Query wraps all Supabase reads/writes for caching, background refetch, and optimistic updates
- **Payments** — Stripe checkout is triggered via a Supabase Edge Function, keeping secret keys server-side and never exposed to the client
- **PDF generation** — Booking confirmations are generated client-side using jsPDF, stamped with event details and a unique booking ID
- **Realtime** — Seat availability updates in real time using Supabase Realtime subscriptions

---

## 🌐 Deployment

This project is deployed on **Vercel** with automatic deployments on every push to `main`.

The `vercel.json` configuration rewrites all routes to `index.html` for correct SPA behavior:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 👨‍💻 Author

**Jayaveer N**
Final Year B.Tech — Computer Science (AI & ML)
Sreyas Institute of Engineering and Technology, Hyderabad

[![GitHub](https://img.shields.io/badge/GitHub-Jayaveer08-181717?style=flat-square&logo=github)](https://github.com/Jayaveer08)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-jayaveer--nallapati-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/jayaveer-nallapati)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**If you found this project useful, consider giving it a ⭐**

*Built with React, TypeScript, Supabase & ❤️*

</div>
