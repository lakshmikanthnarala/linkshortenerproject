# Agent Instructions for LinkShortener Project

This is extremely important: BEFORE generating any code, you MUST read the relevant individual instruction files in the '/docs' directory. Do not skip this step. The docs files are the source of truth for project-specific requirements, and failing to read them before coding is not acceptable.

## Core expectations
- Follow the existing project structure and conventions.
- Prefer small, maintainable changes over large rewrites.
- Keep TypeScript code clear, explicit, and easy to follow.
- Preserve the current application architecture unless a task explicitly requires a deliberate change.

## Project structure
- app/: App Router pages and layouts.
- components/ui/: reusable UI primitives.
- db/: database schema and database connection helpers.
- lib/: shared helper utilities.
- docs/: project-specific instruction files for agents.

## Auth documentation
- Consult `/docs/auth.md` for Clerk auth rules and protected-route behavior.

## Required conventions
- Use the App Router pattern in app/.
- Keep components focused and composable.
- Prefer server components by default.
- Only use client components when browser interactivity is required.
- Use Tailwind utility classes for styling.
- Reuse existing UI components before creating new ones.
- Keep database access centralized in the db layer.
- Use Clerk auth patterns consistently where authentication is involved.

## Working style
- Read the relevant files before editing them.
- Make the smallest change that resolves the task.
- Preserve existing behavior unless the request explicitly changes it.
- Avoid adding unnecessary dependencies.
- Do not hardcode secrets or environment-specific values.

## Documentation guidance
- Keep this root instructions file concise and high level.
- Place detailed guidance in separate Markdown files inside docs/.
- When introducing a new pattern or workflow, add or update the relevant document in docs/.


