export type MembershipState = "pending" | "active" | "rejected" | "suspended";
export type UserRole = "client" | "therapist" | "admin";
export type GroupVisibility = "public" | "private_member_only";
export type PostType = "referral_request" | "consultation_request" | "job";
export type AvailabilityStatus = "accepting" | "waitlist" | "full";
export type ReferralStatus = "open" | "matched" | "declined" | "closed";
export type PaymentModel = "private_pay" | "insurance" | "both";

export interface TrustedByConnection {
  id: string;
  name: string;
  slug: string;
}

export interface PublicTherapistSummary {
  id: string;
  profileId: string;
  slug: string;
  displayName: string;
  title: string;
  bio: string;
  approachSummary: string;
  specialties: string[];
  populations: string[];
  insuranceAccepted: string[];
  paymentModel: PaymentModel;
  therapyStyleTags: string[];
  neighborhoods: string[];
  endorsementCount: number;
  membershipLabel: string;
  city: string;
  marketName: string;
  availabilityStatus: AvailabilityStatus;
  availabilityUpdatedAtLabel: string;
  inPerson: boolean;
  telehealth: boolean;
  trustedBy: TrustedByConnection[];
  sponsorName?: string;
}

export interface GroupSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  visibility: GroupVisibility;
  memberCount: number;
  marketName: string;
}

export interface FeedItem {
  id: string;
  type: PostType;
  kindLabel: "Referral request" | "Consultation request" | "Job opening";
  title: string;
  body: string;
  authorName: string;
  createdAtLabel: string;
  ctaLabel: string;
  status: ReferralStatus | "open";
  availabilitySignal?: string;
}

export interface EndorsementSummary {
  id: string;
  giverSlug?: string;
  giverName: string;
  receiverSlug?: string;
  receiverName: string;
  quote: string;
  createdAtLabel: string;
  isPublic: boolean;
}

export interface JoinRequestSummary {
  id: string;
  fullName: string;
  email: string;
  credentials: string;
  licenseNumber?: string;
  marketName: string;
  sponsorName: string;
  referralCode: string;
  createdAtLabel: string;
  status: MembershipState;
}

export interface ModerationReportSummary {
  id: string;
  targetType: "post" | "group" | "endorsement" | "therapist_profile";
  reason: string;
  reporterName: string;
  createdAtLabel: string;
  status: "open" | "reviewing" | "resolved";
}

export interface ReferralLinkSummary {
  id: string;
  code: string;
  sponsorName: string;
  invitedEmail?: string;
  maxUses: number;
  useCount: number;
  expiresAtLabel: string;
  isActive: boolean;
  inviteUrl?: string;
  emailInviteHref?: string;
}

export interface AppSession {
  userId: string;
  role: UserRole;
  membershipState: MembershipState;
  fullName: string;
  email: string;
  canIssueReferrals?: boolean;
}
