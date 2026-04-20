import { redirect } from "next/navigation";
import Link from "next/link";

import { TherapistCard } from "@/components/domain/therapist-card";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/state/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
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

  const session = await getSession();
  const therapists = await getPublicTherapists(session?.userId);

  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Trusted therapist collective</p>
            <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] text-foreground md:text-7xl">
              Follow trusted clinicians. Make stronger referrals. Build signal through curation.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              A trust-based referral and visibility network for Austin clinicians.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/directory">Browse therapists</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={(session ? "/member/following" : "/login") as never}>{session ? "Follow trusted clinicians" : "Member sign in"}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/join/apply">Join the beta</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-primary/10 bg-white/60 shadow-none">
              <CardHeader className="pb-3">
              <CardTitle className="text-lg">Follow signal</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              See the people and referrals that matter most to your work.
            </CardContent>
          </Card>
            <Card className="border-primary/10 bg-white/60 shadow-none">
              <CardHeader className="pb-3">
              <CardTitle className="text-lg">Curate trust</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Publish a concise roster of clinicians you trust.
            </CardContent>
          </Card>
            <Card className="border-primary/10 bg-white/60 shadow-none">
              <CardHeader className="pb-3">
              <CardTitle className="text-lg">Stay referral-ready</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Availability, fit, and trust stay visible.
            </CardContent>
          </Card>
          </div>
        </div>

        <Card className="border-primary/10 bg-white/70 shadow-none">
          <CardHeader>
            <CardTitle>What this is</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Referral access through trusted invitations.</p>
            <p>Profiles shaped by fit, availability, and trust.</p>
            <p>Optional premium tools for curation and visibility.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <SectionHeading
          eyebrow="Public directory"
          title="A directory shaped by trust signals"
          description="Profiles center fit, follows, curated trust context, payment model, and current availability."
        />
        {therapists.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {therapists.map((therapist) => (
              <TherapistCard key={therapist.slug} therapist={therapist} currentProfileId={session?.userId} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Profiles are coming online"
            description="Featured profiles appear here as members complete the basics."
          />
        )}
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <SectionHeading
          eyebrow="Tiers"
          title="Free to participate. Premium for added visibility."
          description=""
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-primary/10 bg-white/80 shadow-none">
            <CardHeader>
              <CardTitle>Free</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>Profile, referrals, follows, endorsements.</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-white/80 shadow-none">
            <CardHeader>
              <CardTitle>Premium beta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>Curated lists, profile enhancements, offerings.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
