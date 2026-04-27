# Austin Therapist Exchange

Austin Therapist Exchange is an MVP for a private Austin therapist referral network with:
- a public directory
- public therapist profiles and groups
- a private member workspace for directory, referrals, network, and admin operations

The project is intentionally small and companion-code friendly. The goal is a clean App Router foundation that can ship quickly and evolve without a lot of framework churn.

## Product shape

- Therapists do not freely self-serve into full membership.
- New therapist onboarding is referral-link only for MVP.
- Trusted active therapists can issue referral links.
- The core v1 behavior is: before posting in a Facebook group or listserv, check Austin Therapist Exchange.
- Clients and the public can browse the directory and public group/profile surfaces without logging in.
- Private community features are limited to active therapist members.

## Proposed folder structure

```text
app/
  (public)/
    about/page.tsx
    directory/page.tsx
    directory/[slug]/page.tsx
    groups/page.tsx
    groups/[id]/page.tsx
  auth/
    callback/route.ts
  join/
    apply/page.tsx
  login/
    page.tsx
  (member)/
    member/layout.tsx
    member/page.tsx
    member/feed/page.tsx
    member/groups/page.tsx
    member/groups/[slug]/page.tsx
    member/referrals/page.tsx
    member/endorsements/page.tsx
    member/posts/new/page.tsx
    member/profile/page.tsx
  (admin)/
    admin/layout.tsx
    admin/page.tsx
    admin/join-requests/page.tsx
    admin/reports/page.tsx
  globals.css
  layout.tsx
  page.tsx
src/
  app-actions/
  components/
    auth/
    domain/
    layout/
    state/
    ui/
  lib/
    auth/
    data/
    supabase/
    utils.ts
  types/
supabase/
  schema.sql
```

## Architecture notes

- Route groups mirror product boundaries: public discovery, private therapist workspace, and admin operations.
- Auth guard helpers live in `src/lib/auth/guards.ts` so layouts can protect entire route sections without adding middleware too early.
- `profiles` stores account-level identity, membership state, and trusted-referrer status, while `therapist_profiles` stores public professional details.
- `therapist_profiles` now centers three public buckets: clinical fit, relational fit, and trust signals.
- `posts` acts as the shared feed object and typed tables such as `jobs`, `referral_requests`, and `consultation_requests` hold the specific fields for each post type.
- Public groups and public trusted-by endorsements can be shown outside auth, but all private collaboration tables are policy-protected.
- Austin is the first market, but geography is modeled as `market_slug`, `city`, `state_region`, and `country_code` rather than hardcoding Austin-only assumptions.
- Mock data lives in `src/lib/data/mock-data.ts` so the UI can move quickly before real queries are wired.
- Therapist onboarding is referral-link only for MVP: trusted active therapists create invitations, and join requests must reference that invitation and its sponsor.
- Trusted-referrer UX lives in `/member/referrals`, while `/join/apply` accepts referral codes directly or via a prefilled `?code=` link.
- First successful auth bootstraps `profiles` and `therapist_profiles` rows automatically if they do not exist yet.
- Availability is intentionally lightweight in v1: a manual status plus freshness timestamp rather than a scheduling system.

## Local development

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Start the app:
```bash
npm run dev
```

4. Optional Cloudflare preview:
```bash
npm run preview
```

## Environment variables

Required locally:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:
- The app accepts either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and should never be exposed in client code.

## Auth and profile bootstrap

Current auth flow:
- `/login` uses Supabase email magic links.
- `/auth/callback` exchanges the auth code for a session.
- After sign-in, the app bootstraps `profiles` and `therapist_profiles` if they do not already exist.

Bootstrap defaults:
- `role = therapist`
- `membership_state = pending`
- `market_slug = austin-tx`
- `therapist_profiles.is_public = false`

Why this matters:
- A therapist can authenticate successfully before being fully active in Austin Therapist Exchange.
- The app can safely create the base rows it needs without granting member access automatically.
- Admin approval or your invitation workflow can still promote the therapist to `active` later.

Bootstrap code lives in [src/lib/auth/bootstrap.ts](/Users/leilaanderson/Documents/atx-therapy-collective/src/lib/auth/bootstrap.ts).

## Roles and permissions

- `client`: unauthenticated or basic public viewer; can browse public directory, public profiles, public groups.
- `therapist`: authenticated therapist account; may still be `pending`, `rejected`, or `suspended`.
- `active therapist member`: therapist with `membership_state = 'active'`; can access the private workspace, create posts, join private groups, and endorse peers.
- `group practice owner`: not a separate role in v1; represented by the same therapist/member model and profile structure.
- `trusted referrer`: active therapist with `can_issue_referrals = true`; can create referral links for new therapist applications.
- `admin`: can review join requests, manage membership states, grant referrer privileges, and moderate content.

## RLS strategy

- Treat `profiles.membership_state` as the core gate used by helper functions in policies.
- Treat `profiles.can_issue_referrals` as the second gate for invitation issuance.
- Allow anonymous reads only on explicitly public slices: public therapist profiles, public endorsements, and public groups.
- Keep trust logic simple in v1: no weighted reputation, no top-tier badges, and no social-graph ranking.
- Restrict inserts and updates on private collaboration tables to active therapists and admins.
- Allow members to edit only their own profile and therapist profile rows.
- Reserve membership-state changes, moderation actions, and referrer privilege changes to admins, while trusted therapists can issue referral links.
- Use Supabase storage separately later for avatars and verification uploads; keep the MVP schema focused on relational flows first.

## Database

- The current schema lives in [supabase/schema.sql](/Users/leilaanderson/Documents/atx-therapy-collective/supabase/schema.sql).
- It includes:
  - profiles
  - therapist_profiles
  - invitations
  - join_requests
  - groups and group_memberships
  - posts and typed post detail tables
  - endorsements
  - moderation_reports

Important behavior:
- invitation/referral links are the only therapist onboarding path in MVP
- endorsements only count from active therapist members
- therapist profiles now include insurance tags, therapy style tags, availability status, and freshness
- referral requests prepare for lightweight future statuses such as `declined` and `closed`
- public and private data are separated by both route structure and RLS

## Cloudflare deployment note

- This scaffold stays server-component friendly and avoids Node-only runtime assumptions.
- This repo is now set up for Cloudflare Workers using OpenNext via [open-next.config.ts](/Users/leilaanderson/Documents/atx-therapy-collective/open-next.config.ts) and [wrangler.jsonc](/Users/leilaanderson/Documents/atx-therapy-collective/wrangler.jsonc).
- The current Wrangler config targets Cloudflare account `70b02f5e4f717f3928d82b4d7d0d31c4` and is configured for `austintherapistexchange.com`.
- Use Node `22.17.0` for Cloudflare builds and local deploys. This repo pins that version in [.nvmrc](/Users/leilaanderson/Documents/atx-therapy-collective/.nvmrc) and [.node-version](/Users/leilaanderson/Documents/atx-therapy-collective/.node-version).
- Use `npm run preview` to run the OpenNext Worker locally and `npm run deploy` to deploy.
- Keep `SUPABASE_SERVICE_ROLE_KEY` as a Cloudflare secret, not a public variable.

Primary production URL:
- [https://austintherapistexchange.com](https://austintherapistexchange.com)

Deploy flow:
```bash
npm run deploy
```

Set the Cloudflare secret once with:
```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --config ./wrangler.jsonc --name austin-therapist-exchange
```

### Workers Builds settings

For Cloudflare Git-based builds, use:

- Build command: `npm run cf:build`
- Deploy command: `npm run cf:deploy`
- Non-production branch deploy command: `npm run cf:upload`
- Root directory: `/`

Recommended:

- Production branch: `main`
- Non-production branch builds: enabled
- Build cache: enabled

This matches Cloudflare's two-step build/deploy model and avoids re-running the full OpenNext build inside the deploy step.

## TODO next

- Replace mock data with server-side Supabase queries and server actions.
- Add proper form feedback states with `useActionState` once the insert flows are real.
- Confirm the custom domain is active in Cloudflare and Supabase auth settings.
- Replace placeholder join-request and invitation server actions with real Supabase writes.
- Add an admin UI for promoting `pending` therapists to `active`.
- Add lightweight availability check-ins and member-side decline/close actions for referral requests.
