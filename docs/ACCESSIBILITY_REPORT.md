# Accessibility Report - College Memory Archive

## Overview
This report evaluates the application's compliance with WCAG 2.1 AA standards and documents the improvements made to ensure an inclusive experience.

## 1. Accomplishments & Fixes
- **Alt Text Verification**: **IMPROVED**. Replaced empty `alt=""` tags with descriptive titles for memories, seniors, and events across the public site.
- **Semantic HTML**: The application uses appropriate landmark roles (`header`, `main`, `footer`, `nav`) and heading hierarchies (`h1-h6`).
- **ARIA Labels**: Added `aria-label` to critical buttons like the mobile menu toggle and home links to ensure screen readers can provide context.
- **Focus States**: Verified that interactive elements have visible `focus-visible` states, using `heritage-navy` or `champagne-gold` outlines for high contrast.

## 2. Keyboard Navigation
- Verified that all interactive elements are reachable via the `Tab` key.
- Fixed an issue where the "More" dropdown in the navigation was not easily accessible via keyboard.
- Implemented `aria-haspopup="true"` and `aria-expanded` on dropdown triggers.

## 3. Color Contrast
- The primary palette (Heritage Navy on Parchment) provides high contrast (ratio > 7:1), well exceeding the WCAG AA requirement of 4.5:1.
- Warning messages and error states use compliant color combinations (e.g., `red-800` on `red-50`).

## 4. Known Limitations & Future Work
- **Skip-to-Content**: While planned, a global "Skip to Content" link for keyboard users should be added to the main layout.
- **Complex Interactivity**: Some Framer Motion animations might be distracting for users with vestibular disorders; implementing `prefers-reduced-motion` support is recommended for V2.
