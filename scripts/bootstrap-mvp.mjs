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
  const { email, name } = options;
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._;

  if (!command || !["admin", "invite"].includes(command)) {
    console.log("Usage:");
    console.log("  npm run bootstrap:mvp -- admin --email you@example.com [--name \"Your Name\"]");
    console.log(
      "  npm run bootstrap:mvp -- invite --sponsor-email you@example.com [--invitee-email friend@example.com] [--max-uses 1] [--expires-days 30] [--code ATX-CUSTOM]"
    );
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
      name: args.name
    });
    return;
  }

  await createInvite(admin, args);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
