# Scrapbook Implementation Strategy: The Engineering Blueprint

This document translates the scrapbook vision into an executable engineering plan. It defines the build order, core systems, and success criteria required to transform the "Elegant Nostalgia" design into a production-ready digital experience.

---

## PART 1: IMPLEMENTATION ORDER (Inside-Out)

We build from the memory outward. The core of the project is the individual memory on a single page; without that, navigation and motion are meaningless.

1.  **Single Page Engine:** Create the "Desk" and "Paper" container. Focus on manual placement of a single photo and a single note.
2.  **Visual Asset System (Foundations):** Implement the base paper types, photo stocks, and tape styles. Wear and aging start here.
3.  **Page Archetype System:** Build the 20 layouts. Transition from a single page to the ability to render complex clusters and chaos pages.
4.  **The Fragment Data Model:** Implement the flexible JSON structure that supports messy, unstructured memory snippets.
5.  **Chapter Framework:** Organize pages into narrative arcs (Beginning, Middle, End).
6.  **Discovery System:** Implement "Attention-based" reveals and hidden layers.
7.  **Interaction & Motion Language:** Apply the choreography—mass, weight, and human-hand transitions.
8.  **Final Polish:** Narrative-driven wear, audio textures, and performance optimization.

**Why this order?**
By focusing on the **Single Page** first, we validate the "vibe" immediately. If one page feels like a website, we adjust before scaling to a hundred pages.

---

## PART 2: CORE SYSTEMS

### 1. Scrapbook Page Container (The Stage)
*   **Responsibility:** Manages the aspect ratio, background "Desk" texture, and the base "Paper" stock.
*   **Engineering Goal:** Handle varying paper sizes and edge treatments (torn, deckled).

### 2. Memory Placement Engine (Manual Composition)
*   **Responsibility:** A property-driven system where every memory artifact (Photo, Note, Doodle) receives `x`, `y`, and `rotate` coordinates from the data layer.
*   **Engineering Goal:** Avoid algorithmic layout. Every page is a "hand-curated" composition.

### 3. Universal Layer System
Every component must exist within this conceptual z-index hierarchy:
1.  **Desk Layer:** The physical world outside the book.
2.  **Book Layer:** The cover and structural spine.
3.  **Paper Layer:** The base page.
4.  **Memory Layer:** Photos, artifacts, and fragments.
5.  **Attachment Layer:** Tape, staples, and clips (holding the memory).
6.  **Annotation Layer:** Handwriting, ink, and doodles (over the memory).
7.  **Discovery Layer:** Hidden content revealed by interaction.
8.  **Interaction Layer:** Navigation and touch-feedback.

### 4. Fragment Data Model
*   **Responsibility:** A flexible schema that allows for `type: "photo"`, `type: "note"`, `type: "scribble"`, or `type: "artifact"`.
*   **Engineering Goal:** Support the "Inside Joke" and "Chaos" content that doesn't fit standard title/description patterns.

---

## PART 3: MVP SCRAPBOOK (The 20/80 Rule)

To create 80% of the scrapbook feeling with 20% of the build, we prioritize:
1.  **Tactile Paper & Photo Stocks:** The visual weight of the materials.
2.  **Manual Rotation & Overlap:** The rejection of the "straight-line" grid.
3.  **Handwritten Personalities:** The "human voices" in the margins.
4.  **The "First Day" and "Graduation" Pages:** The emotional bookends.

---

## PART 4: RISK ANALYSIS (Preventing "SaaS-ification")

| Risk | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Grid Drift** | Developers accidentally snapping elements to a CSS grid. | Strictly use absolute positioning for all memory elements. |
| **UI Sterility** | Using standard buttons, fonts, or icons. | No standard UI. Every button is a "hand-drawn" or "taped-on" artifact. |
| **Search-First UX** | Relying on search bars for navigation. | No search bar. Navigation is driven by Chapter Tabs and physical exploration. |
| **Performance Drag** | High-res textures and motion slowing down mobile. | Optimize textures early; use SVG for tape and doodles. |

---

## PART 5: SUCCESS CRITERIA

We measure success by the **Emotional Authenticity Score**:

1.  **Senior Review Approval:** A panel of graduating seniors must confirm the experience feels "personal" and "not like a website."
2.  **The "Pause" Metric:** Users should stop to look at "Hidden Discoveries" rather than just tapping through.
3.  **Visual Depth Check:** At any zoom level, the "Physical Metaphor" (layers, tape, shadows) must hold up.
4.  **Provenance Validation:** Every asset on a page must have a believable origin story (e.g., "This came from the canteen").

---

## PART 6: FIRST CODING SPRINT (Priorities)

1.  **Sprint Goal:** "The First Page Prototype."
2.  **Primary Tasks:**
    *   Setup the "Desk" and "Paper" container components.
    *   Define the `Fragment` data structure in JSON.
    *   Build the `TapedPhoto` and `HandwrittenNote` base components with manual `x/y/rotate` props.
    *   Create one "Arrival Page" (Chapter 1) archetype using these components.
3.  **Outcome:** A single, mobile-responsive page that feels like a physical memory.

---

**Architect's Note:**
The code is the glue, but the memory is the product. If we lose the human element during implementation, we lose the scrapbook.
