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

Not implemented yet:
- Authentication and account management.
- Private ROM upload/storage and per-user access control.
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
