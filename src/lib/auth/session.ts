import type { AppSession } from "@/types";
import { bootstrapProfileForUser, syncMembershipStateForUser } from "@/lib/auth/bootstrap";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getSession(): Promise<AppSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  await syncMembershipStateForUser(user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, membership_state, full_name, can_issue_referrals")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await bootstrapProfileForUser(user);

    const { data: bootstrappedProfile } = await supabase
      .from("profiles")
      .select("id, role, membership_state, full_name, can_issue_referrals")
      .eq("id", user.id)
      .maybeSingle();

    const { data: bootstrappedTier } = await supabase
      .from("profiles")
      .select("membership_tier")
      .eq("id", user.id)
      .maybeSingle();

    if (!bootstrappedProfile) {
      return null;
    }

    return {
      userId: bootstrappedProfile.id,
      role: bootstrappedProfile.role,
      membershipState: bootstrappedProfile.membership_state,
      membershipTier: (bootstrappedTier?.membership_tier as AppSession["membershipTier"] | null) ?? "free",
      fullName: bootstrappedProfile.full_name,
      email: user.email ?? "",
      canIssueReferrals: bootstrappedProfile.can_issue_referrals
    };
  }

  const { data: tierProfile } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: profile.id,
    role: profile.role,
    membershipState: profile.membership_state,
    membershipTier: (tierProfile?.membership_tier as AppSession["membershipTier"] | null) ?? "free",
    fullName: profile.full_name,
    email: user.email ?? "",
    canIssueReferrals: profile.can_issue_referrals
  };
}
