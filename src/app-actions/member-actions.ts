"use server";

import { revalidatePath } from "next/cache";

import { requireMember } from "@/lib/auth/guards";
import { getReferralLinkByCode } from "@/lib/data/mock-data";

// Example server action shape for future form wiring.
export async function createMemberPost(formData: FormData) {
  await requireMember();

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();

  if (!title || !body || !type) {
    return;
  }

  // TODO: Insert into Supabase `posts` and typed detail table in a single transaction-like flow.
  revalidatePath("/member/feed");
}

export async function submitJoinApplication(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const referralCode = String(
    formData.get("referralCode") ?? formData.get("referralCodeVisible") ?? ""
  ).trim();

  if (!fullName || !email || !referralCode) {
    return;
  }

  const invitation = getReferralLinkByCode(referralCode);

  if (!invitation || !invitation.isActive || invitation.useCount >= invitation.maxUses) {
    return;
  }

  // TODO: Validate against Supabase `invitations`, then insert a `join_requests` row including `websiteUrl`.
}

export async function createReferralLink(formData: FormData) {
  const session = await requireMember();

  if (!session.canIssueReferrals) {
    return;
  }

  const invitedEmail = String(formData.get("invitedEmail") ?? "").trim();
  const maxUses = Number(formData.get("maxUses") ?? "1");

  if (Number.isNaN(maxUses) || maxUses < 1) {
    return;
  }

  // TODO: Insert a row into Supabase `invitations` and return the generated code.
  revalidatePath("/member/referrals");
}
