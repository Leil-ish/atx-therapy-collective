export type MembershipState = "pending" | "active" | "rejected" | "suspended";
export type UserRole = "client" | "therapist" | "admin";
export type GroupVisibility = "public" | "private";

export interface PublicTherapistSummary {
  slug: string;
  displayName: string;
  title: string;
  bio: string;
  specialties: string[];
  endorsementCount: number;
  membershipLabel: string;
}

export interface GroupSummary {
  slug: string;
  name: string;
  description: string;
  visibility: GroupVisibility;
  memberCount: number;
}

export interface FeedItem {
  id: string;
  kindLabel: "Referral request" | "Consultation request" | "Job opening";
  title: string;
  body: string;
  authorName: string;
  createdAtLabel: string;
  ctaLabel: string;
}
