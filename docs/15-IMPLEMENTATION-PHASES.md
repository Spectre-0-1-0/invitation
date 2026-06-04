# 15 Implementation Phases

This build order is designed to deliver a high-quality, usable product as quickly as possible, starting with the core identity and data.

## Phase 1: Environment & Visual Foundations
- **Goal:** Establish the project infrastructure and design system.
- **Deliverables:**
    - Next.js 15 project scaffolding.
    - `tailwind.config.ts` with all design tokens.
    - Atomic UI components (Button, Typography, Layout wrappers).
- **Dependencies:** None.
- **Acceptance Criteria:**
    - Project builds and runs locally.
    - Brand colors and fonts are applied correctly to test components.

## Phase 2: Data Schema & Core Directory
- **Goal:** Implement the "People" experience.
- **Deliverables:**
    - Senior Profile JSON data (`seniors.json`).
    - Senior Directory page (`/people`) with search.
    - Individual Profile pages (`/people/[slug]`).
- **Dependencies:** Phase 1.
- **Acceptance Criteria:**
    - Directory correctly renders all seniors from JSON.
    - Search provides instant filtering.
    - Dynamic routes correctly display individual senior data.

## Phase 3: The Memory Engine
- **Goal:** Build the Gallery and Timeline.
- **Deliverables:**
    - Memory Gallery with masonry layout and filtering.
    - Image Lightbox for detailed viewing.
    - Timeline component showing the chronological history.
- **Dependencies:** Phase 2.
- **Acceptance Criteria:**
    - Gallery filters (Candid/Event/Milestone) work correctly.
    - Lightbox opens and closes smoothly with Framer Motion.
    - Timeline scrolls and animates entrance of events.

## Phase 4: Social & Emotional Layer
- **Goal:** Implement Message Wall, Memes, and Landing Experience.
- **Deliverables:**
    - Message Wall with bento-style layout.
    - Meme Grid.
    - High-fidelity Landing Page Hero and Featured sections.
- **Dependencies:** Phase 3.
- **Acceptance Criteria:**
    - Messages are readable and correctly categorized.
    - Home page effectively directs users to all sub-sections.
    - Hero section meets the "emotional" design requirements.

## Phase 5: The Finale & Polish
- **Goal:** Final immersive experience and optimization.
- **Deliverables:**
    - Immersive Tribute Page (`/tribute`).
    - Performance and Accessibility audit.
    - Deployment to Vercel.
- **Dependencies:** Phase 4.
- **Acceptance Criteria:**
    - Tribute page provides a "wow" emotional peak.
    - Lighthouse performance score > 90.
    - Site is fully usable via keyboard and screen readers.
