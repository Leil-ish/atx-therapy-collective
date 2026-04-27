export const AUSTIN_METRO_AREAS = [
  "North Austin",
  "Central Austin",
  "South Austin",
  "East Austin",
  "West Austin",
  "Westlake",
  "Round Rock",
  "Cedar Park",
  "Georgetown",
  "Pflugerville",
  "Leander",
  "Lakeway",
  "Dripping Springs",
  "Buda",
  "Kyle"
] as const;

const REGION_ALIASES: Record<(typeof AUSTIN_METRO_AREAS)[number], string[]> = {
  "North Austin": [
    "North Austin",
    "Northwest Hills",
    "Allandale",
    "Crestview",
    "Brentwood",
    "North Burnet",
    "Arboretum",
    "Domain",
    "Far North Austin",
    "Wells Branch",
    "Anderson Mill",
    "Jollyville"
  ],
  "Central Austin": [
    "Central Austin",
    "Downtown",
    "Clarksville",
    "Hyde Park",
    "Rosedale",
    "Tarrytown",
    "Mueller",
    "North Loop",
    "Hancock",
    "Bouldin Creek",
    "Zilker"
  ],
  "South Austin": [
    "South Austin",
    "South Congress",
    "South Lamar",
    "Travis Heights",
    "Cherry Creek",
    "Circle C",
    "Southpark Meadows",
    "Sunset Valley",
    "Manchaca",
    "Oak Hill"
  ],
  "East Austin": [
    "East Austin",
    "East Cesar Chavez",
    "Holly",
    "Govalle",
    "Montopolis",
    "Del Valle",
    "Pecan Springs",
    "MLK"
  ],
  "West Austin": [
    "West Austin",
    "Northwest Hills",
    "Tarrytown",
    "Westlake Hills",
    "Rollingwood",
    "Barton Creek",
    "Steiner Ranch",
    "Lake Travis",
    "Bee Cave",
    "Oak Hill"
  ],
  Westlake: ["Westlake", "West Lake Hills", "Westlake Hills", "Rollingwood"],
  "Round Rock": ["Round Rock"],
  "Cedar Park": ["Cedar Park"],
  Georgetown: ["Georgetown"],
  Pflugerville: ["Pflugerville"],
  Leander: ["Leander"],
  Lakeway: ["Lakeway"],
  "Dripping Springs": ["Dripping Springs", "Belterra"],
  Buda: ["Buda"],
  Kyle: ["Kyle"]
};

export const PRESENTING_ISSUES = [
  "Anxiety",
  "Depression",
  "Trauma / PTSD",
  "OCD",
  "ADHD",
  "Eating disorders",
  "Addiction / substance use",
  "Grief",
  "Relationship issues",
  "Couples",
  "Family conflict",
  "Life transitions",
  "Neurodiversity",
  "Perinatal mental health",
  "Sexual health",
  "Self-harm",
  "Suicidality",
  "Bipolar disorder",
  "Personality disorders",
  "Burnout",
  "Chronic illness",
  "Insomnia / sleep",
  "Men's issues",
  "Women's issues"
] as const;

export const CLIENT_POPULATIONS = [
  "Children",
  "Teens",
  "Adults",
  "Older adults",
  "Couples",
  "Families",
  "Groups",
  "LGBTQ+",
  "BIPOC",
  "Neurodivergent clients",
  "Veterans",
  "First responders",
  "Faith-integrated",
  "Perinatal",
  "College students",
  "Professionals / burnout",
  "Spanish-speaking"
] as const;

export const MODALITIES = [
  "ACT",
  "CBT",
  "DBT",
  "EMDR",
  "Psychodynamic",
  "Relational",
  "Attachment-based",
  "Somatic",
  "EFT",
  "IFS",
  "Solution-focused",
  "Family systems",
  "Gottman",
  "Exposure therapy",
  "Mindfulness-based"
] as const;

export const INSURANCE_CARRIERS = [
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare",
  "Oscar",
  "Oxford",
  "UMR",
  "Magellan",
  "Scott & White",
  "Tricare",
  "Medicare",
  "Medicaid",
  "Out of network"
] as const;

export const LEVELS_OF_CARE = [
  "Outpatient",
  "Intensive outpatient (IOP)",
  "Partial hospitalization (PHP)",
  "Residential",
  "Consultation only"
] as const;

export const URGENCY_LEVELS = ["Low", "Medium", "High", "Urgent"] as const;

export function normalizeForMatch(value: string) {
  return value.trim().toLowerCase();
}

export function regionMatches(region: string, neighborhoods: string[], city?: string) {
  const normalizedRegion = normalizeForMatch(region);

  if (!normalizedRegion) {
    return true;
  }

  const canonicalRegion = AUSTIN_METRO_AREAS.find((area) => normalizeForMatch(area) === normalizedRegion);
  const aliases = canonicalRegion ? REGION_ALIASES[canonicalRegion] : [];
  const searchTerms = [region, ...aliases].map(normalizeForMatch);
  const haystack = [...neighborhoods, city ?? ""].map(normalizeForMatch);

  return haystack.some((item) =>
    searchTerms.some((term) => item.includes(term) || term.includes(item))
  );
}

export function countOverlappingTerms(selected: string[], candidate: string[]) {
  if (selected.length === 0 || candidate.length === 0) {
    return 0;
  }

  const normalizedCandidate = candidate.map(normalizeForMatch);
  return selected.reduce((count, term) => {
    const normalizedTerm = normalizeForMatch(term);
    return count + (normalizedCandidate.some((item) => item.includes(normalizedTerm)) ? 1 : 0);
  }, 0);
}

export function paymentModelMatchesFilter(
  therapistPaymentModel: "private_pay" | "insurance" | "both",
  requestedPaymentModel?: string
) {
  if (!requestedPaymentModel) {
    return true;
  }

  if (requestedPaymentModel === "both") {
    return therapistPaymentModel === "both";
  }

  if (therapistPaymentModel === "both") {
    return requestedPaymentModel === "private_pay" || requestedPaymentModel === "insurance";
  }

  return therapistPaymentModel === requestedPaymentModel;
}
