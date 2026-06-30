---
description:Read this before implementing or modifying authentication in the project.
---
# Clerk Auth Rules for LinkShortener

This document defines auth behavior for the LinkShortener app.

## Auth policy
- All authentication must use Clerk.
- Do not introduce any other auth method, provider, or custom auth flow.
- Use Clerk components and server-side auth helpers consistently.

## Route behavior
- `/dashboard` is a protected route and must require the user to be logged in.
- If a request reaches `/dashboard` and the user is not authenticated, redirect them to Clerk sign in.
- If a logged-in user tries to access `/` (homepage), redirect them to `/dashboard`.

## Sign in / sign up experience
- Sign in and sign up should use Clerk’s modal flows whenever possible.
- Prefer `SignInButton`, `SignUpButton`, `UserButton`, or Clerk modal APIs.
- Avoid direct app-level replacement with custom non-Clerk auth UI.

## Implementation guidance
- Keep auth checks in app router/server code using `auth()` from `@clerk/nextjs/server` when possible.
- Use Clerk middleware or route guards to enforce protected routes cleanly.
- Keep the app’s auth surface area simple: homepage entry if logged in, dashboard guarded, modal launch for sign in/up.

## Example prompt for follow-up changes
- "Update the homepage so logged-in users are redirected to `/dashboard`, and ensure `/dashboard` is protected by Clerk auth."
- "Replace direct sign-in page links with Clerk modal sign-in and sign-up buttons."
