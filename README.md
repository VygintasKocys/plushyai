# Plushify

Transform your photos into adorable plushie versions with AI. Upload any image and get a cute, cuddly plushie rendition in seconds.

## Features

- **AI-Powered Generation**: Transform any photo into a plushie using multiple art styles
- **Five Plushie Styles**: Classic Plushie, Kawaii, Realistic Plush, Chibi, and Vintage Teddy
- **Credit-Based Pricing**: Simple plans starting at $9/month
- **Personal Gallery**: Save, download, and manage all your plushie creations
- **Authentication**: Secure sign-in with Google OAuth
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **Authentication**: BetterAuth with Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components with Tailwind CSS 4
- **Styling**: Pastel pink/purple/lavender brand theme with dark mode support

## Quick Setup

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

3. Fill in your environment variables in `.env` (see `env.example` for details).

4. Run database migrations:

   ```bash
   pnpm db:migrate
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

Your application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio (database GUI)
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── dashboard/         # User dashboard
│   ├── docs/              # Documentation pages
│   ├── gallery/           # Plushie gallery
│   ├── generate/          # Generation interface
│   ├── pricing/           # Pricing page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── gallery/           # Gallery components
│   ├── generate/          # Generation components
│   └── ui/                # shadcn/ui components
└── lib/                   # Utilities and configurations
    ├── auth.ts            # BetterAuth configuration
    ├── auth-client.ts     # Client-side auth utilities
    ├── db.ts              # Database connection
    ├── mock-data.ts       # Mock data for UI development
    ├── schema.ts          # Database schema
    ├── storage.ts         # File storage abstraction
    └── utils.ts           # General utilities
```

## License

This project is licensed under the MIT License.
