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

  const haystack = [...neighborhoods, city ?? ""].map(normalizeForMatch);
  return haystack.some((item) => item.includes(normalizedRegion));
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
