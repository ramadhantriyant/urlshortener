# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally with Wrangler
- `bun run deploy` - Deploy to Cloudflare Workers

### Code Quality

- `bun run format` - Format code with Prettier
- `bun run lint` - Check formatting and run ESLint
- `bun run check` - Type check with Svelte and TypeScript
- `bun run check:watch` - Type check in watch mode

### Cloudflare Integration

- `bun run cf-typegen` - Generate Cloudflare Worker types
- `wrangler dev` - Run Cloudflare Workers dev server
- `wrangler deploy` - Deploy to Cloudflare

## Architecture Overview

This is a URL shortener application built with SvelteKit and deployed on Cloudflare Workers, using Supabase for authentication and data storage.

### Technology Stack

- **Frontend**: SvelteKit 2.x with Svelte 5
- **Styling**: TailwindCSS 4.x with DaisyUI
- **Deployment**: Cloudflare Workers with adapter-cloudflare
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Runtime**: Bun

### Database Schema

The application uses three main tables in Supabase:

- `urls` - Stores original URLs, short codes, click counts, and metadata
- `clicks` - Analytics data for each URL click (user agent, IP, country, etc.)
- `user_profiles` - User profile information and plan details

### Key Directories Structure

```
src/
├── routes/
│   ├── +page.server.ts          # Main dashboard with URL CRUD
│   ├── +layout.server.ts        # Session management
│   └── [shortCode]/+page.server.ts  # URL redirection logic
├── lib/
│   ├── components/              # Svelte components
│   ├── supabase.ts             # Supabase client and types
│   └── supabaseServer.ts       # Server-side Supabase utilities
├── hooks.server.ts             # SvelteKit server hooks for auth
└── app.d.ts                    # TypeScript declarations
```

### Authentication Flow

- Uses Supabase Auth with email/password
- Session management via SvelteKit hooks in `hooks.server.ts`
- Row Level Security (RLS) policies protect user data
- Anonymous users can access short URLs for redirection

### URL Shortening Logic

- Short codes are generated and stored in the `urls` table
- Redirection happens via `[shortCode]/+page.server.ts`
- Click analytics are tracked in the `clicks` table
- Users can manage their URLs through the dashboard

### Cloudflare Configuration

- Configured via `wrangler.jsonc`
- Uses Cloudflare Workers adapter for SvelteKit
- Assets are served from Cloudflare

## Environment Setup

Required environment variables (in `.env`):

- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)

## Database Setup

Run `database-setup.sql` in your Supabase SQL editor to create the required tables, indexes, RLS policies, and triggers.
