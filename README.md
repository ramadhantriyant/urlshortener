# URL Shortener

A fast, lightweight URL shortener built with SvelteKit and deployed on Cloudflare Workers. Features user authentication, click analytics, and a clean dashboard UI.

## Tech Stack

- **Frontend**: SvelteKit 2.x + Svelte 5
- **Styling**: TailwindCSS 4.x + DaisyUI
- **Deployment**: Cloudflare Workers
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Runtime**: Bun

## Features

- Shorten URLs with auto-generated short codes
- User authentication via Supabase Auth (email/password)
- Click analytics per URL (country, user agent, referrer, IP)
- Dashboard to create, toggle, and delete URLs
- Row Level Security — users only access their own data

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- A [Supabase](https://supabase.com/) project
- A [Cloudflare](https://cloudflare.com/) account

### Installation

```bash
bun install
```

### Environment Variables

Create a `.env` file:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Setup

Run `database-setup.sql` in your Supabase SQL editor. This creates the `urls`, `clicks`, and `user_profiles` tables along with RLS policies, indexes, and triggers.

## Development

```bash
bun run dev          # Start dev server
bun run preview      # Build and preview with Wrangler
bun run check        # Type check
bun run lint         # Formatting + ESLint
bun run format       # Format code with Prettier
```

## Deployment

```bash
bun run deploy       # Build and deploy to Cloudflare Workers
```

Set production secrets:

```bash
wrangler secret put PUBLIC_SUPABASE_URL
wrangler secret put PUBLIC_SUPABASE_PUBLISHABLE_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

## Project Structure

```
src/
├── routes/
│   ├── +page.server.ts              # Dashboard — URL CRUD actions
│   ├── +layout.server.ts            # Session management
│   └── [shortCode]/+page.server.ts  # Redirection + click tracking
├── lib/
│   ├── components/                  # Svelte UI components
│   ├── supabase.ts                  # Supabase client + types
│   └── supabaseServer.ts            # Server-side Supabase utilities
├── hooks.server.ts                  # Auth session hooks
└── app.d.ts                         # TypeScript declarations
```

## How It Works

1. Authenticated users create short URLs from the dashboard
2. Short codes are stored in Supabase alongside the original URL
3. Visitors hitting `/{shortCode}` are looked up and redirected server-side
4. Each visit records a click entry with metadata
5. Click counts stay in sync via a Supabase database trigger

## License

[MIT License](LICENSE)
