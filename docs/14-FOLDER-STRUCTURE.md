# 14 Folder Structure

The repository is organized for clarity, scalability, and ease of static site generation.

```text
college-memory-archive/
├── .next/                  # Managed by Next.js
├── docs/                   # Implementation Blueprint & Specs
├── public/                 # Static Assets (Publicly accessible)
│   ├── content/           # Core archive assets (Un-versioned via LFS if large)
│   │   ├── profiles/      # Senior headshots
│   │   ├── gallery/       # Photos and video thumbnails
│   │   ├── videos/        # Video source files
│   │   └── memes/         # Meme assets
│   ├── fonts/             # Custom Typography (Playfair, etc.)
│   └── icons/             # Favicons and manifest assets
├── src/
│   ├── app/               # Next.js App Router (Routing & Layouts)
│   │   ├── (main)/        # Route group for common site layout
│   │   │   ├── people/    # /people and /people/[slug]
│   │   │   ├── gallery/   # /gallery and /gallery/[id]
│   │   │   ├── timeline/  # /timeline
│   │   │   ├── messages/  # /messages
│   │   │   └── memes/     # /memes
│   │   ├── tribute/       # /tribute (Specific immersive layout)
│   │   ├── layout.tsx     # Root layout (Provider & Navbar/Footer)
│   │   └── page.tsx       # Landing page (Home)
│   ├── components/        # React Components
│   │   ├── ui/            # Atomic, primitive components (Button, Card, Badge)
│   │   ├── shared/        # Reusable feature components (MemoryCard, Navbar)
│   │   ├── layout/        # Layout-specific components (Section, Container)
│   │   └── animations/    # Framer Motion wrapper components
│   ├── content/           # MDX files for long-form content (Story, Tribute)
│   ├── data/              # Source JSON files (The "Database")
│   │   ├── seniors.json
│   │   ├── memories.json
│   │   └── messages.json
│   ├── hooks/             # Custom React hooks (useSearch, useScrollPosition)
│   ├── lib/               # Utilities (Formatting, Metadata helpers, Shaper)
│   │   ├── utils.ts       # Tailwind class merger (clsx + tailwind-merge)
│   │   └── data-fetcher.ts# Shared logic for reading local JSON/MDX
│   ├── styles/            # Global CSS and Tailwind directives
│   └── types/             # Shared TypeScript interfaces (from docs/13)
├── tailwind.config.ts      # Design tokens integration
├── next.config.ts          # Build configuration
└── package.json            # Dependencies and scripts
```

## Directory Purpose Summary

- **`src/app/`**: Defines the site structure. Using route groups `(main)` allows for different layouts (e.g., standard site vs. immersive tribute).
- **`src/components/ui/`**: Based on Radix or Shadcn patterns for consistent, accessible primitives.
- **`src/data/`**: Centralized source of truth. Keeping JSON here makes it easy for non-developers to propose content changes via Git.
- **`src/lib/data-fetcher.ts`**: Abstracting data access allows us to move to a real database later if needed without breaking components.
- **`public/content/`**: Storing assets here allows for easy referencing in JSON via relative URLs and takes advantage of Next.js image optimization.
