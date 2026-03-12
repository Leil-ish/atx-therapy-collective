import type { FeedItem, GroupSummary, PublicTherapistSummary } from "@/types";

export const therapists: PublicTherapistSummary[] = [
  {
    slug: "maya-hernandez-lcsw",
    displayName: "Maya Hernandez, LCSW",
    title: "Trauma-informed therapist for adults and couples",
    bio: "Maya supports Austinites navigating life transitions, burnout, and relational repair with grounded, culturally responsive care.",
    specialties: ["Trauma", "Burnout", "Couples"],
    endorsementCount: 9,
    membershipLabel: "Active member"
  },
  {
    slug: "julian-park-lpc",
    displayName: "Julian Park, LPC",
    title: "Anxiety, identity, and men’s mental health",
    bio: "Julian works with professionals and creatives looking for practical, emotionally attuned therapy rooted in long-term change.",
    specialties: ["Anxiety", "Identity", "Men's mental health"],
    endorsementCount: 6,
    membershipLabel: "Active member"
  },
  {
    slug: "nina-patel-lmft",
    displayName: "Nina Patel, LMFT",
    title: "Family systems and perinatal transitions",
    bio: "Nina helps families and parents move through high-stakes seasons with steadiness, clarity, and warmth.",
    specialties: ["Perinatal", "Families", "Attachment"],
    endorsementCount: 5,
    membershipLabel: "Active member"
  }
];

export const publicGroups: GroupSummary[] = [
  {
    slug: "south-austin-peer-consult",
    name: "South Austin Peer Consult",
    description: "An open listing for a recurring consultation circle focused on case reflection and ethical support.",
    visibility: "public",
    memberCount: 18
  },
  {
    slug: "neurodiversity-clinicians",
    name: "Neurodiversity-Affirming Clinicians",
    description: "A public-facing group that helps therapists discover one another before joining the private internal space.",
    visibility: "public",
    memberCount: 22
  }
];

export const memberGroups: GroupSummary[] = [
  ...publicGroups,
  {
    slug: "referral-roundtable",
    name: "Referral Roundtable",
    description: "Private member-only discussion space for warm handoffs, niche matching, and ongoing availability updates.",
    visibility: "private",
    memberCount: 44
  }
];

export const feedItems: FeedItem[] = [
  {
    id: "feed-1",
    kindLabel: "Referral request",
    title: "Seeking trauma-informed therapist for teen in Central Austin",
    body: "Need openings within two weeks for a teen client preferring in-person care after school hours. Insurance flexibility helpful.",
    authorName: "Maya Hernandez",
    createdAtLabel: "Today",
    ctaLabel: "Reply in thread"
  },
  {
    id: "feed-2",
    kindLabel: "Consultation request",
    title: "Consult needed around OCD treatment planning",
    body: "Looking for a short consult with someone strong in ERP who can weigh in on pacing and readiness for exposure work.",
    authorName: "Julian Park",
    createdAtLabel: "Yesterday",
    ctaLabel: "Offer consult"
  },
  {
    id: "feed-3",
    kindLabel: "Job opening",
    title: "Part-time associate opportunity in North Loop",
    body: "Small group practice seeking a relational clinician comfortable with adults and couples. Hybrid setup, strong supervision culture.",
    authorName: "Nina Patel",
    createdAtLabel: "2 days ago",
    ctaLabel: "View details"
  }
];
