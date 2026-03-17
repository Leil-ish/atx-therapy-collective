# Decision Memo: Evaluating the Proposed Therapist Onboarding Roadmap

## Summary

The proposed 5-page onboarding flow is too heavy for the current ATX Therapy Collective MVP.

It asks new members to do too much unpaid profile setup before they have experienced any value, and it drifts away from the product's current posture: referral-link-based entry, lightweight activation, and fast referral usefulness over exhaustive profile completeness.

The right v1 move is not to polish this 5-page flow. The right move is to replace it with a shorter staged onboarding:

1. Keep referral-link intake minimal before sign-in.
2. Ask for only the profile fields that materially improve first-use referral quality right after sign-in.
3. Defer invitations, endorsements, richer taxonomy, and community discovery until the member has context and trust.

The product should optimize for this outcome: a trusted therapist can join quickly, become referable quickly, and understand the network quickly.

## Current MVP Baseline

The existing product already implies a clear strategy:

- [`/Users/leilaanderson/Documents/atx-therapy-collective/app/join/apply/page.tsx`](/Users/leilaanderson/Documents/atx-therapy-collective/app/join/apply/page.tsx) explicitly says first-pass onboarding should stay minimal and the rest of the profile can be completed after sign-in.
- [`/Users/leilaanderson/Documents/atx-therapy-collective/app/(member)/member/profile/page.tsx`](/Users/leilaanderson/Documents/atx-therapy-collective/app/(member)/member/profile/page.tsx) currently treats profile setup as lightweight: website, specialties, style tags, and availability.
- [`/Users/leilaanderson/Documents/atx-therapy-collective/README.md`](/Users/leilaanderson/Documents/atx-therapy-collective/README.md) frames the public product around fit, style, trust, and availability rather than a giant filter tree.
- [`/Users/leilaanderson/Documents/atx-therapy-collective/supabase/schema.sql`](/Users/leilaanderson/Documents/atx-therapy-collective/supabase/schema.sql) already supports many profile fields, but schema support is not a reason to collect all of them up front.

This matters because the roadmap should be judged against the product you are actually building, not the product you could theoretically model in the database.

## Overall Verdict

Do not ship the proposed roadmap largely as written.

The draft has good instincts:

- availability is high-value
- payment model and care format matter for referrals
- trust and endorsements matter
- post-signup perceived value matters

But the flow bundles too many different jobs into onboarding:

- account setup
- professional credential setup
- referral-search taxonomy
- public profile authoring
- social graph seeding
- community activation

That is too much for a new member to complete before they know whether the network is useful.

The strongest version of this product is opinionated and narrow:

- joining should be fast
- profile completion should focus on fields another therapist uses to make a referral decision
- social trust should deepen over time, not be demanded on day one
- the first destination after onboarding should help the member see useful people and current activity, not complete more social chores

## Page-by-Page Evaluation

### Page 1: Account

**Verdict:** keep only the account essentials; move the rest out.

What works:

- Name, license/credentials, email, and password are reasonable account-level setup fields.
- The instinct behind "what types of referrals are you currently looking for?" is good because it tries to create immediate buy-in.

What does not work:

- "What referrals are you looking for?" is not actually an account field.
- It blends together at least three concepts: populations served, desired referrals, and search/discovery metadata.
- Asking this before the therapist has even entered the product creates work without clear payoff.

Recommendation:

- Keep account creation minimal.
- If credentials are needed for trust/admin review, collect them in a lightweight professional info step after sign-in or in the join request if required operationally.
- Do not put "currently looking for referrals" in the initial account page.
- If you keep that concept at all, treat it as an optional later-facing matchmaking or feed-personalization signal, not a required onboarding gate.

### Page 2: Clinical Info

**Verdict:** keep location and care format; simplify payment model.

What works:

- Therapy setting can matter, but it is lower value than actual referral fit.
- Telehealth/in-person/both is highly useful.
- Neighborhood/area is useful for Austin referrals.
- Private pay vs insurance vs both is useful.

What does not work:

- Rate collection is too detailed for v1 profile setup unless rate transparency is a core part of the product promise.
- "Private practice / group practice / treatment center" is likely lower-value than the therapist's actual referral fit and availability.
- This page begins to feel like directory taxonomy expansion rather than activation.

Recommendation:

- Keep care format: telehealth, in-person, both.
- Keep neighborhood/area if the UI stays constrained to Austin-oriented choices.
- Keep payment model at a simple level.
- Defer rate and sliding-scale detail unless you are confident therapists will maintain it and referrals depend on it.
- Therapy setting can be optional or deferred.

### Page 3: Clinical Focus

**Verdict:** this page contains the most valuable information, but it is too broad in its current shape.

What works:

- Availability is one of the highest-value fields in the whole roadmap.
- A quick status signal is exactly aligned with the current MVP.
- Specialties matter.
- Treatment style/modality can improve fit when kept light.

What does not work:

- This page mixes three layers of signal: operational availability, public specialty tags, and nuanced clinical orientation.
- A hard "select 5 max" on specialties is probably too blunt if it is enforced early.
- A long modality list risks creating checkbox bloat and profile sameness.
- Asking people to fill in broad taxonomies manually during onboarding creates drop-off and noisy data.

Recommendation:

- Availability should stay and should be fast to update.
- Specialties should be collected, but with a curated multi-select rather than open text.
- Do not over-index on modality granularity in onboarding.
- Keep only a small number of high-signal style/modality tags in v1.
- If there is a limit, make it soft product guidance rather than a rigid constraint unless search quality clearly improves with enforcement.

### Page 4: Profile

**Verdict:** keep the short bio; cut invitation and reciprocal endorsement from onboarding.

What works:

- A short bio and "how would you describe your approach?" are useful for public profile quality.
- A profile photo can help trust, but it is not essential for activation.

What does not work:

- Asking a brand-new member to invite 1 to 3 colleagues immediately is too early.
- Asking them to write endorsements during onboarding adds social pressure before they have experienced the network.
- Reciprocal endorsement language feels transactional and awkward for a trust-based professional community.
- This section turns onboarding into growth mechanics before the member has received value.

Recommendation:

- Keep short profile writing lightweight.
- Make profile photo optional.
- Remove invitations from onboarding.
- Remove reciprocal endorsements from onboarding.
- Introduce invitations only after the member is active and understands the network's standards.
- Introduce endorsements only after there is enough relationship context for them to feel credible.

### Page 5: Review

**Verdict:** keep the spirit of momentum, but send the user somewhere more useful.

What works:

- A review step can reassure the member and create a moment of completion.
- "Thanks for helping build a trusted referral network in Austin" is directionally strong.

What does not work:

- A popup plus "Explore the network" is not specific enough.
- Sending people to a vague community page with events risks burying the core use case.
- "Clinicians you may know" is a nice future affordance, but it is not the best first-value surface for v1.

Recommendation:

- After initial setup, send the member to the most useful action-oriented destination.
- In v1, that should be the member feed or a tightly scoped member home showing:
  - current referral activity
  - visible therapist profiles
  - their current profile completeness and availability status
- Community events can exist, but they should not be the primary success moment for onboarding.

## What To Keep

- Referral-link-based entry
- Minimal intake before sign-in
- Availability status as a prominent profile field
- Care format: telehealth, in-person, both
- Austin neighborhood/area
- Simple payment model
- A short bio or approach summary
- Specialties, as a curated and lightweight selection

## What To Cut Or Defer From V1

- A 5-page required onboarding flow
- "What referrals are you currently looking for?" as a required early field
- Mandatory 1 to 3 colleague invites during onboarding
- Reciprocal endorsement prompts during onboarding
- Detailed rate collection
- Large modality taxonomy in required onboarding
- Community-page-first completion flow
- "Clinicians you may know" as a core onboarding dependency

## What To Merge, Reorder, Or Stage Later

- Merge account setup and referral-link intake into one lightweight join step.
- Move most profile enrichment to after sign-in.
- Keep operational referral fields before long-form profile writing.
- Stage trust-building features after activation:
  - invite trusted colleagues later
  - endorse later
  - explore community later
- Treat advanced taxonomy as profile enrichment, not activation.

## Recommended Replacement Flow For MVP

### Stage 0: Referral Application

Use the current lightweight posture on [`/Users/leilaanderson/Documents/atx-therapy-collective/app/join/apply/page.tsx`](/Users/leilaanderson/Documents/atx-therapy-collective/app/join/apply/page.tsx).

Collect only:

- name
- email
- referral code
- optional website
- optional short practice note

If operationally necessary for review, also collect:

- credentials
- license number

Do not collect discovery taxonomy here.

### Stage 1: Post-Sign-In Activation

Immediately after sign-in, ask for only the fields that make the therapist referable:

- public display name
- credentials
- telehealth / in-person / both
- neighborhood or area
- payment model: private pay / insurance / both
- availability status
- 3 to 5 specialties
- short bio or approach summary

This should be one tight setup flow, not five pages.

### Stage 2: Member Value Landing

Send the therapist to a member home or feed that proves the network is alive.

Prioritize:

- current referral requests
- visible member activity
- quick access to edit availability
- quick access to finish profile later

This should be action-first, not community-ceremony-first.

### Stage 3: Optional Enrichment

After activation, allow members to add:

- additional modalities
- populations served
- profile photo
- more detailed payment information
- insurance specifics
- neighborhoods beyond the primary area

### Stage 4: Trust Expansion

Only after the member has context should the product prompt them to:

- invite trusted colleagues
- endorse therapists they genuinely know
- join groups or community spaces

## Field Classification

### Ship In MVP

- Full name
- Email
- Referral code
- Credentials or license label
- Optional website
- Telehealth / in-person / both
- Neighborhood or area
- Payment model: private pay / insurance / both
- Availability status
- Specialties
- Short bio or approach summary

### Collect Later

- Populations served
- Treatment style or modality tags beyond a minimal starter set
- Profile photo
- Sliding-scale indicator
- Insurance carrier detail
- Therapy setting
- Detailed geographic coverage
- "Currently looking for referrals" preference data

### Do Not Build Yet

- Mandatory invitation flow during onboarding
- Mandatory endorsement writing during onboarding
- Reciprocal endorsement prompt during onboarding
- Community-events-first completion path
- "Clinicians you may know" as a required launch feature
- Rate field as a required onboarding step

## Key Product Decisions

### Replace the 5-page flow

Yes. Replace it with staged onboarding.

The product is too early and too trust-sensitive to front-load everything.

### "What referrals are you currently looking for?"

Do not make this part of required onboarding.

If the concept survives, it should become one of these later:

- an optional profile preference
- a feed-personalization signal
- a future matchmaking input

It should not be overloaded as both buy-in copy and directory taxonomy.

### Limits on specialties and populations

Avoid rigid limits early unless search quality depends on them.

For MVP:

- specialties can have a practical cap or UI guidance
- populations should be deferred rather than tightly constrained

The bigger problem is not the exact number. The bigger problem is asking for too much too soon.

### Payment, location, and availability vs clinical taxonomy

Payment model, care format, neighborhood, and availability are more important than deep taxonomy for first-release usefulness.

These fields improve referral success immediately because they answer practical screening questions fast.

### Invitations and reciprocal endorsements

These should not be part of onboarding.

They create social obligation before trust has had a chance to become earned and contextual.

### Post-onboarding destination

Make it action-first.

The best first destination is a member home or feed that helps the therapist:

- see active referrals
- understand who is in the network
- update their availability quickly

Community can support retention later, but it should not be the primary activation surface.

## Risks If The Original Roadmap Ships Mostly As Written

- Lower onboarding completion due to too many required decisions
- More profile noise from therapists selecting broad tags just to get through setup
- Weaker perceived value because the product asks for labor before proving utility
- Awkward trust dynamics from early invitation and endorsement prompts
- More operational complexity for admins reviewing richer but not necessarily better intake data
- Drift away from the current clear MVP story

## Implementation Fit With The Current App

The current app already supports most of the recommended staged approach.

Strong alignment with existing system:

- `join_requests` already supports lightweight application data
- `therapist_profiles` already supports specialties, populations, neighborhoods, modalities, availability, and bio
- endorsements and invitations already exist as separate trust features

What should change conceptually:

- do not treat every supported field in `therapist_profiles` as required onboarding input
- preserve the current distinction between minimal join flow and later profile completion
- keep endorsements and invitations as separate member actions, not onboarding obligations

## Recommendation

Ship a staged onboarding flow centered on fast activation, not a comprehensive 5-page intake.

The MVP should answer one question well: can a trusted Austin therapist join quickly and become meaningfully referable with minimal setup?

If yes, the rest of the profile system can deepen over time. If no, a richer onboarding flow will only make the product feel heavier before it has earned that weight.
