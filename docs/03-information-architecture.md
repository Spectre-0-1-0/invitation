# 03 Information Architecture & Sitemap

## Sitemap

- **Home (/)**: Hero experience, featured highlights, entry points to sub-sections.
- **Gallery (/gallery)**: Filterable grid of photos and short videos.
    - **Single Memory (/gallery/[id])**: Expanded view with metadata and related memories.
- **People (/people)**: Directory of graduating seniors.
    - **Profile (/people/[slug])**: Individual profile page.
- **Timeline (/timeline)**: Chronological scroll of major university events and shared milestones.
- **Message Wall (/messages)**: A digital pinboard of farewell messages.
- **Hall of Memes (/memes)**: A dedicated section for inside jokes and shared humor.
- **Tribute (/tribute)**: The final storytelling experience (Video/Long-form).

## Navigation Strategy
- **Primary (Mobile)**: Fixed bottom navigation bar with icons for quick access to Home, People, Gallery, and Messages.
- **Primary (Desktop)**: Clean top header with elegant typography.
- **Breadcrumbs**: Used on Profile and Memory detail pages for easy backtracking.

## URL Structure
- `/people/[student-name-slug]`
- `/gallery/[memory-id-slug]`
- `/events/[event-id-slug]`
