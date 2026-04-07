import { redirect } from "next/navigation";
import Link from "next/link";

import { GroupCard } from "@/components/domain/group-card";
import { TherapistCard } from "@/components/domain/therapist-card";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/state/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
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
  const session = await getSession();

  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Austin-based therapist collective</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-tight text-foreground md:text-7xl">
              Trusted therapy referrals in Austin, without the listserv scramble.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              ATX Therapy Collective helps therapists, group practices, and referral-heavy teams find strong-fit clinicians faster, see who is actually available, and keep trusted referral relationships in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/directory">Browse therapists</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={session ? "/member/posts/new" : "/login"}>{session ? "Send a referral" : "Member sign in"}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/join/apply">Join as a therapist</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Clear availability</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                See which therapists are actively accepting, have limited openings, or are temporarily full before you send a referral out.
              </CardContent>
            </Card>
            <Card className="bg-white/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Trusted relationships</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                Membership and endorsements stay sponsor-backed so the network feels more like trusted colleagues and less like a cold directory.
              </CardContent>
            </Card>
            <Card className="bg-white/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Built for real referral flow</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                The first beta is optimized for agencies, group practices, and therapists who need strong matches quickly, not just a prettier signup form.
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-white/85">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>1. A trusted therapist sponsors a referral-backed application into the collective.</p>
            <p>2. Active members keep their availability and profile signals current so matches can happen faster.</p>
            <p>3. Therapists use the private workspace to move referrals, consultation asks, and hiring opportunities without spraying them into broad public channels.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <SectionHeading
          eyebrow="Public directory"
          title="Featured therapist profiles"
          description="Profiles emphasize the signals therapists actually need in order to make a confident referral: fit, location, payment model, trusted-by relationships, and current availability."
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
          eyebrow="Referral teams"
          title="A useful wedge for agencies and group practices"
          description="The strongest early beta partners are teams who already have steady referral volume but weak trusted-match systems. The product gets better when it solves real supply-side pain first."
        />
        <Card className="bg-white/90">
          <CardContent className="flex flex-col gap-4 p-6 text-sm leading-7 text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p>
                If your team is currently posting in Slack, texting colleagues, or passing around aging spreadsheets, the Collective is being built to make that process more trustworthy and easier to scan.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/about">See the beta model</Link>
            </Button>
          </CardContent>
        </Card>
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
