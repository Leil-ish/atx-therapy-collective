#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import dotenv from "dotenv";

import { createClient } from "@supabase/supabase-js";

const cwd = process.cwd();
const envFiles = [".env.local", ".env"];

for (const fileName of envFiles) {
  const filePath = path.join(cwd, fileName);
  if (fs.existsSync(filePath)) {
    dotenv.config({
      path: filePath,
      override: false
    });
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const args = { _: command ?? "" };

  for (let index = 0; index < rest.length; index += 1) {
    const current = rest[index];
    if (!current.startsWith("--")) {
      continue;
    }

    const key = current.slice(2);
    const next = rest[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function randomInviteCode() {
  return `ATX-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

const MOCK_FIRST_NAMES = [
  "Maya",
  "Jordan",
  "Elena",
  "Marcus",
  "Priya",
  "Noah",
  "Avery",
  "Camila",
  "Julian",
  "Sofia",
  "Renee",
  "Darius",
  "Leah",
  "Owen",
  "Nina",
  "Theo",
  "Marisol",
  "Evan",
  "Talia",
  "Isaac",
  "Simone",
  "Adrian",
  "Keisha",
  "Rowan",
  "Lena",
  "Malcolm",
  "Bianca",
  "Caleb",
  "Ana",
  "Micah"
];

const MOCK_LAST_NAMES = [
  "Chen",
  "Ramirez",
  "Patel",
  "Walker",
  "Nguyen",
  "Brooks",
  "Sullivan",
  "Foster",
  "Diaz",
  "Turner",
  "James",
  "Ali",
  "Bennett",
  "Coleman",
  "Hughes",
  "Morris",
  "Price",
  "Rivera",
  "Shah",
  "Ward",
  "Griffin",
  "Powell",
  "Barnes",
  "Reed",
  "Kim",
  "Ross",
  "Murphy",
  "Ortiz",
  "Long",
  "Hill"
];

const MOCK_CREDENTIALS = ["LPC", "LCSW", "LMFT", "Psychologist", "LPC-S", "LCSW-S"];
const MOCK_SPECIALTIES = [
  "Anxiety",
  "Depression",
  "Trauma / PTSD",
  "Relationship issues",
  "Couples",
  "Family conflict",
  "Grief",
  "Burnout",
  "Life transitions",
  "Perinatal mental health",
  "ADHD",
  "Neurodiversity",
  "Men's issues",
  "Women's issues",
  "Addiction / substance use",
  "Eating disorders",
  "OCD"
];
const MOCK_POPULATIONS = [
  "Adults",
  "Teens",
  "Couples",
  "Families",
  "LGBTQ+",
  "BIPOC",
  "Professionals / burnout",
  "College students",
  "Perinatal"
];
const MOCK_MODALITIES = [
  "ACT",
  "CBT",
  "EMDR",
  "Psychodynamic",
  "Relational",
  "Attachment-based",
  "Somatic",
  "IFS",
  "Solution-focused",
  "Mindfulness-based"
];
const MOCK_INSURANCE = [
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare",
  "Oscar",
  "Oxford",
  "Scott & White",
  "Out of network"
];
const MOCK_NEIGHBORHOODS = [
  ["Northwest Hills", "North Austin"],
  ["Allandale", "North Austin"],
  ["Hyde Park", "Central Austin"],
  ["Tarrytown", "West Austin"],
  ["Westlake", "West Austin"],
  ["South Lamar", "South Austin"],
  ["South Congress", "South Austin"],
  ["East Austin", "East Austin"],
  ["Round Rock"],
  ["Cedar Park"],
  ["Georgetown"],
  ["Pflugerville"],
  ["Leander"],
  ["Lakeway"],
  ["Dripping Springs"],
  ["Buda"],
  ["Kyle"],
  ["Mueller", "Central Austin"],
  ["Brentwood", "North Austin"],
  ["Oak Hill", "South Austin"]
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pickWrapped(list, index, count = 1) {
  const items = [];
  for (let offset = 0; offset < count; offset += 1) {
    items.push(list[(index + offset) % list.length]);
  }
  return [...new Set(items)];
}

function buildMockTherapist(index, emailPrefix) {
  const firstName = MOCK_FIRST_NAMES[index % MOCK_FIRST_NAMES.length];
  const lastName = MOCK_LAST_NAMES[(index * 3) % MOCK_LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const email = `${emailPrefix}+${slugify(`${firstName}-${lastName}-${index + 1}`)}@example.com`;
  const credential = MOCK_CREDENTIALS[index % MOCK_CREDENTIALS.length];
  const specialties = pickWrapped(MOCK_SPECIALTIES, index, 3);
  const populations = pickWrapped(MOCK_POPULATIONS, index, 2);
  const modalities = pickWrapped(MOCK_MODALITIES, index, 2);
  const insuranceAccepted = pickWrapped(MOCK_INSURANCE, index, 3);
  const neighborhoods = MOCK_NEIGHBORHOODS[index % MOCK_NEIGHBORHOODS.length];
  const paymentModel = index % 3 === 0 ? "insurance" : index % 3 === 1 ? "both" : "private_pay";
  const availabilityStatus = index % 5 === 0 ? "waitlist" : "accepting";
  const offersInPerson = index % 4 !== 0;
  const offersTelehealth = true;
  const headline = `${credential} | ${specialties[0]} | ${neighborhoods[0]}`;
  const approachSummary = `Warm, practical therapy for ${specialties.slice(0, 2).join(" and ").toLowerCase()}, with special attention to ${populations[0].toLowerCase()}.`;
  const bio = `${fullName} offers ${credential} therapy in the Austin area, with a focus on ${specialties.slice(0, 2).join(" and ").toLowerCase()}.`;

  return {
    fullName,
    email,
    credential,
    specialties,
    populations,
    modalities,
    insuranceAccepted,
    neighborhoods,
    paymentModel,
    availabilityStatus,
    offersInPerson,
    offersTelehealth,
    headline,
    approachSummary,
    bio
  };
}

function isMissingColumnError(error, columnName) {
  return Boolean(error?.message && error.message.includes(`'${columnName}'`));
}

function isMissingTableError(error, tableName) {
  return Boolean(error?.message && error.message.includes(`'public.${tableName}'`));
}

async function upsertProfileWithFallback(admin, payload) {
  const attempt = async (candidate) =>
    admin.from("profiles").upsert(candidate, { onConflict: "id" });

  let candidate = { ...payload };
  let result = await attempt(candidate);

  if (result.error && isMissingColumnError(result.error, "membership_tier")) {
    delete candidate.membership_tier;
    result = await attempt(candidate);
  }

  if (result.error) {
    throw result.error;
  }
}

async function listAllUsers(admin) {
  const users = [];
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200
    });

    if (error) {
      throw error;
    }

    users.push(...data.users);

    if (data.users.length < 200) {
      break;
    }

    page += 1;
  }

  return users;
}

async function findUserByEmail(admin, email) {
  const users = await listAllUsers(admin);
  return users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function ensureAdminProfile(admin, options) {
  const { email, name, tier } = options;
  const user = await findUserByEmail(admin, email);

  if (!user) {
    throw new Error(
      `No auth user exists for ${email}. First request a magic link in the app so Supabase creates the auth user, then rerun this command.`
    );
  }

  const fullName =
    name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Admin";

  const slugBase = String(fullName)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const slug = `${slugBase || "admin"}-${user.id.slice(0, 8)}`;

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      role: "admin",
      membership_state: "active",
      full_name: fullName,
      slug,
      city: "Austin",
      state_region: "TX",
      country_code: "US",
      market_slug: "austin-tx",
      can_issue_referrals: true,
      membership_tier: tier || "premium",
      approved_at: new Date().toISOString()
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw profileError;
  }

  const { error: therapistError } = await admin.from("therapist_profiles").upsert(
    {
      profile_id: user.id,
      public_display_name: fullName,
      is_public: false,
      accepting_referrals: true,
      offers_in_person: true,
      offers_telehealth: true,
      availability_status: "accepting",
      payment_model: "both"
    },
    { onConflict: "profile_id" }
  );

  if (therapistError) {
    throw therapistError;
  }

  console.log(`Admin profile ready for ${email}`);
  console.log(`User ID: ${user.id}`);
}

async function createInvite(admin, options) {
  const sponsorEmail = options["sponsor-email"];
  if (!sponsorEmail) {
    throw new Error("Missing required flag: --sponsor-email");
  }

  const sponsor = await findUserByEmail(admin, sponsorEmail);
  if (!sponsor) {
    throw new Error(`No auth user exists for sponsor ${sponsorEmail}.`);
  }

  const { data: sponsorProfile, error: sponsorProfileError } = await admin
    .from("profiles")
    .select("id, full_name, role, membership_state, can_issue_referrals")
    .eq("id", sponsor.id)
    .maybeSingle();

  if (sponsorProfileError || !sponsorProfile) {
    throw sponsorProfileError || new Error(`No profile exists for sponsor ${sponsorEmail}.`);
  }

  if (!["admin", "therapist"].includes(sponsorProfile.role) || sponsorProfile.membership_state !== "active") {
    throw new Error(`Sponsor ${sponsorEmail} is not an active admin/therapist member.`);
  }

  if (sponsorProfile.role !== "admin" && !sponsorProfile.can_issue_referrals) {
    throw new Error(`Sponsor ${sponsorEmail} does not currently have referral-link privileges.`);
  }

  const code = options.code || randomInviteCode();
  const maxUses = Number(options["max-uses"] || "1");
  const invitedEmail = options["invitee-email"] || null;
  const expiresDays = Number(options["expires-days"] || "30");
  const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await admin
    .from("invitations")
    .insert({
      code,
      invited_email: invitedEmail,
      invited_by: sponsor.id,
      market_slug: "austin-tx",
      max_uses: maxUses,
      is_active: true,
      expires_at: expiresAt
    })
    .select("id, code, invited_email, max_uses, expires_at")
    .single();

  if (error) {
    throw error;
  }

  console.log(`Referral link created by ${sponsorProfile.full_name}`);
  console.log(`Code: ${data.code}`);
  console.log(`Invitee email: ${data.invited_email || "Open invite"}`);
  console.log(`Max uses: ${data.max_uses}`);
  console.log(`Expires: ${new Date(data.expires_at).toLocaleString("en-US")}`);
}

async function setUserPassword(admin, options) {
  const email = options.email;
  const password = options.password;

  if (!email) {
    throw new Error("Missing required flag: --email");
  }

  if (!password) {
    throw new Error("Missing required flag: --password");
  }

  if (String(password).length < 10) {
    throw new Error("Password must be at least 10 characters.");
  }

  const user = await findUserByEmail(admin, email);

  if (!user) {
    throw new Error(`No auth user exists for ${email}.`);
  }

  const { error } = await admin.auth.admin.updateUserById(user.id, {
    password
  });

  if (error) {
    throw error;
  }

  console.log(`Password updated for ${email}`);
  console.log(`User ID: ${user.id}`);
}

async function setUserTier(admin, options) {
  const email = options.email;
  const tier = options.tier;

  if (!email) {
    throw new Error("Missing required flag: --email");
  }

  if (!tier || !["free", "premium"].includes(String(tier))) {
    throw new Error("Missing required flag: --tier free|premium");
  }

  const user = await findUserByEmail(admin, email);
  if (!user) {
    throw new Error(`No auth user exists for ${email}.`);
  }

  const { error } = await admin.from("profiles").update({ membership_tier: tier }).eq("id", user.id);
  if (error) {
    throw error;
  }

  console.log(`Membership tier set for ${email}: ${tier}`);
  console.log(`User ID: ${user.id}`);
}

async function seedMockTherapists(admin, options) {
  const count = Number(options.count || "20");
  const password = String(options.password || "TrustedBeta123!");
  const emailPrefix = String(options["email-prefix"] || "mock-therapist");

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error("Count must be a positive integer.");
  }

  if (password.length < 10) {
    throw new Error("Password must be at least 10 characters.");
  }

  const seeded = [];

  for (let index = 0; index < count; index += 1) {
    const mock = buildMockTherapist(index, emailPrefix);
    let user = await findUserByEmail(admin, mock.email);

    if (!user) {
      const { data, error } = await admin.auth.admin.createUser({
        email: mock.email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: mock.fullName
        }
      });

      if (error) {
        throw error;
      }

      user = data.user;
    }

    const slug = `${slugify(mock.fullName)}-${user.id.slice(0, 8)}`;
    const city = mock.neighborhoods[0] === "Round Rock" || mock.neighborhoods[0] === "Cedar Park" || mock.neighborhoods[0] === "Georgetown" || mock.neighborhoods[0] === "Pflugerville" || mock.neighborhoods[0] === "Leander" || mock.neighborhoods[0] === "Lakeway" || mock.neighborhoods[0] === "Dripping Springs" || mock.neighborhoods[0] === "Buda" || mock.neighborhoods[0] === "Kyle"
      ? mock.neighborhoods[0]
      : "Austin";

    await upsertProfileWithFallback(admin, {
      id: user.id,
      role: "therapist",
      membership_state: "active",
      full_name: mock.fullName,
      slug,
      city,
      state_region: "TX",
      country_code: "US",
      market_slug: "austin-tx",
      can_issue_referrals: true,
      membership_tier: index % 6 === 0 ? "premium" : "free",
      approved_at: new Date().toISOString()
    });

    const { data: existingTherapistProfile } = await admin
      .from("therapist_profiles")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();

    const therapistPayload = {
      profile_id: user.id,
      public_display_name: mock.fullName,
      credentials: mock.credential,
      title: `${mock.credential} therapist`,
      bio: mock.bio,
      specialties: mock.specialties,
      insurance_accepted: mock.insuranceAccepted,
      modalities: mock.modalities,
      therapy_style_tags: mock.modalities,
      populations: mock.populations,
      neighborhoods: mock.neighborhoods,
      approach_summary: mock.approachSummary,
      website_url: `https://${slug}.example.com`,
      booking_url: `https://${slug}.example.com/book`,
      offers_in_person: mock.offersInPerson,
      offers_telehealth: mock.offersTelehealth,
      availability_status: mock.availabilityStatus,
      accepting_referrals: true,
      is_public: true
    };

    if (existingTherapistProfile) {
      const { error: therapistError } = await admin
        .from("therapist_profiles")
        .update(therapistPayload)
        .eq("profile_id", user.id);

      if (therapistError) {
        throw therapistError;
      }
    } else {
      const { error: therapistError } = await admin
        .from("therapist_profiles")
        .insert(therapistPayload);

      if (therapistError) {
        throw therapistError;
      }
    }

    seeded.push({
      id: user.id,
      email: mock.email,
      fullName: mock.fullName
    });
  }

  const profileIds = seeded.map((item) => item.id);
  const { data: therapistProfiles, error: therapistProfilesError } = await admin
    .from("therapist_profiles")
    .select("id, profile_id")
    .in("profile_id", profileIds);

  if (therapistProfilesError) {
    throw therapistProfilesError;
  }

  const therapistProfileIdsByProfileId = new Map(
    (therapistProfiles ?? []).map((row) => [row.profile_id, row.id])
  );

  const follows = [];
  const endorsements = [];

  for (let index = 0; index < seeded.length; index += 1) {
    const follower = seeded[index];
    const firstFollowed = seeded[(index + 1) % seeded.length];
    const secondFollowed = seeded[(index + 4) % seeded.length];

    follows.push(
      { follower_profile_id: follower.id, followed_profile_id: firstFollowed.id },
      { follower_profile_id: follower.id, followed_profile_id: secondFollowed.id }
    );

    const endorsedProfileId = seeded[(index + 2) % seeded.length].id;
    const therapistProfileId = therapistProfileIdsByProfileId.get(endorsedProfileId);

    if (therapistProfileId) {
      endorsements.push({
        therapist_profile_id: therapistProfileId,
        endorsed_profile_id: endorsedProfileId,
        endorser_profile_id: follower.id,
        public_quote: `${follower.fullName} trusts this clinician for thoughtful referrals.`,
        is_public: true
      });
    }
  }

  const { error: followError } = await admin.from("follows").upsert(follows, {
    onConflict: "follower_profile_id,followed_profile_id"
  });

  if (followError && !isMissingTableError(followError, "follows")) {
    throw followError;
  }

  const { error: endorsementError } = await admin.from("endorsements").upsert(endorsements, {
    onConflict: "endorsed_profile_id,endorser_profile_id"
  });

  if (endorsementError && !isMissingTableError(endorsementError, "endorsements")) {
    throw endorsementError;
  }

  console.log(`Seeded ${seeded.length} mock therapists.`);
  console.log(`Shared password: ${password}`);
  console.log(`Email prefix: ${emailPrefix}`);
  if (followError && isMissingTableError(followError, "follows")) {
    console.log("Skipped follow seeding because the live schema does not include public.follows yet.");
  }
  if (endorsementError && isMissingTableError(endorsementError, "endorsements")) {
    console.log("Skipped endorsement seeding because the live schema does not include public.endorsements yet.");
  }
  console.log("Example accounts:");
  for (const account of seeded.slice(0, 5)) {
    console.log(`  ${account.fullName} <${account.email}>`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._;

  if (!command || !["admin", "invite", "password", "tier", "seed-mocks"].includes(command)) {
    console.log("Usage:");
    console.log("  npm run bootstrap:mvp -- admin --email you@example.com [--name \"Your Name\"] [--tier premium]");
    console.log(
      "  npm run bootstrap:mvp -- invite --sponsor-email you@example.com [--invitee-email friend@example.com] [--max-uses 1] [--expires-days 30] [--code ATX-CUSTOM]"
    );
    console.log("  npm run bootstrap:mvp -- password --email you@example.com --password 'TempPassword123!'");
    console.log("  npm run bootstrap:mvp -- tier --email you@example.com --tier premium");
    console.log("  npm run bootstrap:mvp -- seed-mocks [--count 20] [--password 'TrustedBeta123!'] [--email-prefix mock-therapist']");
    process.exit(1);
  }

  const admin = createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  if (command === "admin") {
    const email = args.email;
    if (!email) {
      throw new Error("Missing required flag: --email");
    }

    await ensureAdminProfile(admin, {
      email,
      name: args.name,
      tier: args.tier
    });
    return;
  }

  if (command === "password") {
    await setUserPassword(admin, {
      email: args.email,
      password: args.password
    });
    return;
  }

  if (command === "tier") {
    await setUserTier(admin, {
      email: args.email,
      tier: args.tier
    });
    return;
  }

  if (command === "seed-mocks") {
    await seedMockTherapists(admin, args);
    return;
  }

  await createInvite(admin, args);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
