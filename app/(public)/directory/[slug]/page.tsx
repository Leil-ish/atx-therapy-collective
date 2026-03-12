import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { therapists } from "@/lib/data/mock-data";

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
            <Badge variant="outline">{therapist.membershipLabel}</Badge>
            <CardTitle className="text-4xl">{therapist.displayName}</CardTitle>
            <p className="text-lg text-muted-foreground">{therapist.title}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="leading-7 text-muted-foreground">{therapist.bio}</p>
            <div className="flex flex-wrap gap-2">
              {therapist.specialties.map((specialty) => (
                <Badge key={specialty}>{specialty}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Public endorsements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>{therapist.endorsementCount} active-member endorsements are visible on this public profile.</p>
            <p>For MVP, endorsements matter more than long-form testimonials and only count when the endorser is an active therapist member.</p>
            <p>Private collaboration history stays fully separated from public profile content.</p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
