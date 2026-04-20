create extension if not exists pgcrypto;

create type public.app_role as enum ('client', 'therapist', 'admin');
create type public.membership_state as enum ('pending', 'active', 'rejected', 'suspended');
create type public.group_visibility as enum ('public', 'private_member_only');
create type public.post_kind as enum ('referral_request', 'consultation_request', 'job');
create type public.availability_status as enum ('accepting', 'waitlist', 'full');
create type public.referral_status as enum ('open', 'matched', 'declined', 'closed');
create type public.moderation_target_type as enum ('post', 'endorsement', 'group', 'profile');
create type public.moderation_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.payment_model as enum ('private_pay', 'insurance', 'both');
create type public.membership_tier as enum ('free', 'premium');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'therapist',
  membership_state public.membership_state not null default 'pending',
  full_name text not null,
  slug text unique,
  avatar_url text,
  city text,
  state_region text,
  country_code text not null default 'US',
  market_slug text not null default 'austin-tx',
  invite_code_used text,
  can_issue_referrals boolean not null default false,
  membership_tier public.membership_tier not null default 'free',
  trusted_referrer_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references public.profiles(id),
  rejected_at timestamptz,
  suspended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.therapist_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  public_display_name text not null,
  credentials text,
  title text,
  headline text,
  bio text,
  specialties text[] not null default '{}',
  insurance_accepted text[] not null default '{}',
  payment_model public.payment_model not null default 'both',
  modalities text[] not null default '{}',
  therapy_style_tags text[] not null default '{}',
  populations text[] not null default '{}',
  neighborhoods text[] not null default '{}',
  approach_summary text,
  featured_links text[] not null default '{}',
  offerings text[] not null default '{}',
  website_url text,
  booking_url text,
  public_email text,
  public_phone text,
  offers_in_person boolean not null default true,
  offers_telehealth boolean not null default true,
  availability_status public.availability_status not null default 'waitlist',
  availability_updated_at timestamptz not null default now(),
  accepting_referrals boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  invited_email text,
  market_slug text not null default 'austin-tx',
  invited_by uuid not null references public.profiles(id),
  max_uses integer not null default 1,
  use_count integer not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  accepted_at timestamptz,
  accepted_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  constraint invitations_max_uses_check check (max_uses > 0),
  constraint invitations_use_count_check check (use_count >= 0 and use_count <= max_uses)
);

create table public.join_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  city text,
  state_region text,
  country_code text not null default 'US',
  market_slug text not null default 'austin-tx',
  credentials text,
  license_number text,
  website_url text,
  linkedin_url text,
  note text,
  endorsement_from_profile_id uuid not null references public.profiles(id),
  invitation_id uuid not null references public.invitations(id),
  grant_referral_access boolean not null default false,
  status public.membership_state not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  visibility public.group_visibility not null default 'private_member_only',
  market_slug text not null default 'austin-tx',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (group_id, profile_id)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_profile_id uuid not null references public.profiles(id) on delete cascade,
  kind public.post_kind not null,
  title text not null,
  body text not null,
  group_id uuid references public.groups(id) on delete set null,
  market_slug text not null default 'austin-tx',
  is_private boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.referral_requests (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null unique references public.posts(id) on delete cascade,
  client_age_group text,
  care_format text,
  insurance_notes text,
  urgency text,
  status public.referral_status not null default 'open',
  decline_reason text,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null unique references public.posts(id) on delete cascade,
  topic text,
  preferred_timeframe text,
  compensation_notes text,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null unique references public.posts(id) on delete cascade,
  organization_name text,
  employment_type text,
  compensation_summary text,
  location_summary text,
  apply_url text,
  created_at timestamptz not null default now()
);

create table public.endorsements (
  id uuid primary key default gen_random_uuid(),
  therapist_profile_id uuid not null references public.therapist_profiles(id) on delete cascade,
  endorsed_profile_id uuid not null references public.profiles(id) on delete cascade,
  endorser_profile_id uuid not null references public.profiles(id) on delete cascade,
  public_quote text,
  private_note text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  unique (endorsed_profile_id, endorser_profile_id),
  constraint no_self_endorsement check (endorsed_profile_id <> endorser_profile_id)
);

create table public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_profile_id uuid not null references public.profiles(id) on delete cascade,
  followed_profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_profile_id, followed_profile_id),
  constraint no_self_follow check (follower_profile_id <> followed_profile_id)
);

create table public.curated_lists (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.curated_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.curated_lists(id) on delete cascade,
  therapist_profile_id uuid not null references public.therapist_profiles(id) on delete cascade,
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (list_id, therapist_profile_id)
);

create table public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_profile_id uuid references public.profiles(id),
  target_type public.moderation_target_type not null,
  target_id uuid not null,
  reason text not null,
  details text,
  status public.moderation_status not null default 'open',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  resolution_notes text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.protect_profile_system_fields()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() = old.id and new.role <> old.role then
    raise exception 'role cannot be changed by this user';
  end if;

  if auth.uid() = old.id and new.membership_state <> old.membership_state then
    raise exception 'membership_state cannot be changed by this user';
  end if;

  if auth.uid() = old.id and new.approved_by is distinct from old.approved_by then
    raise exception 'approval fields cannot be changed by this user';
  end if;

  if auth.uid() = old.id and new.can_issue_referrals <> old.can_issue_referrals then
    raise exception 'referral permissions cannot be changed by this user';
  end if;

  if auth.uid() = old.id and new.trusted_referrer_at is distinct from old.trusted_referrer_at then
    raise exception 'trusted referrer fields cannot be changed by this user';
  end if;

  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_active_member()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('therapist', 'admin')
      and membership_state = 'active'
  );
$$;

create or replace function public.can_issue_referral_links()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'therapist'
      and membership_state = 'active'
      and can_issue_referrals = true
  );
$$;

create or replace function public.validate_join_request_from_invitation()
returns trigger
language plpgsql
as $$
declare
  inviter_id uuid;
  invite_is_active boolean;
  invite_expires_at timestamptz;
  invite_use_count integer;
  invite_max_uses integer;
begin
  select
    invited_by,
    is_active,
    expires_at,
    use_count,
    max_uses
  into
    inviter_id,
    invite_is_active,
    invite_expires_at,
    invite_use_count,
    invite_max_uses
  from public.invitations
  where id = new.invitation_id;

  if inviter_id is null then
    raise exception 'invalid invitation';
  end if;

  if new.endorsement_from_profile_id <> inviter_id then
    raise exception 'endorsement sponsor must match invitation issuer';
  end if;

  if invite_is_active is not true then
    raise exception 'invitation is inactive';
  end if;

  if invite_expires_at is not null and invite_expires_at < now() then
    raise exception 'invitation has expired';
  end if;

  if invite_use_count >= invite_max_uses then
    raise exception 'invitation usage limit reached';
  end if;

  return new;
end;
$$;

create or replace function public.increment_invitation_use_count()
returns trigger
language plpgsql
as $$
begin
  update public.invitations
  set use_count = use_count + 1
  where id = new.invitation_id;

  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_therapist_profiles_updated_at
before update on public.therapist_profiles
for each row
execute function public.set_updated_at();

create trigger set_join_requests_updated_at
before update on public.join_requests
for each row
execute function public.set_updated_at();

create trigger set_groups_updated_at
before update on public.groups
for each row
execute function public.set_updated_at();

create trigger set_posts_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

create trigger set_curated_lists_updated_at
before update on public.curated_lists
for each row
execute function public.set_updated_at();

create trigger protect_profile_system_fields_before_update
before update on public.profiles
for each row
execute function public.protect_profile_system_fields();

create trigger validate_join_request_before_insert
before insert on public.join_requests
for each row
execute function public.validate_join_request_from_invitation();

create trigger increment_invitation_use_count_after_insert
after insert on public.join_requests
for each row
execute function public.increment_invitation_use_count();

create view public.public_therapist_directory as
select
  tp.id as therapist_profile_id,
  p.id as profile_id,
  p.slug,
  p.market_slug,
  p.city,
  p.state_region,
  tp.public_display_name,
  tp.credentials,
  tp.title,
  tp.headline,
  tp.bio,
  tp.specialties,
  tp.insurance_accepted,
  tp.payment_model,
  tp.modalities,
  tp.therapy_style_tags,
  tp.populations,
  tp.neighborhoods,
  tp.approach_summary,
  tp.featured_links,
  tp.offerings,
  tp.website_url,
  tp.booking_url,
  tp.public_email,
  tp.public_phone,
  tp.offers_in_person,
  tp.offers_telehealth,
  tp.availability_status,
  tp.availability_updated_at,
  coalesce((
    select count(*)
    from public.endorsements e
    join public.profiles endorser on endorser.id = e.endorser_profile_id
    where e.endorsed_profile_id = p.id
      and e.is_public = true
      and endorser.membership_state = 'active'
      and endorser.role in ('therapist', 'admin')
  ), 0)::int as public_endorsement_count
from public.profiles p
join public.therapist_profiles tp on tp.profile_id = p.id
where p.membership_state = 'active'
  and tp.is_public = true;

create view public.monthly_fee_waiver_status as
select
  e.endorsed_profile_id as profile_id,
  date_trunc('month', e.created_at) as endorsement_month,
  count(*) filter (
    where endorser.membership_state = 'active'
      and endorser.role in ('therapist', 'admin')
  )::int as qualifying_endorsements,
  count(*) filter (
    where endorser.membership_state = 'active'
      and endorser.role in ('therapist', 'admin')
  ) >= 5 as fees_waived
from public.endorsements e
join public.profiles endorser on endorser.id = e.endorser_profile_id
group by e.endorsed_profile_id, date_trunc('month', e.created_at);

alter table public.profiles enable row level security;
alter table public.therapist_profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.join_requests enable row level security;
alter table public.groups enable row level security;
alter table public.group_memberships enable row level security;
alter table public.posts enable row level security;
alter table public.referral_requests enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.jobs enable row level security;
alter table public.endorsements enable row level security;
alter table public.moderation_reports enable row level security;

create policy "public can read active public therapist profiles"
on public.therapist_profiles
for select
using (
  is_public = true
  and exists (
    select 1
    from public.profiles p
    where p.id = therapist_profiles.profile_id
      and p.membership_state = 'active'
  )
);

create policy "users can read own therapist profile"
on public.therapist_profiles
for select
using (profile_id = auth.uid() or public.is_admin());

create policy "users can create own therapist profile"
on public.therapist_profiles
for insert
with check (profile_id = auth.uid() or public.is_admin());

create policy "members can update own therapist profile"
on public.therapist_profiles
for update
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "admins can manage therapist profiles"
on public.therapist_profiles
for all
using (public.is_admin())
with check (public.is_admin());

create policy "users can read own profile"
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

create policy "users can update own profile"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "users can create own profile"
on public.profiles
for insert
with check (id = auth.uid() or public.is_admin());

create policy "admins can manage profiles"
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public can read public groups"
on public.groups
for select
using (visibility = 'public' or public.is_active_member() or public.is_admin());

create policy "active members can create groups"
on public.groups
for insert
with check (public.is_active_member());

create policy "admins can manage groups"
on public.groups
for all
using (public.is_admin())
with check (public.is_admin());

create policy "members can read memberships for accessible groups"
on public.group_memberships
for select
using (
  public.is_active_member()
  and exists (
    select 1 from public.groups g
    where g.id = group_memberships.group_id
      and (g.visibility = 'public' or public.is_active_member())
  )
);

create policy "active members can join groups"
on public.group_memberships
for insert
with check (public.is_active_member() and profile_id = auth.uid());

create policy "active members can read private posts"
on public.posts
for select
using (
  (is_private = false)
  or public.is_active_member()
  or public.is_admin()
);

create policy "active members can create posts"
on public.posts
for insert
with check (
  public.is_active_member()
  and author_profile_id = auth.uid()
);

create policy "authors can update own posts"
on public.posts
for update
using (author_profile_id = auth.uid() or public.is_admin())
with check (author_profile_id = auth.uid() or public.is_admin());

create policy "typed post tables follow parent post visibility"
on public.referral_requests
for select
using (
  exists (
    select 1 from public.posts p
    where p.id = referral_requests.post_id
      and (
        p.is_private = false
        or public.is_active_member()
        or public.is_admin()
      )
  )
);

create policy "active members can create referral request details"
on public.referral_requests
for insert
with check (
  exists (
    select 1 from public.posts p
    where p.id = referral_requests.post_id
      and p.author_profile_id = auth.uid()
      and public.is_active_member()
  )
);

create policy "typed consult tables follow parent post visibility"
on public.consultation_requests
for select
using (
  exists (
    select 1 from public.posts p
    where p.id = consultation_requests.post_id
      and (
        p.is_private = false
        or public.is_active_member()
        or public.is_admin()
      )
  )
);

create policy "active members can create consultation request details"
on public.consultation_requests
for insert
with check (
  exists (
    select 1 from public.posts p
    where p.id = consultation_requests.post_id
      and p.author_profile_id = auth.uid()
      and public.is_active_member()
  )
);

create policy "typed job tables follow parent post visibility"
on public.jobs
for select
using (
  exists (
    select 1 from public.posts p
    where p.id = jobs.post_id
      and (
        p.is_private = false
        or public.is_active_member()
        or public.is_admin()
      )
  )
);

create policy "active members can create job details"
on public.jobs
for insert
with check (
  exists (
    select 1 from public.posts p
    where p.id = jobs.post_id
      and p.author_profile_id = auth.uid()
      and public.is_active_member()
  )
);

create policy "public can read public endorsements"
on public.endorsements
for select
using (
  is_public = true
  or public.is_active_member()
  or public.is_admin()
);

create policy "active members can create endorsements"
on public.endorsements
for insert
with check (
  public.is_active_member()
  and endorser_profile_id = auth.uid()
);

create policy "admins can manage endorsements"
on public.endorsements
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage invitations"
on public.invitations
for all
using (public.is_admin())
with check (public.is_admin());

create policy "trusted therapists can create invitations"
on public.invitations
for insert
with check (
  invited_by = auth.uid()
  and (public.can_issue_referral_links() or public.is_admin())
);

create policy "inviter can read own invitations"
on public.invitations
for select
using (
  invited_by = auth.uid()
  or public.is_admin()
);

create policy "inviter or admin can update invitations"
on public.invitations
for update
using (
  invited_by = auth.uid()
  or public.is_admin()
)
with check (
  invited_by = auth.uid()
  or public.is_admin()
);

create policy "admins manage join requests"
on public.join_requests
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public can insert join requests"
on public.join_requests
for insert
with check (status = 'pending');

create policy "sponsors can read join requests they referred"
on public.join_requests
for select
using (
  endorsement_from_profile_id = auth.uid()
  or public.is_admin()
);

create policy "active members can create moderation reports"
on public.moderation_reports
for insert
with check (public.is_active_member() or public.is_admin());

create policy "admins manage moderation reports"
on public.moderation_reports
for all
using (public.is_admin())
with check (public.is_admin());
