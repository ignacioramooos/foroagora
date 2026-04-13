

## Plan: Content Library + Admin Panel

### What We're Building

1. **Content Library** (student-facing dashboard tab "Clases") — browse recorded classes (YouTube unlisted embeds), articles, and materials organized by modules
2. **Admin Panel** (separate `/admin` route) — full CRUD for managing classes, articles, and materials, restricted to verified admin users

### Database Changes (Migration)

**New tables:**

- `user_roles` — role-based access (admin/user) using `app_role` enum and a `has_role()` security definer function
- `content_items` — unified content table with columns: `id`, `title`, `description`, `type` (enum: `video`, `article`, `material`), `youtube_url` (for unlisted video embeds), `content_body` (rich text for articles), `file_url` (for downloadable materials), `module_name`, `thumbnail_url`, `duration_minutes`, `sort_order`, `is_published`, `created_by` (user_id), `created_at`, `updated_at`

**RLS policies:**
- Everyone authenticated can SELECT published content
- Only admins (via `has_role()`) can INSERT/UPDATE/DELETE

**Seed data:** Insert your user as admin in `user_roles`

### Frontend Components

**Student side:**
- `ContentLibrary.tsx` — new dashboard tab showing content cards grouped by type (Videos, Artículos, Materiales), with YouTube iframe embeds for videos
- Add "Clases" tab to `DashboardLayout.tsx` nav items

**Admin side:**
- `AdminPage.tsx` — route `/admin` protected by role check
- `AdminLayout.tsx` — sidebar with sections: Clases, Artículos, Materiales
- `AdminContentManager.tsx` — table listing all content with add/edit/delete
- `ContentFormDialog.tsx` — modal form for creating/editing content (title, description, type selector, YouTube URL input, article body textarea, file URL, module, publish toggle)

### Routing

- Add `/admin` route in `App.tsx`, only accessible to authenticated users with admin role
- Add admin link in dashboard sidebar (visible only to admins)

### Technical Details

- Admin role check uses `has_role(auth.uid(), 'admin')` security definer function to avoid RLS recursion
- YouTube embeds use `iframe` with `youtube-nocookie.com` for privacy
- Content type enum controls which fields are shown in the form (video → YouTube URL, article → body text, material → file URL)
- No file upload needed initially — videos are YouTube URLs, materials are external links

