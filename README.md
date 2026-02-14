# Sociality

Sociality is a social media application built with the Next.js App Router.  
This repository includes the core social workflows: authentication, feed, post interactions, profile management, and follow relationships.

## Feature Summary

- User registration and login with JWT authentication
- Feed with infinite scrolling
- Post creation with image and caption
- Like, comment, save, and share interactions
- Public and private profile pages (including profile editing)
- Follow/unfollow with followers and following pages
- User search with debouncing

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Data Fetching | TanStack Query v5, Axios |
| State Management | Redux Toolkit (UI state) |
| Form & Validation | React Hook Form, Zod |
| Utility | Day.js, Sonner, Lucide React |

## Project Structure

```text
src/
├── app/                  # Routing and pages (App Router)
├── components/           # UI and domain components
├── config/               # App constants and route map
├── features/             # Redux slices
├── hooks/                # Custom hooks
├── lib/                  # Utilities, schemas, auth helper, query client
├── providers/            # Global provider composition
├── services/             # API client and React Query hooks
├── store/                # Redux store configuration
└── types/                # TypeScript type definitions
```

## Running the Project

### Prerequisites

- Node.js 20+
- npm 10+ (or pnpm/yarn)

### Installation

1. Clone repository:
   ```bash
   git clone <your-repository-url>
   cd social-media-apps
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |

Default value from `.env.example`:

```env
NEXT_PUBLIC_API_URL=https://social-media-be-400174736012.asia-southeast2.run.app
```

## NPM Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the app in development mode |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production build |
| `npm run lint` | Run ESLint |

## Architecture Overview

- Routing is organized with App Router route groups: `(auth)`, `(app)/(private)`, `(app)/(public)`
- Server state is managed with TanStack Query
- Global UI state (dialogs/modals) is managed with Redux Toolkit
- Form validation uses React Hook Form + Zod
- Route protection is handled by middleware and a client-side auth guard

## Main API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register account |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/feed` | Fetch user feed |
| `POST` | `/api/posts` | Create a new post |
| `POST` | `/api/posts/:id/like` | Like post |
| `POST` | `/api/posts/:id/comments` | Add a comment |
| `POST` | `/api/follow/:username` | Follow user |
| `GET` | `/api/users/search?q=` | Search users |

## Development

Minimum checklist before creating a pull request:

- Ensure `npm run lint` passes
- Ensure `npm run build` passes
- Use clear commit messages

## License

This project is licensed under MIT. See `LICENSE` for details.
