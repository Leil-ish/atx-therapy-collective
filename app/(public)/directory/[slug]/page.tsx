import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { getAvailabilityLabel, therapists } from "@/lib/data/mock-data";

export default async function TherapistProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const therapist = therapists.find((item) => item.slug === slug);

  if (!therapist) {
    notFound();
  }

  return (
    <PageShell>
      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-16 md:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-white/90">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{therapist.membershipLabel}</Badge>
              <Badge>{getAvailabilityLabel(therapist.availabilityStatus)}</Badge>
            </div>
            <CardTitle className="text-4xl">{therapist.displayName}</CardTitle>
            <p className="text-lg text-muted-foreground">{therapist.title}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="leading-7 text-muted-foreground">{therapist.bio}</p>
            <p className="leading-7 text-muted-foreground">{therapist.approachSummary}</p>
            <div className="flex flex-wrap gap-2">
              {therapist.specialties.map((specialty) => (
                <Badge key={specialty}>{specialty}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {therapist.therapyStyleTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
              <div>
                <p className="font-medium text-foreground">Populations served</p>
                <p>{therapist.populations.join(", ")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Insurance</p>
                <p>{therapist.insuranceAccepted.join(", ")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Care format</p>
                <p>{therapist.inPerson ? "In person" : ""}{therapist.inPerson && therapist.telehealth ? " + " : ""}{therapist.telehealth ? "Telehealth" : ""}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Availability freshness</p>
                <p>{therapist.availabilityUpdatedAtLabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Trusted by</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>{therapist.endorsementCount} active-member endorsements are visible on this public profile.</p>
            <p>{therapist.sponsorName ?? "Referrals are trust-centered and sponsor-backed in this collective."}</p>
            <div className="flex flex-wrap gap-2">
              {therapist.trustedBy.map((connection) => (
                <Badge key={connection.id} variant="outline">
                  {connection.name}
                </Badge>
              ))}
            </div>
            <p>For MVP, trusted-by endorsements matter more than long-form testimonials and only count when the endorser is an active therapist member.</p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
