# Sprint 1 Deliverables: Validating the Scrapbook

## 1. Choice of Archetype: Friendship Wall
I chose the **Friendship Wall** for the initial validation because it is the most demanding of the "Scrapbook" philosophy. It requires:
*   **Communal Voice:** Multiple handwriting styles (personas) living on one page.
*   **High Density:** Layered photos and overlapping elements.
*   **Tactile Discovery:** Hidden memories tucked behind artifacts.
*   **Emotional Weight:** A clear narrative arc from "Early Days" to "Final Sign-off."

If we can make a Friendship Wall feel authentic on a mobile screen, the rest of the archetypes will follow naturally.

## 2. Files and Components Created
*   `src/components/scrapbook/ScrapbookDesk.tsx`: The base environment layer.
*   `src/components/scrapbook/ScrapbookPage.tsx`: The tactile paper engine.
*   `src/components/scrapbook/ScrapbookPhoto.tsx`: The physical photo artifact (handles Polaroids, prints, and hidden reveals).
*   `src/components/scrapbook/ScrapbookNote.tsx`: The voice of the scrapbook (handles 5 handwriting personas).
*   `src/app/sprint1/page.tsx`: The manually composed validation page.

## 3. Design Decisions Made
*   **Absolute Positioning:** Rejected CSS Grid/Flexbox for memory elements. Every photo and note is placed via `x/y/rotate` props to mimic human curation.
*   **Z-Index Logic:** Established a standardized stack: Desk (0) -> Page (10) -> Photos (20) -> Notes (30) -> Lifting Photo (50).
*   **Persona-Driven Handwriting:** Mapped personas to specific font-weights, colors, and font-families to ensure consistent "characters" contribute to the page.
*   **Physical Reveals:** Instead of a "Modal," hidden memories are revealed by "lifting" the photo (3D transform), keeping the user in the physical book metaphor.

## 4. What Worked
*   **The "Human Hand":** The manual rotation and absolute positioning immediately break the "SaaS" feel. The page feels "placed," not "rendered."
*   **Framer Motion Integration:** The subtle page entrance and photo hover effects provide the "Elegant Nostalgia" vibe without feeling like a tech showcase.
*   **Handwriting Personas:** Using distinct voices (Neat Student vs. Chaotic Friend) adds immediate narrative depth.

## 5. What Did Not Work (and Needs Refinement)
*   **Mobile Responsiveness:** Absolute positioning is difficult on small screens. The current strategy uses a fixed-width container that might require "pan and zoom" or a more flexible percentage-based placement for the production version.
*   **Tape Detail:** Simple CSS divs for tape look "okay" but need SVG-based Washi tape for true authenticity.

## 6. Generalization for Production
*   **Placement Engine:** The `x, y, rotate` props should be moved into the JSON data model (`src/data/memories.json`).
*   **Persona Mapping:** Create a centralized `Handwriting` utility to avoid repeating styles across components.
*   **Asset Library:** Move paper and photo textures to a centralized asset registry.

## Success Test Result
When viewing the Sprint 1 page, the user is greeted by a wooden desk, a textured notebook page, and a mess of photos held by tape. There are no "cards" or "grids." The "Hidden Memory" under the lab photo rewards curiosity.

**Conclusion: The scrapbook language is validated.**
