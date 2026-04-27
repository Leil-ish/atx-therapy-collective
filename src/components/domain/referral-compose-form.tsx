"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { sendDirectReferral } from "@/app-actions/member-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AUSTIN_METRO_AREAS, normalizeForMatch, paymentModelMatchesFilter, regionMatches } from "@/lib/referral-matching";
import type { PublicTherapistSummary } from "@/types";

function getPaymentModelLabel(value: string) {
  if (value === "private_pay") return "Private pay";
  if (value === "insurance") return "Insurance";
  return "Private pay and insurance";
}

function getCareFormatLabel(therapist: PublicTherapistSummary) {
  if (therapist.inPerson && therapist.telehealth) {
    return "In person and telehealth";
  }

  if (therapist.telehealth) {
    return "Telehealth";
  }

  return "In person";
}

function getTrustContext(therapist: PublicTherapistSummary) {
  if (therapist.trustedByViewer) {
    return "Trusted by you";
  }

  if (therapist.isFollowed) {
    return "In your network";
  }

  if (therapist.trustedBy.length === 1) {
    return `Trusted by ${therapist.trustedBy[0]?.name}`;
  }

  if (therapist.trustedBy.length > 1) {
    return `Trusted by ${therapist.trustedBy[0]?.name} and ${therapist.trustedBy.length - 1} others`;
  }

  return "No direct trust context yet";
}

function getAvailabilityRank(status: PublicTherapistSummary["availabilityStatus"]) {
  if (status === "accepting") return 3;
  if (status === "waitlist") return 2;
  return 1;
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
  const [title, setTitle] = useState("");
  const [clientNeed, setClientNeed] = useState("");
  const [body, setBody] = useState("");
  const [regionWanted, setRegionWanted] = useState("");
  const [paymentWanted, setPaymentWanted] = useState("");
  const [formatWanted, setFormatWanted] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");

  const queryText = normalizeForMatch([title, clientNeed, body].join(" "));

  const matchedTherapists = therapists
    .filter((therapist) => (regionWanted ? regionMatches(regionWanted, therapist.neighborhoods, therapist.city) : true))
    .filter((therapist) => paymentModelMatchesFilter(therapist.paymentModel, paymentWanted))
    .filter((therapist) => {
      if (!formatWanted) return true;
      if (formatWanted === "telehealth") return therapist.telehealth;
      if (formatWanted === "in_person") return therapist.inPerson;
      return therapist.inPerson && therapist.telehealth;
    })
    .map((therapist) => {
      const searchable = normalizeForMatch(
        [
          therapist.displayName,
          therapist.title,
          therapist.specialties.join(" "),
          therapist.populations.join(" "),
          therapist.approachSummary,
          therapist.neighborhoods.join(" ")
        ].join(" ")
      );

      const keywordMatches = queryText
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .reduce((score, word) => score + (searchable.includes(word) ? 1 : 0), 0);

      const trustScore =
        Number(Boolean(therapist.trustedByViewer)) * 8 +
        Number(Boolean(therapist.isFollowed)) * 5 +
        Math.min(therapist.trustedBy.length, 3) * 2;

      return {
        therapist,
        score: keywordMatches + trustScore + getAvailabilityRank(therapist.availabilityStatus)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  useEffect(() => {
    if (!matchedTherapists.some((match) => match.therapist.profileId === selectedProfileId)) {
      setSelectedProfileId(matchedTherapists[0]?.therapist.profileId ?? "");
    }
  }, [matchedTherapists, selectedProfileId]);

  const selectedTherapist = matchedTherapists.find((match) => match.therapist.profileId === selectedProfileId)?.therapist;

  return (
    <form action={sendDirectReferral} className="space-y-6">
      {statusCopy ? <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">{statusCopy}</div> : null}

      <input name="returnTo" type="hidden" value="/member/referrals" />
      <input name="type" type="hidden" value="referral_request" />
      <input name="receiverProfileId" type="hidden" value={selectedProfileId} />
      <input name="presentingIssues" type="hidden" value={clientNeed} />

      <div className="grid gap-4 rounded-2xl border bg-background p-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-foreground" htmlFor="title">
            Referral summary
          </label>
          <input
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            id="title"
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Adult client needing trauma-informed therapist"
            required
            value={title}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="clientNeed">
            Main need
          </label>
          <input
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            id="clientNeed"
            onChange={(event) => setClientNeed(event.target.value)}
            placeholder="Trauma, couples, teen anxiety, postpartum"
            value={clientNeed}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="regionWanted">
            Location
          </label>
          <select
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            id="regionWanted"
            name="regionWanted"
            onChange={(event) => setRegionWanted(event.target.value)}
            value={regionWanted}
          >
            <option value="">Any Austin area</option>
            {AUSTIN_METRO_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="formatWanted">
            Format
          </label>
          <select
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            id="formatWanted"
            name="formatWanted"
            onChange={(event) => setFormatWanted(event.target.value)}
            value={formatWanted}
          >
            <option value="">Any format</option>
            <option value="telehealth">Telehealth</option>
            <option value="in_person">In person</option>
            <option value="both">Needs both</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="paymentWanted">
            Payment
          </label>
          <select
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            id="paymentWanted"
            name="paymentWanted"
            onChange={(event) => setPaymentWanted(event.target.value)}
            value={paymentWanted}
          >
            <option value="">Any payment</option>
            <option value="private_pay">Private pay</option>
            <option value="insurance">Insurance</option>
            <option value="both">Private pay and insurance</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-foreground" htmlFor="body">
            Referral details
          </label>
          <textarea
            className="min-h-32 w-full rounded-2xl border bg-white px-4 py-3 text-sm"
            id="body"
            name="body"
            onChange={(event) => setBody(event.target.value)}
            placeholder="Share the details a receiving therapist needs to know."
            required
            value={body}
          />
          <p className="text-sm text-muted-foreground">
            We rank trusted matches first, then fit and availability.
            {senderEmail ? ` Replies can come back to ${senderEmail}.` : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border bg-background p-5">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Best matches</p>
          <p className="text-sm text-muted-foreground">Choose one therapist to send this referral to now.</p>
        </div>

        {matchedTherapists.length > 0 ? (
          <div className="grid gap-4">
            {matchedTherapists.map(({ therapist }) => {
              const checked = therapist.profileId === selectedProfileId;

              return (
                <label
                  className={`block rounded-2xl border p-4 ${checked ? "border-primary bg-white" : "bg-white/80"}`}
                  key={therapist.profileId}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-foreground">{therapist.displayName}</p>
                        <p className="text-sm text-muted-foreground">{therapist.title}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>
                          {therapist.availabilityStatus === "accepting"
                            ? "Accepting referrals"
                            : therapist.availabilityStatus === "waitlist"
                              ? "Limited openings"
                              : "Not accepting referrals"}
                        </Badge>
                        <Badge variant="outline">{therapist.neighborhoods[0] ?? therapist.city}</Badge>
                      </div>
                    </div>

                    <input
                      checked={checked}
                      className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
                      onChange={() => setSelectedProfileId(therapist.profileId)}
                      type="radio"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {therapist.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="muted">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>{getCareFormatLabel(therapist)}</p>
                    <p>{getPaymentModelLabel(therapist.paymentModel)}</p>
                    <p className="md:col-span-2">{getTrustContext(therapist)}</p>
                  </div>

                  <div className="mt-4">
                    <Link className="text-sm font-medium text-primary hover:text-primary/80" href={`/directory/${therapist.slug}`}>
                      View profile
                    </Link>
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-4 text-sm text-muted-foreground">
            No therapists match those details yet. Broaden a filter or open the directory to keep scanning.
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/90 p-5">
        <p className="text-sm text-muted-foreground">After you send it, the referral status will appear below as pending, viewed, or responded.</p>
        <Button disabled={!selectedTherapist} type="submit">
          {selectedTherapist ? `Send referral to ${selectedTherapist.displayName}` : "Choose a match"}
        </Button>
      </div>
    </form>
  );
}
