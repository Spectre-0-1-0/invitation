# 12 Content Collection Plan

This strategy outlines how we will acquire, validate, and organize the content for the College Memory Archive.

## Content Inventory & Acquisition

| Content Type | Owner | Source | Collection Method | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Senior Profiles** | Class Reps | Student Records | Google Form (Name, Major, Quote, Achievement) | High |
| **Headshots** | Seniors | Personal/LinkedIn | Direct Upload via Form (Min 800x800px) | High |
| **Candid Photos** | All Seniors | Phone Galleries | Shared Google Drive / DropBox Request Link | High |
| **Event Photos** | Photography Club | Official Archives | Metadata-tagged Export (Bulk) | Medium |
| **Farewell Messages**| Friends/Faculty| Open Invite | Web Form / WhatsApp Bot | Medium |
| **Videos** | All Seniors | Reels/TikToks | Shared Drive (Horizontal & Vertical) | Medium |
| **Inside Joke Memes**| Seniors | Chat Groups | Curated Selection by "Meme Committee" | Low |
| **University Stats** | Administration | Official Records | Direct Request (Graduation counts, etc.) | Low |

## Validation & Metadata Requirements

### Photos & Videos
- **Format:** JPEG/PNG (Photos), MP4/MOV (Videos).
- **Resolution:** Minimum 1080p for main gallery; 800px for profiles.
- **Metadata:** Each item must have:
    - `title`: Short descriptive name.
    - `date`: approximate month/year.
    - `taggedSeniors`: List of IDs appearing in the content.
    - `category`: Candid, Event, or Milestone.

### Profiles
- **Quotes:** Checked for length (max 200 chars) and appropriateness.
- **Achievements:** Verified against official honors list.

## Collection Workflow
1.  **Preparation (Week 1):** Set up Google Form and Shared Drive structure.
2.  **Launch (Week 2):** Send announcement to senior WhatsApp groups and email lists.
3.  **Curation (Week 3):** Archive team downloads, renames, and sorts assets into `/public/content` folders.
4.  **Metadata Entry (Week 4):** Populate `seniors.json`, `memories.json`, etc., with verified info.
5.  **Final Polish (Week 5):** Review all content for quality and emotional flow.

## Storage Strategy
- **Raw Assets:** Retained in Google Drive for original quality.
- **Production Assets:** Optimized/compressed and stored in `/public/content/` within the repository.
