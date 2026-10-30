# RETROVA

A personal browser-based retro gaming library. Each user builds a private collection from game files they are legally entitled to use.

## Current stage

**Frontend foundation / visual prototype.** The current branch implements the first dashboard direction with an honest empty-library state.

Implemented in this stage:
- Responsive dark premium dashboard (desktop, tablet and mobile).
- Sidebar navigation between home, library, systems, achievements, friends and profile.
- Empty states instead of invented games, friends, achievements or activity.
- ROM file selection UI with basic filename-extension validation.
- Console/system list clearly marked as under evaluation.
- Explicit UI copy distinguishing this frontend prototype from backend features.

Backend foundation added in this branch:
- Supabase browser client configured through environment variables (no secret/service-role key in the frontend).
- Private `private-roms` Storage bucket migration with per-user RLS policies.
- ROM storage helpers for validation, upload, listing and deletion under the authenticated user's folder.

Still not implemented:
- Login/sign-up UI connected to the dashboard.
- Applying the migration to a real Supabase project and configuring credentials.
- A database catalog of uploaded ROM metadata and library UI wired to storage.
- Reliable ROM identification and metadata lookup.
- Browser emulator integration.
- Gamepad mapping, save files and cloud synchronization.
- Real achievements, friends, presence and social features.

The file picker currently selects a file in the browser only. It does **not** upload, store, identify or run a ROM. Do not treat the prototype as a functioning emulator.

## Development

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Stack

- React
- TypeScript
- Vite
- Lucide React
- CSS

## Privacy and copyright principles

- A user's ROM files must remain private to that user.
- Never commit ROMs, BIOS files, copyrighted game assets or user uploads to this repository.
- Do not build a shared catalogue of commercial ROM downloads.
- Storage access must be enforced server-side, not merely hidden in the interface.
- Compatibility must be validated per system before it is advertised as supported.


## Supabase setup (not yet connected to a project)

1. Create a Supabase project under your own account. No project was created automatically.
2. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the project settings. Never use a service-role/secret key in the browser.
3. Apply `supabase/migrations/20261030000100_private_rom_storage.sql` in the Supabase SQL Editor.
4. Configure allowed authentication redirect URLs in Supabase Auth before enabling sign-in.

The Storage bucket is private and policy checks the first path segment against the authenticated user's ID. The frontend's file extension/size checks are only usability checks; server-side Storage policy and bucket limits remain the security boundary. ROM formats vary by console, and the current extension allowlist is preliminary.
