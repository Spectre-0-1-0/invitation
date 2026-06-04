# 09 Definition of Done (DoD)

To consider this project (or a specific phase) complete, the following criteria must be met:

## 1. Technical Requirements
- [ ] Code compiles without errors (Next.js build passes).
- [ ] TypeScript types are strictly defined; no `any`.
- [ ] All components are mobile-responsive (tested at 375px width).
- [ ] `next/image` is used for all visual assets.
- [ ] No console errors or warnings in the browser.

## 2. Design & UX
- [ ] UI matches the "Elegant Nostalgia" tone defined in the Design System.
- [ ] Animations are smooth and enhance the storytelling experience.
- [ ] Navigation is intuitive; user can always return home or back.
- [ ] Contrast ratios meet WCAG AA standards.

## 3. Content
- [ ] All mock data is accurate and contains no "lorem ipsum."
- [ ] High-resolution headshots and gallery items are correctly linked.
- [ ] Metadata (titles, descriptions, tags) is fully populated.

## 4. Performance
- [ ] Lighthouse Performance score > 90.
- [ ] Interactive in < 2 seconds on 3G/Mobile.
- [ ] Cumulative Layout Shift (CLS) is minimal (< 0.1).

## 5. Documentation
- [ ] Code is commented where logic is complex.
- [ ] `AGENTS.md` (if applicable) is updated with build/test instructions.
