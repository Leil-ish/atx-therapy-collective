import "server-only";

import type {
  AvailabilityStatus,
  EndorsementSummary,
  FeedItem,
  JoinRequestSummary,
  PaymentModel,
  PublicTherapistSummary,
  ReferralLinkSummary
} from "@/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function formatRelativeDateLabel(value?: string | null) {
  if (!value) {
    return "Updated recently";
  }

  const then = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Updated today";
  }

  if (diffDays === 1) {
    return "Updated yesterday";
  }

  if (diffDays < 7) {
    return `Updated ${diffDays} days ago`;
  }

  if (diffDays < 14) {
    return "Updated last week";
  }

  return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
}

function formatCreatedAtLabel(value?: string | null) {
  if (!value) {
    return "Recently";
  }

  const then = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return "Just now";
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function getAvailabilityLabel(status: AvailabilityStatus) {
  if (status === "accepting") return "Accepting new clients";
  if (status === "waitlist") return "Limited openings";
  return "Not accepting referrals";
}

function getPaymentModelLabel(value?: string | null) {
  if (value === "private_pay") return "Private pay";
  if (value === "insurance") return "Insurance";
  return "Private pay + insurance";
}

function buildTherapistTitle(row: Record<string, unknown>) {
  const explicitTitle = typeof row.title === "string" ? row.title.trim() : "";
  if (explicitTitle) {
    return explicitTitle;
  }

  const credentials = typeof row.credentials === "string" ? row.credentials.trim() : "";
  const specialties = asArray(row.specialties);

  if (credentials && specialties.length > 0) {
    return `${credentials} specializing in ${specialties.slice(0, 2).join(" and ")}`;
  }

  if (credentials) {
    return credentials;
  }

  return "Austin therapist";
}

async function getEndorserConnections(profileIds: string[]) {
  if (profileIds.length === 0) {
    return new Map<string, { id: string; name: string; slug: string }[]>();
  }

  const admin = createSupabaseAdminClient();
  const { data: rawEndorsements } = await admin
    .from("endorsements")
    .select("endorsed_profile_id, endorser_profile_id, is_public")
    .in("endorsed_profile_id", profileIds)
    .eq("is_public", true);

  const endorsements = (rawEndorsements ?? []) as Array<{
    endorsed_profile_id: string;
    endorser_profile_id: string;
    is_public: boolean;
  }>;

  const endorserIds = [...new Set(endorsements.map((item) => item.endorser_profile_id))];
  const { data: rawProfiles } = endorserIds.length
    ? await admin
        .from("profiles")
        .select("id, full_name, slug, membership_state, role")
        .in("id", endorserIds)
    : { data: [] as unknown[] };

  const activeEndorsers = new Map(
    ((rawProfiles ?? []) as Array<Record<string, unknown>>)
      .filter((profile) => profile.membership_state === "active")
      .filter((profile) => profile.role === "therapist" || profile.role === "admin")
      .map((profile) => [
        String(profile.id),
        {
          id: String(profile.id),
          name: String(profile.full_name ?? "Therapist"),
          slug: String(profile.slug ?? "")
        }
      ])
  );

  const grouped = new Map<string, { id: string; name: string; slug: string }[]>();

  for (const endorsement of endorsements) {
    const endorser = activeEndorsers.get(endorsement.endorser_profile_id);

    if (!endorser) {
      continue;
    }

    const current = grouped.get(endorsement.endorsed_profile_id) ?? [];
    current.push(endorser);
    grouped.set(endorsement.endorsed_profile_id, current);
  }

  return grouped;
}

function mapTherapistSummary(
  row: Record<string, unknown>,
  trustedBy: Map<string, { id: string; name: string; slug: string }[]>
): PublicTherapistSummary {
  const profileId = String(row.profile_id);
  const paymentModel = (row.payment_model as PaymentModel | null) ?? "both";

  return {
    id: String(row.therapist_profile_id),
    profileId,
    slug: String(row.slug),
    displayName: String(row.public_display_name ?? "Therapist"),
    title: buildTherapistTitle(row),
    bio: String(row.bio ?? "Profile in progress."),
    approachSummary: String(row.approach_summary ?? "Approach summary coming soon."),
    specialties: asArray(row.specialties),
    populations: asArray(row.populations),
    insuranceAccepted: asArray(row.insurance_accepted),
    paymentModel,
    therapyStyleTags: asArray(row.therapy_style_tags),
    neighborhoods: asArray(row.neighborhoods),
    endorsementCount: Number(row.public_endorsement_count ?? 0),
    membershipLabel: "Active member",
    city: String(row.city ?? "Austin"),
    marketName: "Austin",
    availabilityStatus: (row.availability_status as AvailabilityStatus | null) ?? "waitlist",
    availabilityUpdatedAtLabel: formatRelativeDateLabel(row.availability_updated_at as string | null),
    inPerson: Boolean(row.offers_in_person),
    telehealth: Boolean(row.offers_telehealth),
    trustedBy: trustedBy.get(profileId) ?? [],
    sponsorName: undefined
  };
}

export async function getPublicTherapists() {
  const admin = createSupabaseAdminClient();
  const { data: rawRows } = await admin
    .from("public_therapist_directory")
    .select(
      "therapist_profile_id, profile_id, slug, city, public_display_name, credentials, title, bio, specialties, insurance_accepted, therapy_style_tags, populations, neighborhoods, approach_summary, offers_in_person, offers_telehealth, availability_status, availability_updated_at, public_endorsement_count, payment_model"
    )
    .order("availability_updated_at", { ascending: false });

  const rows = (rawRows ?? []) as Array<Record<string, unknown>>;
  const trustedBy = await getEndorserConnections(rows.map((row) => String(row.profile_id)));

  return rows.map((row) => mapTherapistSummary(row, trustedBy));
}

export async function getPublicTherapistBySlug(slug: string) {
  const admin = createSupabaseAdminClient();
  const { data: rawRow } = await admin
    .from("public_therapist_directory")
    .select(
      "therapist_profile_id, profile_id, slug, city, public_display_name, credentials, title, bio, specialties, insurance_accepted, therapy_style_tags, populations, neighborhoods, approach_summary, offers_in_person, offers_telehealth, availability_status, availability_updated_at, public_endorsement_count, payment_model"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!rawRow) {
    return null;
  }

  const trustedBy = await getEndorserConnections([String(rawRow.profile_id)]);
  return mapTherapistSummary(rawRow as Record<string, unknown>, trustedBy);
}

export async function getMemberFeedItems() {
  const admin = createSupabaseAdminClient();
  const { data: rawPosts } = await admin
    .from("posts")
    .select("id, kind, title, body, author_profile_id, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const posts = (rawPosts ?? []) as Array<Record<string, unknown>>;
  const postIds = posts.map((post) => String(post.id));
  const authorIds = [...new Set(posts.map((post) => String(post.author_profile_id)))];

  const { data: rawAuthors } = authorIds.length
    ? await admin.from("profiles").select("id, full_name").in("id", authorIds)
    : { data: [] as unknown[] };
  const authors = new Map(
    ((rawAuthors ?? []) as Array<Record<string, unknown>>).map((author) => [
      String(author.id),
      String(author.full_name ?? "Therapist")
    ])
  );

  const { data: rawReferralDetails } = postIds.length
    ? await admin
        .from("referral_requests")
        .select("post_id, insurance_notes, status")
        .in("post_id", postIds)
    : { data: [] as unknown[] };
  const referralDetails = new Map(
    ((rawReferralDetails ?? []) as Array<Record<string, unknown>>).map((detail) => [
      String(detail.post_id),
      detail
    ])
  );

  return posts.map((post) => {
    const type = String(post.kind) as FeedItem["type"];
    const referralDetail = referralDetails.get(String(post.id));

    return {
      id: String(post.id),
      type,
      kindLabel:
        type === "consultation_request"
          ? "Consultation request"
          : type === "job"
            ? "Job opening"
            : "Referral request",
      title: String(post.title ?? "Untitled post"),
      body: String(post.body ?? ""),
      authorName: authors.get(String(post.author_profile_id)) ?? "Therapist",
      createdAtLabel: formatCreatedAtLabel(post.created_at as string | null),
      ctaLabel:
        type === "consultation_request"
          ? "I'm open to consult"
          : type === "job"
            ? "Review this opening"
            : "I'm available for this referral",
      status: String(referralDetail?.status ?? "open") as FeedItem["status"],
      availabilitySignal:
        typeof referralDetail?.insurance_notes === "string" && referralDetail.insurance_notes.trim().length > 0
          ? `Insurance notes: ${referralDetail.insurance_notes.trim()}`
          : undefined
    } satisfies FeedItem;
  });
}

export async function getReferralLinksForMember(userId: string, sponsorName: string) {
  const admin = createSupabaseAdminClient();
  const appUrl = getAppUrl();
  const { data: rawInvitations } = await admin
    .from("invitations")
    .select("id, code, invited_email, max_uses, use_count, is_active, expires_at")
    .eq("invited_by", userId)
    .order("created_at", { ascending: false });

  return ((rawInvitations ?? []) as Array<Record<string, unknown>>).map((invitation) => {
    const code = String(invitation.code);
    const invitedEmail =
      typeof invitation.invited_email === "string" && invitation.invited_email.length > 0
        ? invitation.invited_email
        : undefined;
    const inviteUrl = `${appUrl}/join/apply?code=${encodeURIComponent(code)}`;
    const emailInviteHref = invitedEmail
      ? `mailto:${encodeURIComponent(invitedEmail)}?subject=${encodeURIComponent(
          "Invitation to join ATX Therapy Collective"
        )}&body=${encodeURIComponent(
          `Hi,\n\nI'd love to invite you to join ATX Therapy Collective.\n\nUse this referral link to apply:\n${inviteUrl}\n\nIf the link does not prefill the code, use: ${code}\n\nBest,\n${sponsorName}`
        )}`
      : undefined;

    return {
      id: String(invitation.id),
      code,
      sponsorName,
      invitedEmail,
      maxUses: Number(invitation.max_uses ?? 1),
      useCount: Number(invitation.use_count ?? 0),
      expiresAtLabel:
        invitation.expires_at && typeof invitation.expires_at === "string"
          ? `Expires ${new Date(invitation.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
          : "No expiration",
      isActive: Boolean(invitation.is_active),
      inviteUrl,
      emailInviteHref
    };
  }) satisfies ReferralLinkSummary[];
}

export async function getEndorsementsForMember(profileId: string) {
  const admin = createSupabaseAdminClient();
  const { data: rawEndorsements } = await admin
    .from("endorsements")
    .select("id, endorser_profile_id, endorsed_profile_id, public_quote, is_public, created_at")
    .or(`endorsed_profile_id.eq.${profileId},endorser_profile_id.eq.${profileId}`)
    .order("created_at", { ascending: false });

  const endorsements = (rawEndorsements ?? []) as Array<Record<string, unknown>>;
  const relatedProfileIds = [
    ...new Set(
      endorsements.flatMap((endorsement) => [
        String(endorsement.endorser_profile_id),
        String(endorsement.endorsed_profile_id)
      ])
    )
  ];

  const { data: rawProfiles } = relatedProfileIds.length
    ? await admin.from("profiles").select("id, full_name, slug").in("id", relatedProfileIds)
    : { data: [] as unknown[] };
  const profiles = new Map(
    ((rawProfiles ?? []) as Array<Record<string, unknown>>).map((profile) => [
      String(profile.id),
      {
        name: String(profile.full_name ?? "Therapist"),
        slug: typeof profile.slug === "string" ? profile.slug : undefined
      }
    ])
  );

  return endorsements.map((endorsement) => ({
    id: String(endorsement.id),
    giverSlug: profiles.get(String(endorsement.endorser_profile_id))?.slug,
    giverName: profiles.get(String(endorsement.endorser_profile_id))?.name ?? "Therapist",
    receiverSlug: profiles.get(String(endorsement.endorsed_profile_id))?.slug,
    receiverName: profiles.get(String(endorsement.endorsed_profile_id))?.name ?? "Therapist",
    quote: String(endorsement.public_quote ?? ""),
    createdAtLabel: formatCreatedAtLabel(endorsement.created_at as string | null),
    isPublic: Boolean(endorsement.is_public)
  })) satisfies EndorsementSummary[];
}

export async function getEndorsementCandidates(currentProfileId: string) {
  const therapists = await getPublicTherapists();
  return therapists
    .filter((therapist) => therapist.profileId !== currentProfileId)
    .map((therapist) => ({
      profileId: therapist.profileId,
      label: therapist.displayName
    }));
}

export async function getAdminJoinRequests() {
  const admin = createSupabaseAdminClient();
  const { data: rawRequests } = await admin
    .from("join_requests")
    .select("id, full_name, email, credentials, license_number, endorsement_from_profile_id, invitation_id, status, created_at")
    .order("created_at", { ascending: false });

  const requests = (rawRequests ?? []) as Array<Record<string, unknown>>;
  const sponsorIds = [...new Set(requests.map((request) => String(request.endorsement_from_profile_id)))];
  const invitationIds = [...new Set(requests.map((request) => String(request.invitation_id)))];

  const { data: rawSponsors } = sponsorIds.length
    ? await admin.from("profiles").select("id, full_name").in("id", sponsorIds)
    : { data: [] as unknown[] };
  const sponsors = new Map(
    ((rawSponsors ?? []) as Array<Record<string, unknown>>).map((profile) => [
      String(profile.id),
      String(profile.full_name ?? "Trusted member")
    ])
  );

  const { data: rawInvitations } = invitationIds.length
    ? await admin.from("invitations").select("id, code, market_slug").in("id", invitationIds)
    : { data: [] as unknown[] };
  const invitations = new Map(
    ((rawInvitations ?? []) as Array<Record<string, unknown>>).map((invitation) => [
      String(invitation.id),
      {
        code: String(invitation.code ?? ""),
        marketSlug: String(invitation.market_slug ?? "austin-tx")
      }
    ])
  );

  return requests.map((request) => {
    const invitation = invitations.get(String(request.invitation_id));

    return {
      id: String(request.id),
      fullName: String(request.full_name ?? "Applicant"),
      email: String(request.email ?? ""),
      credentials: String(request.credentials ?? ""),
      licenseNumber:
        typeof request.license_number === "string" && request.license_number.length > 0
          ? request.license_number
          : undefined,
      marketName: invitation?.marketSlug === "austin-tx" ? "Austin" : invitation?.marketSlug ?? "Austin",
      sponsorName: sponsors.get(String(request.endorsement_from_profile_id)) ?? "Trusted member",
      referralCode: invitation?.code ?? "",
      createdAtLabel: formatCreatedAtLabel(request.created_at as string | null),
      status: String(request.status ?? "pending") as JoinRequestSummary["status"]
    } satisfies JoinRequestSummary;
  });
}

export async function getLatestJoinRequestByEmail(email: string) {
  const admin = createSupabaseAdminClient();
  const normalizedEmail = email.trim().toLowerCase();

  const { data } = await admin
    .from("join_requests")
    .select("id, status, reviewed_at, rejection_reason, created_at, invitation_id, endorsement_from_profile_id, credentials")
    .ilike("email", normalizedEmail)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const [invitationResult, sponsorResult] = await Promise.all([
    admin
      .from("invitations")
      .select("id, code")
      .eq("id", String(data.invitation_id))
      .maybeSingle(),
    admin
      .from("profiles")
      .select("id, full_name")
      .eq("id", String(data.endorsement_from_profile_id))
      .maybeSingle()
  ]);

  return {
    id: String(data.id),
    status: String(data.status ?? "pending") as "pending" | "active" | "rejected" | "suspended",
    reviewed_at: (data.reviewed_at as string | null) ?? null,
    rejection_reason: (data.rejection_reason as string | null) ?? null,
    created_at: (data.created_at as string | null) ?? null,
    referral_code: invitationResult.data?.code ?? null,
    sponsor_name: sponsorResult.data?.full_name ?? null,
    credentials: (data.credentials as string | null) ?? null
  };
}

export async function getMemberProfileForUser(profileId: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("therapist_profiles")
    .select(
      "profile_id, public_display_name, credentials, title, bio, specialties, insurance_accepted, modalities, therapy_style_tags, populations, neighborhoods, approach_summary, website_url, booking_url, public_email, public_phone, offers_in_person, offers_telehealth, availability_status, accepting_referrals, is_public, payment_model"
    )
    .eq("profile_id", profileId)
    .maybeSingle();

  return data as Record<string, unknown> | null;
}

export function getPaymentModelLabelForUi(value: PaymentModel) {
  return getPaymentModelLabel(value);
}
