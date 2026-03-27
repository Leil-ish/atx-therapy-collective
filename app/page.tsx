import { redirect } from "next/navigation";
import Link from "next/link";

import { GroupCard } from "@/components/domain/group-card";
import { TherapistCard } from "@/components/domain/therapist-card";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/state/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicGroups } from "@/lib/data/mock-data";
import { getPublicTherapists } from "@/lib/data/live-data";

export default async function HomePage({
  searchParams
}: {
  searchParams?: Promise<{ code?: string; next?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const code = params?.code?.trim();
  const next = params?.next?.trim();

  if (code) {
    const callbackUrl = next
      ? `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`
      : `/auth/callback?code=${encodeURIComponent(code)}`;
    redirect(callbackUrl as never);
  }

  const therapists = await getPublicTherapists();

  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Austin-based therapist collective</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-tight text-foreground md:text-7xl">
              Before you post in a Facebook group, check the Collective.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              ATX Therapy Collective helps private-practice therapists and group practice owners find a trusted referral faster, signal who is actually available, and stay visible within a professional Austin network.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/directory">Browse therapists</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">See how membership works</Link>
            </Button>
          </div>
        </div>

        <Card className="bg-white/85">
          <CardHeader>
            <CardTitle>Built for professional trust</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Therapists do not freely self-enroll into membership. Every application is tied to a trusted referrer and visible sponsor relationship.</p>
            <p>Public profiles show meaningful fit signals, trusted-by endorsements, and current availability so referrals waste less time.</p>
            <p>The private area stays reserved for active therapist members who need to move referrals, consultation, and job opportunities quickly.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <SectionHeading
          eyebrow="Public directory"
          title="Featured therapist profiles"
          description="Profiles now emphasize the signals therapists actually need in order to make a confident referral: fit, style, trusted-by relationships, and current availability."
        />
        {therapists.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {therapists.map((therapist) => (
              <TherapistCard key={therapist.slug} therapist={therapist} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Profiles are coming online"
            description="As soon as active members complete their public profile basics, the featured therapist directory will appear here."
          />
        )}
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <SectionHeading
          eyebrow="Public groups"
          title="Community visibility without exposing the private workspace"
          description="Groups support the brand and local density of the network, while the primary workflow remains trusted referrals inside the therapist-only space."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {publicGroups.map((group) => (
            <GroupCard group={group} key={group.slug} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
