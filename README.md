# BacIt

BacIt is an independent learning platform for five Pearson IT Specialist subject areas: Python, Databases, Networking, HTML5 Application Development, and Device Configuration and Management.

The new application provides 30 focused lessons, 300 original practice exercises, bilingual English/Russian study notes and interfaces, timed exam simulations, and account-based progress. Each lesson has one English video player next to a separate study companion. Public videos are embedded with their publisher’s player; longer courses use start/end boundaries of 15–30 minutes. Original video files are not downloaded or modified. Russian notes are independently authored explanations, not a video translation or dub.

## Technologies

TanStack Start, React 19, TypeScript, Vite, Tailwind CSS, custom responsive styles, Radix dialogs, and Lucide icons power the application. Netlify Identity handles email/password registration, email confirmation, sign-in, and password recovery. Netlify Functions implement the authenticated learning API. Netlify Database with Drizzle ORM persists lesson completion, exam answers, deadlines, and results.

## Run locally

Use Node 22.13+ or Node 24 and pnpm.

```bash
pnpm install
netlify link
netlify dev --port 8889
```

Open `http://localhost:8889`. Netlify’s local runtime is needed for Identity, Functions, and Database integration. Plain Vite does not emulate these features. Identity was enabled for this project. Email verification and recovery require the configured Identity email delivery; verify those flows on the deployment before inviting students.

The deployment pipeline runs the build and applies migrations from `netlify/database/migrations/`. Do not apply the migration SQL manually. Following a schema change, generate a named migration:

```bash
pnpm exec drizzle-kit generate --name add_descriptive_change
```

The Drizzle packages intentionally use the beta release line because it contains the Netlify Database adapter.

## Application structure

`src/routes/index.tsx` contains the course library, curriculum, lesson workspace, daily practice, exam simulator, progress, resource views, and authentication dialogs. Query parameters preserve the current view, course, chapter, and interface language. `src/lib/courses.ts` contains the bilingual curriculum and source metadata. `src/lib/questions.ts` builds 60 exercises per course from 20 reviewed concept records, using single choice, multiple choice, and matching formats. This bank is original learning content, not a collection of official exam questions.

`netlify/functions/learning.mts` serves `/api/learning`. It derives the user from the verified Identity context, restricts all records to that user, validates submitted answers, rejects writes after the stored deadline, and computes scores on the server. New exam sessions last 50 minutes. An unfinished attempt resumes with the same deadline, including after the browser is closed. Answer writes are queued in the browser, and unsaved answers have an explicit retry flow. Review flags are temporary UI state. Guest practice is not persisted; account progress and exam attempts are stored in Postgres.

## Exam scope and sources

The selected-response practice settings were checked against the public Certiport exam-length page on 25 October 2026. The simulator uses 38 Python questions, 40 Databases, 40 Networking, 39 HTML5, and 36 Device Management questions, within the published ranges. All are 50 minutes. A 70% practice goal is a learning target, not Certiport’s scaled passing score. Python Next Generation’s executable performance environment is not reproduced.

See [the content sources](docs/content-sources.md) for source links, media attribution, and scope. Some videos cover only part of a topic; the bilingual notes and linked documentation complete the lesson. Availability and captions remain controlled by the external publishers.

This is a new implementation. It does not migrate accounts, progress, or video files from the previous BacIt site. BacIt is not affiliated with Certiport or Pearson.

## Verification in this run

Edited files, SDK type declarations, source metadata, and generated migration SQL were reviewed. Files were formatted with Prettier. Local build, test, type-check, and development-server commands were not run; deployment validation is performed by the platform. Live registration, email delivery, and database-backed flows need verification after deployment.
