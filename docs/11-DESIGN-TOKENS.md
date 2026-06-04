# 11 Design Tokens

These tokens define the visual DNA of the College Memory Archive. The goal is an **Emotional, Nostalgic, Modern, and Elegant** experience.

## Color System
Defined as CSS variables and Tailwind extensions.

| Token | Value | Tailwind Name | Purpose |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `#1A2B48` | `heritage-navy` | Tradition, depth, headers |
| **Brand Secondary** | `#D4AF37` | `champagne-gold` | Achievement, celebratory accents |
| **Brand Accent** | `#A0522D` | `burnt-sienna` | Nostalgia, warmth, active states |
| **Surface Base** | `#FDFCF8` | `parchment-base` | Main background (paper-like) |
| **Surface Muted** | `#F5F2EA` | `parchment-muted` | Secondary sections, cards |
| **Text Primary** | `#333333` | `charcoal` | Main body text |
| **Text Muted** | `#666666` | `charcoal-muted` | Meta information, captions |

## Typography Scale
Using a mix of Serif (Nostalgic) and Sans-Serif (Modern).

| Typeface | Token | Usage |
| :--- | :--- | :--- |
| **Playfair Display** | `font-serif` | Large headings, Page titles, Senior quotes |
| **Inter** | `font-sans` | Body copy, Interface labels, Navigation |
| **JetBrains Mono** | `font-mono` | Dates, Small metadata, Labels |

| Level | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **Display 1** | 4.5rem (72px) | 700 (Serif) | 1.1 |
| **Heading 1** | 3.0rem (48px) | 600 (Serif) | 1.2 |
| **Heading 2** | 2.25rem (36px) | 600 (Serif) | 1.3 |
| **Body Large** | 1.125rem (18px) | 400 (Sans) | 1.6 |
| **Body Base** | 1.0rem (16px) | 400 (Sans) | 1.5 |
| **Caption** | 0.875rem (14px) | 500 (Mono) | 1.4 |

## Spacing Scale (Tailwind default + custom)
| Token | Value | Usage |
| :--- | :--- | :--- |
| `space-xs` | 0.5rem (8px) | Internal component padding |
| `space-sm` | 1.0rem (16px) | Component spacing |
| `space-md` | 2.0rem (32px) | Section padding (mobile) |
| `space-lg` | 4.0rem (64px) | Section padding (desktop) |
| `space-xl` | 8.0rem (128px) | Hero/Final Tribute margins |

## Radius & Shadows
| Token | Value | Purpose |
| :--- | :--- | :--- |
| `radius-soft` | 8px | Main card corners |
| `radius-round` | 9999px | Circular profile headshots |
| `shadow-subtle` | 0 4px 6px -1px rgb(0 0 0 / 0.1) | Standard cards |
| `shadow-elevated`| 0 20px 25px -5px rgb(0 0 0 / 0.1) | Modals / Lightbox |

## Motion System (Framer Motion)
| Token | Timing | Easing | Usage |
| :--- | :--- | :--- | :--- |
| `motion-slow` | 0.5s | `ease-in-out` | Page transitions, Hero reveal |
| `motion-base` | 0.3s | `ease-out` | Hover states, Modal entry |
| `motion-fast` | 0.15s | `linear` | Toggle states, Button active |

## Responsive Breakpoints
| Token | Value | Priority |
| :--- | :--- | :--- |
| **Mobile** | < 640px | **Primary** |
| **Tablet** | 768px | Secondary |
| **Desktop** | 1024px | Secondary |
| **Wide** | 1280px | Tertiary |
