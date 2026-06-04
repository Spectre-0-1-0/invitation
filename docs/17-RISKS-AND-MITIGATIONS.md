# 17 Risks and Mitigations

Identifying potential hurdles early allows for smoother execution and better management of stakeholder expectations.

## 1. Content Collection Risks
- **Risk:** Incomplete data (missing senior headshots or quotes).
- **Impact:** High. Makes the "People" section look unfinished.
- **Mitigation:** Use a high-quality "Default" placeholder headshot and a standard "Looking forward to the future" quote if data is missing. Provide a clear deadline and frequent reminders.

## 2. Performance Risks
- **Risk:** Large media assets slowing down the site (especially on mobile).
- **Impact:** High. Visitors may bounce before the "Hero" loads.
- **Mitigation:**
    - Use Next.js Image Optimization (`next/image`).
    - Use low-quality image placeholders (LQIP) during loading.
    - Host videos on a dedicated CDN or optimize heavily for web streaming.
    - Implement lazy loading for the gallery masonry.

## 3. Design Consistency Risks
- **Risk:** The "Nostalgic" vibe feeling "dated" or "cluttered."
- **Impact:** Medium. Affects user enjoyment.
- **Mitigation:** Adhere strictly to the Design Tokens in `docs/11`. Balance serif typography with clean, modern whitespace and high-quality modern transitions.

## 4. Scope Creep Risks
- **Risk:** Adding "just one more feature" (e.g., likes, comments, live search).
- **Impact:** Medium. Delays the graduation-day launch.
- **Mitigation:** Stick to the static-first V1 plan defined in `docs/01`. Log all feature requests in a "V2" wishlist and focus entirely on the core storytelling experience for V1.

## 5. Deployment Risks
- **Risk:** Site crashing under high traffic on graduation day.
- **Impact:** High.
- **Mitigation:** Deploy as a fully static site on Vercel's Edge Network. Ensure no client-side dependencies are calling external APIs that might throttle or fail.

## 6. Privacy & Sentiment Risks
- **Risk:** Public display of a photo or quote someone later wants removed.
- **Impact:** Medium.
- **Mitigation:** Provide a simple "Report/Remove Content" link in the footer that sends an email to the admin team for quick manual removal from the JSON/repository.
