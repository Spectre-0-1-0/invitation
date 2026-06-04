# 07 Technical Architecture

## Stack Overview
- **Framework:** Next.js 15 (App Router).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS.
- **Animation:** Framer Motion.
- **Data:** Local JSON files + Metadata-rich MDX.
- **Deployment:** Vercel (recommended for Next.js).

## Project Folder Structure
```text
/
├── public/                 # Static assets
│   ├── content/           # Core archive assets (images, videos)
│   │   ├── profiles/
│   │   ├── gallery/
│   │   └── memes/
│   └── fonts/             # Custom typography
├── src/
│   ├── app/               # Next.js App Router (Pages)
│   │   ├── (main)/        # Common layout group
│   │   │   ├── gallery/
│   │   │   ├── people/
│   │   │   ├── timeline/
│   │   │   └── messages/
│   │   └── page.tsx       # Landing page
│   ├── components/        # UI components
│   │   ├── ui/            # Atomic components (buttons, inputs)
│   │   ├── shared/        # Reusable complex components
│   │   └── sections/      # Large page sections
│   ├── data/              # JSON data files
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions, constants
│   └── types/             # TypeScript interfaces
├── docs/                  # Project specifications
└── tailwind.config.ts
```

## Architectural Decision Records (ADRs)

### ADR 001: Static Data over Database
- **Context:** V1 requires speed, no auth, and long-term stability.
- **Decision:** Store all structured data in JSON files.
- **Consequence:** Easy deployment, no backend overhead, but updates require a new commit/build.

### ADR 002: Framer Motion for Emotional Context
- **Context:** The site must feel "premium" and "nostalgic."
- **Decision:** Use Framer Motion for all entry and transition animations.
- **Consequence:** Improved UX, slightly larger bundle size, but worth the emotional impact.

### ADR 003: Client-Side Search/Filtering
- **Context:** Data volume is expected to be manageable (< 500 records).
- **Decision:** Perform all searching and filtering on the client side.
- **Consequence:** Instant feedback, simple implementation.

## Jules Development Rules
1. **Type Safety:** No `any`. Use the interfaces defined in `docs/04-content-model.md`.
2. **Component Isolation:** UI components should be pure and styled with Tailwind.
3. **Accessibility First:** Always include `aria-labels` and semantic HTML.
4. **Optimization:** All images must use `next/image` for automatic optimization.
5. **Clean Commits:** Descriptive messages following the conventional commits pattern.
