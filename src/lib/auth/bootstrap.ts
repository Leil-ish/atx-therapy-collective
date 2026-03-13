import type { User } from "@supabase/supabase-js";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDisplayName(user: User) {
  const metadataName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name);

  if (metadataName) {
    return metadataName;
  }

  return user.email?.split("@")[0] ?? "New Therapist";
}

// First successful auth should materialize the app-level profile rows.
// New therapists still default to `pending` until your invite/admin workflow activates them.
export async function bootstrapProfileForUser(user: User) {
  const admin = createSupabaseAdminClient();
  const displayName = getDisplayName(user);
  const baseSlug = slugify(displayName) || `therapist-${user.id.slice(0, 8)}`;
  const fallbackSlug = `${baseSlug}-${user.id.slice(0, 8)}`;

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    await admin.from("profiles").insert({
      id: user.id,
      role: "therapist",
      membership_state: "pending",
      full_name: displayName,
      slug: fallbackSlug,
      country_code: "US",
      market_slug: "austin-tx"
    });
  }

  const { data: existingTherapistProfile } = await admin
    .from("therapist_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!existingTherapistProfile) {
    await admin.from("therapist_profiles").insert({
      profile_id: user.id,
      public_display_name: displayName,
      is_public: false
    });
  }
}
