# URL Shortener

A modern URL shortener application built with SvelteKit and deployed on Cloudflare Workers, featuring user authentication, analytics, and a clean dashboard interface.

## Features

- 🔗 **URL Shortening**: Create short, memorable links from long URLs
- 👤 **User Authentication**: Secure sign-up and login with Supabase Auth
- 📊 **Click Analytics**: Track clicks, user agents, countries, and more
- 🎨 **Modern UI**: Clean interface built with TailwindCSS and DaisyUI
- ⚡ **Fast & Scalable**: Deployed on Cloudflare Workers for global performance
- 🔒 **Secure**: Row-level security policies protect user data

## Technology Stack

- **Frontend**: SvelteKit 2.x with Svelte 5
- **Styling**: TailwindCSS 4.x with DaisyUI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Cloudflare Workers
- **Runtime**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Supabase](https://supabase.com/) account and project
- [Cloudflare](https://cloudflare.com/) account (for deployment)

### Installation

1. Clone the repository and install dependencies:

```sh
bun install
```

2. Set up environment variables in `.env`:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Set up the database by running `database-setup.sql` in your Supabase SQL editor.

### Development

Start the development server:

```sh
bun run dev
```

Or start the server and open the app in a new browser tab:

```sh
bun run dev -- --open
```

### Building and Deployment

Build for production:

```sh
bun run build
```

Preview the production build locally:

```sh
bun run preview
```

Deploy to Cloudflare Workers:

```sh
bun run deploy
```

## Code Quality

Format code:

```sh
bun run format
```

Lint and check formatting:

```sh
bun run lint
```

Type checking:

```sh
bun run check
```

## Project Structure

```
src/
├── routes/                      # SvelteKit routes
│   ├── +page.server.ts         # Main dashboard with URL CRUD
│   ├── +layout.server.ts       # Session management
│   └── [shortCode]/+page.server.ts  # URL redirection logic
├── lib/
│   ├── components/             # Svelte components
│   ├── supabase.ts            # Supabase client configuration
│   └── supabaseServer.ts      # Server-side Supabase utilities
├── hooks.server.ts            # SvelteKit server hooks for auth
└── app.d.ts                   # TypeScript declarations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

[MIT License](LICENSE)
