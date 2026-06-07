# The Constitution of the Digital Scrapbook

This document establishes the governing design principles for the College Memory Archive. Every future design decision—from component creation to layout logic—must adhere to this constitution.

---

## PART 1: THE EXPERIENCE PHILOSOPHY

### What is a Digital Scrapbook?
A Digital Scrapbook is a living, breathing collective memory. It is a shared memory book passed around by students, not a professionally curated archive. It should feel like dozens of people contributed over time, with different handwriting styles, personalities, and tones (funny, chaotic, emotional). It is not a database of events; it is an emotional landscape of a shared journey.

**Historical Anchor:** Inspired by student memory books from the late-2000s to early-2020s—farewell books, autograph notebooks, and friendship journals. It should feel contemporary and relatable, like something students actually made, not an antique manuscript.

**How it differs from other digital formats:**
*   **A Website:** Websites prioritize efficiency and task completion. A scrapbook prioritizes **dwelling** and **feeling**.
*   **A Gallery:** Galleries are curated and sterile. A scrapbook is **chaotic and personal**.
*   **A Social Network:** Social networks are performative and feed-based. A scrapbook is **reflective and permanent**.
*   **A Digital Yearbook:** Yearbooks are institutional and polished. A scrapbook is **individual and messy**.

### The Psychological Experience
We are building a machine for **Nostalgia**.
*   **Discovery:** The user should feel like they are "digging through a box" or "finding a note tucked away."
*   **Emotional Attachment:** Every element should feel like it was placed there by someone who cared.
*   **Imperfection:** A perfect layout is a failure. Digital "flaws"—tilted photos, overlapping edges, ink bleeds—are the features that create humanity.
*   **Storytelling:** We are not just showing photos; we are preserving the "vibe" of a specific moment in time.

---

## PART 2: THE FEELING HIERARCHY

We design for a progression of emotions. Each layer builds upon the last.

1.  **Curiosity (The Hook):** "What's that tucked behind the photo?"
2.  **Recognition (The Spark):** "I remember that night."
3.  **Laughter (The Connection):** "I forgot he wore that shirt!"
4.  **Nostalgia (The Ache):** "I really miss how things were then."
5.  **Reflection (The Meaning):** "That experience changed me."
6.  **Emotional Closure (The Legacy):** "This was a good chapter. I'm glad it’s recorded."

**Why this hierarchy matters:** Without curiosity, the user never starts. Without emotional closure, the experience feels incomplete or merely recreational.

---

## PART 3: DESIGN RULES

### Rule 1: Memories should feel discovered, not presented.
Do not put everything on a silver platter. Use layers, "tucked" elements, and non-linear paths to reward the curious user.

### Rule 2: Photos should feel placed, not rendered.
Images should have physical weight. They should have subtle rotations, varied shadows, and "attachment" markers like tape or photo corners.

### Rule 3: Content should feel personal, not generated.
Avoid "default" styles. Use varied handwriting fonts, different "paper" textures for different contributors, and organic shapes. It should look like dozens of people contributed, not one CMS.

### Rule 4: Pages should feel lived-in, not designed.
Avoid uniform padding and perfect alignment. Let elements bleed off the screen or overlap section boundaries. A "clean" page is a cold page.

### Rule 5: Usability is Mandatory; Surprises are Optional.
Navigation must be crystal clear. Functional elements (Back buttons, Menus, Accessibility) must be 100% reliable. Standard scrollbars, tooltips (if natural), and search (if quiet) are allowed. "Hide surprises, not navigation."

### Rule 6: Selective Realism.
The target is **70% Scrapbook Realism / 30% Modern Digital Experience**. We use physical cues (tape, paper texture) to trigger emotion, but we do not sacrifice the speed and convenience of a modern web app. Corporate aesthetics are strictly forbidden; functionality is not.

---

## PART 4: ANTI-PATTERNS (THE "NEVER" LIST)

If the design looks like any of the following, it must be rejected:
*   **The SaaS Trap:** Perfect 3-column grids, uniform card heights, and generic "feature" sections.
*   **The Corporate Dashboard:** Analytics-style panels, pricing tables, or "Success" badges that look like a project management tool.
*   **The Template Feel:** Generic hero banners with centered H1s, primary/secondary button pairs, and corporate sections that look like they came from a landing page builder.
*   **The Industrial Grid:** Perfectly aligned masonry or CSS grids with identical gaps. Uniform spacing across sections and symmetrical layouts by default are anti-patterns.
*   **Digital Sterility:** Glassmorphism, corporate gradients (e.g., linear-blue-to-purple), and "too-perfect" decorative animations.
*   **The Generic Carousel:** Standard arrow-based sliders that hide content in a mechanical way.

---

## PART 5: SCRAPBOOK VISUAL LANGUAGE

### 1. Paper
*   **Feel:** Varied. Some pages feel like thick cardstock, others like torn notebook paper or a greasy pizza box fragment.
*   **Visuals:** Subtle grain, deckled edges, slight yellowing for older memories.

### 2. Photos
*   **Feel:** Tactile. They should feel like they have physical thickness.
*   **Visuals:** Polaroids with handwritten captions, matte prints with "fingerprints" (subtle texture), or "glued-down" snapshots.

### 3. Notes & Doodles
*   **Feel:** Spontaneous and human.
*   **Visuals:** Ink bleeds, "scribbled-out" text, different handwriting styles (cursive, block, messy print), and margin sketches.

### 4. Tape & Attachment
*   **Feel:** Temporary and tactile.
*   **Visuals:** Washi tape (semi-transparent), clear "Scotch" tape with visible bubbles, or metallic paperclips holding elements together.

### 5. Memories
*   **Feel:** Atmospheric and heavy with context.
*   **Visuals:** Not just an image, but a "cluster" of related items—a photo, a ticket stub (rendered), and a handwritten note taped nearby.

### 6. Chapters
*   **Feel:** Structural but organic transitions.
*   **Visuals:** Physical tabs on the side of the screen, a new base "paper" color for a new era, or a "cover page" for a specific semester.

### 7. Discoverable Elements
*   **Feel:** Rewarding and tucked away.
*   **Visuals:** Overlapping edges that "peek" out, "Folded" corners that can be clicked to reveal text, or "Post-it" notes that can be moved.

---

## PART 6: SCRAPBOOK AUTHENTICITY TEST

For every new component or layout, ask:

> **"If I printed this and placed it in a real scrapbook, would it feel natural, or would it look like a screenshot of a website?"**

### The Scoring Framework (0-100)

*   **Visual Weight (25 pts):** Does it have depth? Shadows? Texture?
*   **Humanity (25 pts):** Is there evidence of a "human hand" (rotation, handwriting, doodle)?
*   **Imperfect Logic (25 pts):** Does it avoid the "perfect grid"? Is the spacing organic?
*   **Emotional Resonance (25 pts):** Does it trigger one of the 6 levels of the Feeling Hierarchy?

### Thresholds:
*   **70/100:** Minimum Passing Score (Usability-focused components like navigation).
*   **85/100:** Target Score for primary content.
*   **95/100:** World-Class Immersion (The "Gold Standard").

---

**Signed,**
*The Architects of Memory*
