# BacIt architecture and conventions

BacIt is a bilingual English/Russian IT Specialist preparation application using TanStack Start, React 19, TypeScript, Tailwind 4, Radix dialogs, and Netlify services. This is a new version built from a public reference site, not a checkout of the original site.

## Key directories

- `src/routes/__root.tsx`: HTML document and finished sharing metadata. The platform supplies the sharing image; do not add an `og:image`.
- `src/routes/index.tsx`: application shell and all learning views; `view`, `course`, `chapter`, and `lang` query parameters preserve navigation. It includes the custom Identity forms, short-video lesson workspace, practice UI, exam session UI, and result review.
- `src/lib/courses.ts`: five curricula, six lessons each, bilingual notes, video IDs, chapter boundaries in seconds, documentation URLs, official exam ranges, and publisher attribution.
- `src/lib/questions.ts`: 100 bilingual concepts expanded into 300 original exercises, with stable IDs, module associations, answer keys, explanations, and shared grading. Stable question IDs must remain compatible with saved attempts. If changing a published question’s meaning, create a new ID rather than reusing it.
- `src/styles.css`: custom sage/cream learning workspace with pastel course artwork, CSS code-window illustration, responsive sidebar, and reduced-motion support.
- `db/schema.ts`: Drizzle tables for lesson completion and exam attempts. `db/index.ts` uses the `drizzle-orm/netlify-db` adapter.
- `netlify/functions/learning.mts`: authenticated `/api/learning` API. Uses the modern Netlify Request/Response runtime.
- `netlify/database/migrations/`: generated SQL and snapshots; migrations are applied by the deployment platform.
- `docs/content-sources.md`: public source provenance and instructional limitations.

## Data and authentication

Use `@netlify/identity`, not deprecated Identity packages. The installed v2 User type uses `confirmedAt` to detect confirmed email addresses; it does not expose `emailVerified`. Process confirmation and password-recovery callbacks with `handleAuthCallback()`. Identity has already been activated for this site.

Never trust a client-provided user ID. The learning function obtains the user from the trusted Identity context, enforces ownership, checks same-origin browser mutations, validates input, and rejects answer updates after the stored deadline. Scores are computed on the server from saved answers. The client’s timer is presentation only; the server’s deadline controls acceptance. Retain the serialized answer-write queue and unsaved-answer retry handling.

Persist user records in Netlify Database with Drizzle. Do not use local JSON, browser storage, or in-memory collections as a replacement for account progress. Static authored curriculum and question content may stay in source files. Temporary navigation, practice answers, and review flags are UI state; review flags intentionally do not persist across reloads.

## Content conventions

Use `{en, ru}` values for authored text. The English video and independently authored Russian notes appear side by side, with a notes-language switch. Do not imply that Russian audio or translated captions are provided. All lesson excerpts must last 900–1800 seconds and stay within the actual video duration. Use publisher start/end timestamps and preserve attribution and original links. Use public embeds; do not download or rehost third-party videos without permission.

The exam simulator is independent practice, not an official Certiport replica. Keep the published question ranges and 50-minute timing with source links. Do not claim access to official protected question banks, identical scoring, or support for Python Next Generation performance tasks. The 70% practice goal is not a conversion to Certiport’s scaled score. Exercise totals count the three learning formats per concept; the current bank contains 20 concepts and 60 exercises per course.

## Implementation conventions

Use typed React functions, accessible button labels, real loading/error/empty states, and Radix dialogs for focus management. Browser globals must be accessed in effects or event handlers so SSR remains safe. Use `@/` imports within `src`, and `.js` extensions for cross-directory ESM imports from Functions/Database code. Preserve user ownership checks and deadlines when modifying persistence.

The Drizzle Netlify adapter requires the installed beta release line. Keep the schema and migration snapshots synchronized. After schema changes run `pnpm exec drizzle-kit generate --name <descriptive_snake_case_name>`; never run `push`, `migrate`, or raw DDL against the managed database. Do not edit already-applied migrations.

## Local runtime and deployment

Install with `pnpm install`. Use `netlify dev --port 8889` when a local runtime is authorized. The project’s Netlify adapter builds and deploys the TanStack application; standalone Functions live in `netlify/functions`. The current platform workflow handles builds and checks automatically, so follow the active run’s restrictions before running any local verification commands. Never read or print credentials or environment values.
