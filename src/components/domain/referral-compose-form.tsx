"use client";

import { useRef, useState } from "react";

import { createMemberPost } from "@/app-actions/member-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AUSTIN_METRO_AREAS,
  CLIENT_POPULATIONS,
  INSURANCE_CARRIERS,
  LEVELS_OF_CARE,
  MODALITIES,
  PRESENTING_ISSUES,
  URGENCY_LEVELS,
  countOverlappingTerms,
  normalizeForMatch,
  regionMatches
} from "@/lib/referral-matching";
import type { PublicTherapistSummary } from "@/types";

type PreferenceStrength = "dealbreaker" | "nice_to_have";

function getPaymentModelLabel(value: string) {
  if (value === "private_pay") return "Private pay";
  if (value === "insurance") return "Insurance";
  return "Private pay + insurance";
}

function getTypeLabel(type: string) {
  if (type === "consultation_request") return "Consultation request";
  if (type === "job") return "Job opening";
  return "Referral request";
}

function parseCsv(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildStructuredLines(formData: FormData) {
  const lines = [
    buildPreferenceLine("Region", String(formData.get("regionWanted") ?? ""), String(formData.get("regionPreference") ?? "")),
    buildPreferenceLine(
      "Presenting issues",
      parseCsv(formData.get("presentingIssues")).join(", "),
      String(formData.get("presentingIssuesPreference") ?? "")
    ),
    buildPreferenceLine(
      "Client type / population",
      parseCsv(formData.get("populationsWanted")).join(", "),
      String(formData.get("populationsPreference") ?? "")
    ),
    buildPreferenceLine(
      "Modality",
      parseCsv(formData.get("modalitiesWanted")).join(", "),
      String(formData.get("modalitiesPreference") ?? "")
    ),
    buildPreferenceLine(
      "Insurance",
      parseCsv(formData.get("insuranceWanted")).join(", "),
      String(formData.get("insurancePreference") ?? "")
    ),
    buildPreferenceLine("Payment model", String(formData.get("paymentWanted") ?? ""), String(formData.get("paymentPreference") ?? "")),
    buildPreferenceLine("Care format", String(formData.get("formatWanted") ?? ""), String(formData.get("formatPreference") ?? "")),
    optionalLine("Level of care", String(formData.get("levelOfCare") ?? "")),
    optionalLine("Urgency", String(formData.get("urgencyLevel") ?? ""))
  ].filter(Boolean);

  return lines as string[];
}

function optionalLine(label: string, value: string) {
  return value.trim() ? `${label}: ${value.trim()}` : null;
}

function buildPreferenceLine(label: string, value: string, preference: string) {
  const cleaned = value.trim();
  if (!cleaned) return null;

  const suffix = preference === "dealbreaker" ? " (dealbreaker)" : preference === "nice_to_have" ? " (nice-to-have)" : "";
  return `${label}: ${cleaned}${suffix}`;
}

function buildMailtoHref(formData: FormData, senderEmail?: string) {
  const type = String(formData.get("type") ?? "referral_request").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const directEmail = String(formData.get("directEmail") ?? "").trim().replace(/\s+/g, "");
  const structuredLines = buildStructuredLines(formData);

  const lines = [
    getTypeLabel(type),
    "",
    `Summary: ${title}`,
    ...structuredLines,
    "",
    "Details:",
    body,
    "",
    senderEmail ? `Reply to: ${senderEmail}` : null
  ].filter(Boolean);

  return `mailto:${directEmail}?subject=${encodeURIComponent(
    `${getTypeLabel(type)}: ${title}`
  )}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function PreferenceSelect({
  name,
  value,
  onChange
}: {
  name: string;
  value: PreferenceStrength;
  onChange: (value: PreferenceStrength) => void;
}) {
  return (
    <>
      <select
        className="rounded-xl border bg-white px-3 py-2 text-sm"
        name={name}
        onChange={(event) => onChange(event.target.value as PreferenceStrength)}
        value={value}
      >
        <option value="dealbreaker">Dealbreaker</option>
        <option value="nice_to_have">Nice-to-have</option>
      </select>
    </>
  );
}

function MultiSelectChips({
  label,
  name,
  options,
  selected,
  onToggle,
  preferenceName,
  preference,
  onPreferenceChange
}: {
  label: string;
  name: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  preferenceName: string;
  preference: PreferenceStrength;
  onPreferenceChange: (value: PreferenceStrength) => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <PreferenceSelect name={preferenceName} onChange={onPreferenceChange} value={preference} />
      </div>
      <input name={name} type="hidden" value={selected.join(",")} />
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              className={`rounded-xl border px-3 py-2 text-sm ${active ? "border-primary bg-primary text-primary-foreground" : "bg-white text-muted-foreground"}`}
              key={option}
              onClick={(event) => {
                event.preventDefault();
                onToggle(option);
              }}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReferralComposeForm({
  senderEmail,
  statusCopy,
  therapists
}: {
  senderEmail?: string;
  statusCopy?: string | null;
  therapists: PublicTherapistSummary[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [, setFormVersion] = useState(0);

  const [regionWanted, setRegionWanted] = useState("");
  const [regionPreference, setRegionPreference] = useState<PreferenceStrength>("dealbreaker");
  const [paymentWanted, setPaymentWanted] = useState("");
  const [paymentPreference, setPaymentPreference] = useState<PreferenceStrength>("dealbreaker");
  const [formatWanted, setFormatWanted] = useState("");
  const [formatPreference, setFormatPreference] = useState<PreferenceStrength>("dealbreaker");
  const [presentingIssues, setPresentingIssues] = useState<string[]>([]);
  const [presentingIssuesPreference, setPresentingIssuesPreference] = useState<PreferenceStrength>("dealbreaker");
  const [populationsWanted, setPopulationsWanted] = useState<string[]>([]);
  const [populationsPreference, setPopulationsPreference] = useState<PreferenceStrength>("dealbreaker");
  const [modalitiesWanted, setModalitiesWanted] = useState<string[]>([]);
  const [modalitiesPreference, setModalitiesPreference] = useState<PreferenceStrength>("nice_to_have");
  const [insuranceWanted, setInsuranceWanted] = useState<string[]>([]);
  const [insurancePreference, setInsurancePreference] = useState<PreferenceStrength>("nice_to_have");

  const form = formRef.current ? new FormData(formRef.current) : null;
  const title = normalizeForMatch(String(form?.get("title") ?? ""));
  const body = normalizeForMatch(String(form?.get("body") ?? ""));
  const summaryText = [title, body].filter(Boolean).join(" ");

  const matchedTherapists = therapists
    .map((therapist) => {
      const searchable = normalizeForMatch(
        [
          therapist.displayName,
          therapist.title,
          therapist.bio,
          therapist.approachSummary,
          therapist.specialties.join(" "),
          therapist.populations.join(" "),
          therapist.therapyStyleTags.join(" "),
          therapist.neighborhoods.join(" "),
          therapist.insuranceAccepted.join(" ")
        ].join(" ")
      );

      const keywordScore = summaryText
        ? summaryText
            .split(/\s+/)
            .filter((word) => word.length > 2)
            .reduce((score, word) => score + (searchable.includes(word) ? 1 : 0), 0)
        : 0;

      const issueOverlap = countOverlappingTerms(presentingIssues, therapist.specialties);
      const populationOverlap = countOverlappingTerms(populationsWanted, therapist.populations);
      const modalityOverlap = countOverlappingTerms(modalitiesWanted, therapist.therapyStyleTags);
      const insuranceOverlap = countOverlappingTerms(insuranceWanted, therapist.insuranceAccepted);
      const matchesRegion = regionWanted ? regionMatches(regionWanted, therapist.neighborhoods, therapist.city) : true;
      const matchesPayment = paymentWanted ? therapist.paymentModel === paymentWanted : true;
      const matchesFormat =
        !formatWanted ||
        (formatWanted === "telehealth" && therapist.telehealth) ||
        (formatWanted === "in_person" && therapist.inPerson) ||
        (formatWanted === "both" && therapist.inPerson && therapist.telehealth);

      return {
        therapist,
        keywordScore,
        issueOverlap,
        populationOverlap,
        modalityOverlap,
        insuranceOverlap,
        matchesRegion,
        matchesPayment,
        matchesFormat
      };
    })
    .filter((match) => {
      if (regionWanted && regionPreference === "dealbreaker" && !match.matchesRegion) return false;
      if (paymentWanted && paymentPreference === "dealbreaker" && !match.matchesPayment) return false;
      if (formatWanted && formatPreference === "dealbreaker" && !match.matchesFormat) return false;
      if (presentingIssues.length > 0 && presentingIssuesPreference === "dealbreaker" && match.issueOverlap === 0) return false;
      if (populationsWanted.length > 0 && populationsPreference === "dealbreaker" && match.populationOverlap === 0) return false;
      if (modalitiesWanted.length > 0 && modalitiesPreference === "dealbreaker" && match.modalityOverlap === 0) return false;
      if (insuranceWanted.length > 0 && insurancePreference === "dealbreaker" && match.insuranceOverlap === 0) return false;
      return true;
    })
    .sort((a, b) => {
      const trustA = Number(Boolean(a.therapist.isFollowed || a.therapist.trustedByViewer));
      const trustB = Number(Boolean(b.therapist.isFollowed || b.therapist.trustedByViewer));
      if (trustA !== trustB) return trustB - trustA;

      const scoreA =
        a.keywordScore +
        a.issueOverlap * 4 +
        a.populationOverlap * 3 +
        a.modalityOverlap * 2 +
        a.insuranceOverlap * 2 +
        Number(a.matchesRegion && regionPreference === "nice_to_have") * 2 +
        Number(a.matchesPayment && paymentPreference === "nice_to_have") * 2 +
        Number(a.matchesFormat && formatPreference === "nice_to_have") * 2;

      const scoreB =
        b.keywordScore +
        b.issueOverlap * 4 +
        b.populationOverlap * 3 +
        b.modalityOverlap * 2 +
        b.insuranceOverlap * 2 +
        Number(b.matchesRegion && regionPreference === "nice_to_have") * 2 +
        Number(b.matchesPayment && paymentPreference === "nice_to_have") * 2 +
        Number(b.matchesFormat && formatPreference === "nice_to_have") * 2;

      if (scoreA !== scoreB) return scoreB - scoreA;

      const availabilityRank = { accepting: 2, waitlist: 1, full: 0 } as const;
      if (availabilityRank[a.therapist.availabilityStatus] !== availabilityRank[b.therapist.availabilityStatus]) {
        return availabilityRank[b.therapist.availabilityStatus] - availabilityRank[a.therapist.availabilityStatus];
      }

      return b.therapist.endorsementCount - a.therapist.endorsementCount;
    })
    .slice(0, 10);

  function emailMatchedTherapist(email: string) {
    const formElement = formRef.current;
    if (!formElement) return;

    const formData = new FormData(formElement);
    formData.set("directEmail", email);
    const currentTitle = String(formData.get("title") ?? "").trim();
    const currentBody = String(formData.get("body") ?? "").trim();

    if (!currentTitle || !currentBody) {
      setDraftError("Add a referral summary and details before emailing a match.");
      return;
    }

    setDraftError(null);
    window.location.href = buildMailtoHref(formData, senderEmail);
  }

  function openEmailDraft() {
    const formElement = formRef.current;
    if (!formElement) return;

    const formData = new FormData(formElement);
    const currentTitle = String(formData.get("title") ?? "").trim();
    const currentBody = String(formData.get("body") ?? "").trim();
    const directEmail = String(formData.get("directEmail") ?? "").trim();

    if (!currentTitle || !currentBody) {
      setDraftError("Add a title and details before opening an email draft.");
      return;
    }

    if (!directEmail) {
      setDraftError("Add a direct email address or use Email match from a result card.");
      return;
    }

    setDraftError(null);
    window.location.href = buildMailtoHref(formData, senderEmail);
  }

  return (
    <form action={createMemberPost} className="space-y-6" onChange={() => setFormVersion((value) => value + 1)} ref={formRef}>
      {statusCopy ? <div className="rounded-2xl border bg-background p-4 text-sm leading-7 text-muted-foreground">{statusCopy}</div> : null}
      {draftError ? <div className="rounded-2xl border bg-background p-4 text-sm leading-7 text-muted-foreground">{draftError}</div> : null}

      <div className="grid gap-4 rounded-2xl border bg-background p-4 md:grid-cols-2">
        <select className="w-full rounded-2xl border bg-white px-4 py-3 text-sm" defaultValue="referral_request" name="type">
          <option value="referral_request">Referral request</option>
          <option value="consultation_request">Consultation request</option>
          <option value="job">Job opening</option>
        </select>
        <select className="w-full rounded-2xl border bg-white px-4 py-3 text-sm" name="levelOfCare">
          <option value="">Any level of care</option>
          {LEVELS_OF_CARE.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input className="w-full rounded-2xl border bg-white px-4 py-3 text-sm md:col-span-2" name="title" placeholder="Title or short summary" />
        <select className="w-full rounded-2xl border bg-white px-4 py-3 text-sm" name="urgencyLevel">
          <option value="">Urgency</option>
          {URGENCY_LEVELS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
          name="directEmail"
          placeholder="Direct email for a draft"
          type="email"
        />
        <textarea
          className="min-h-36 w-full rounded-2xl border bg-white px-4 py-3 text-sm md:col-span-2"
          name="body"
          placeholder="Referral details, goals, clinical context, and anything that affects fit."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-2xl border bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Region</p>
            <PreferenceSelect name="regionPreference" onChange={setRegionPreference} value={regionPreference} />
          </div>
          <input name="regionWanted" type="hidden" value={regionWanted} />
          <select
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            onChange={(event) => setRegionWanted(event.target.value)}
            value={regionWanted}
          >
            <option value="">All Austin metro areas</option>
            {AUSTIN_METRO_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3 rounded-2xl border bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Payment model</p>
            <PreferenceSelect name="paymentPreference" onChange={setPaymentPreference} value={paymentPreference} />
          </div>
          <input name="paymentWanted" type="hidden" value={paymentWanted} />
          <select
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            onChange={(event) => setPaymentWanted(event.target.value)}
            value={paymentWanted}
          >
            <option value="">Any payment model</option>
            <option value="private_pay">Private pay</option>
            <option value="insurance">Insurance</option>
            <option value="both">Private pay + insurance</option>
          </select>
        </div>

        <div className="space-y-3 rounded-2xl border bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Care format</p>
            <PreferenceSelect name="formatPreference" onChange={setFormatPreference} value={formatPreference} />
          </div>
          <input name="formatWanted" type="hidden" value={formatWanted} />
          <select
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            onChange={(event) => setFormatWanted(event.target.value)}
            value={formatWanted}
          >
            <option value="">Any care format</option>
            <option value="telehealth">Telehealth</option>
            <option value="in_person">In person</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      <MultiSelectChips
        label="Presenting issues"
        name="presentingIssues"
        onPreferenceChange={setPresentingIssuesPreference}
        onToggle={(value) => setPresentingIssues((items) => toggleValue(items, value))}
        options={PRESENTING_ISSUES}
        preference={presentingIssuesPreference}
        preferenceName="presentingIssuesPreference"
        selected={presentingIssues}
      />
      <MultiSelectChips
        label="Client type / population"
        name="populationsWanted"
        onPreferenceChange={setPopulationsPreference}
        onToggle={(value) => setPopulationsWanted((items) => toggleValue(items, value))}
        options={CLIENT_POPULATIONS}
        preference={populationsPreference}
        preferenceName="populationsPreference"
        selected={populationsWanted}
      />
      <MultiSelectChips
        label="Treatment style or modality"
        name="modalitiesWanted"
        onPreferenceChange={setModalitiesPreference}
        onToggle={(value) => setModalitiesWanted((items) => toggleValue(items, value))}
        options={MODALITIES}
        preference={modalitiesPreference}
        preferenceName="modalitiesPreference"
        selected={modalitiesWanted}
      />
      <MultiSelectChips
        label="Insurance carriers"
        name="insuranceWanted"
        onPreferenceChange={setInsurancePreference}
        onToggle={(value) => setInsuranceWanted((items) => toggleValue(items, value))}
        options={INSURANCE_CARRIERS}
        preference={insurancePreference}
        preferenceName="insurancePreference"
        selected={insuranceWanted}
      />

      <div className="flex flex-wrap gap-3">
        <Button type="submit">Post to network</Button>
        <Button onClick={openEmailDraft} type="button" variant="outline">
          Open email draft
        </Button>
      </div>

      <div className="space-y-4 rounded-2xl border bg-background p-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Top matches</p>
          <p className="text-sm text-muted-foreground">Trusted clinicians rank first, then fit, availability, and endorsement strength.</p>
        </div>

        {matchedTherapists.length > 0 ? (
          <div className="grid gap-4">
            {matchedTherapists.map(({ therapist, issueOverlap, populationOverlap, modalityOverlap, insuranceOverlap }) => (
              <div className="rounded-2xl border bg-white p-4" key={therapist.profileId}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="font-serif text-2xl text-foreground">{therapist.displayName}</p>
                    <p className="text-sm text-muted-foreground">{therapist.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {therapist.trustedByViewer ? <Badge variant="outline">Trusted by you</Badge> : null}
                      {therapist.isFollowed ? <Badge variant="outline">Following</Badge> : null}
                      <Badge>{therapist.neighborhoods[0] ?? therapist.city}</Badge>
                      <Badge variant="outline">{getPaymentModelLabel(therapist.paymentModel)}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {therapist.publicEmail ? (
                      <Button onClick={() => emailMatchedTherapist(therapist.publicEmail!)} type="button">
                        Email match
                      </Button>
                    ) : null}
                    <Button asChild type="button" variant="outline">
                      <a href={`/directory/${therapist.slug}`}>View profile</a>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {therapist.specialties.slice(0, 5).map((specialty) => (
                    <Badge key={specialty} variant="muted">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {issueOverlap > 0 ? <Badge variant="outline">{issueOverlap} issue match</Badge> : null}
                  {populationOverlap > 0 ? <Badge variant="outline">{populationOverlap} population match</Badge> : null}
                  {modalityOverlap > 0 ? <Badge variant="outline">{modalityOverlap} modality match</Badge> : null}
                  {insuranceOverlap > 0 ? <Badge variant="outline">{insuranceOverlap} insurance match</Badge> : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Choose criteria to narrow the list. Dealbreakers filter. Nice-to-haves rank.</p>
        )}
      </div>
    </form>
  );
}
