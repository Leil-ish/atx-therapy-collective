# MVP Bootstrap Runbook

This is the fastest path to dogfood the real invite-only MVP with your own account.

## 1. Apply schema changes in Supabase

Before using the new MVP flows, apply the latest schema in [`supabase/schema.sql`](/Users/leilaanderson/Documents/atx-therapy-collective/supabase/schema.sql) to your Supabase project.

Important new fields used by the app:

- `therapist_profiles.payment_model`
- `join_requests.grant_referral_access`

## 2. Create your auth user

Use the app once to create your Supabase auth user:

1. Start the app with `npm run dev`
2. Open `/login`
3. Request a magic link for your email
4. Click the magic link

You do not need to be approved yet. This step only ensures a real `auth.users` record exists for your email.

## 3. Promote yourself to the first admin

Run:

```bash
npm run bootstrap:mvp -- admin --email you@example.com --name "Your Name"
```

What this does:

- finds your Supabase auth user by email
- creates or updates your `profiles` row as `role = admin`
- sets `membership_state = active`
- grants `can_issue_referrals = true`
- creates or updates your `therapist_profiles` row

If the script says no auth user exists yet, go back to step 2 and create the user via magic link first.

## 4. Create your first referral link

Open invite:

```bash
npm run bootstrap:mvp -- invite --sponsor-email you@example.com
```

Reserved invite:

```bash
npm run bootstrap:mvp -- invite --sponsor-email you@example.com --invitee-email colleague@example.com
```

Optional flags:

- `--max-uses 1`
- `--expires-days 30`
- `--code ATX-CUSTOM`

## 5. Run your own real MVP pass

Once you are the first active admin/trusted referrer:

1. Sign in to the app
2. Complete your profile in `/member/profile`
3. Turn on public visibility if you want your profile in the directory
4. Create a referral link in `/member/referrals` or with the script above
5. Use that invite flow for your next therapist
6. Approve their join request in `/admin/join-requests`

## Notes

- The app keeps the 2-step entry path: apply first, sign in after approval.
- The script uses `SUPABASE_SERVICE_ROLE_KEY`, so run it only from your local trusted environment.
- You can also set or reset an initial password for an existing auth user:

```bash
npm run bootstrap:mvp -- password --email you@example.com --password 'TempPassword123!'
```

- Members can later update their own password in [`/member/profile`](/Users/leilaanderson/Documents/atx-therapy-collective/app/(member)/member/profile/page.tsx).
