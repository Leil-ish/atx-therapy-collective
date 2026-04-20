import { redirect } from "next/navigation";
import Link from "next/link";

import { TherapistCard } from "@/components/domain/therapist-card";
import { PageShell } from "@/components/layout/page-shell";
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
  const { therapists } = await getPublicTherapists(session?.userId, 3, 0, undefined, undefined, undefined, undefined);

  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[1.25fr_0.75fr] md:py-18">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Trusted therapist collective</p>
            <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] text-foreground md:text-6xl">
              Therapist directory, referrals, and trust signal for Austin clinicians.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Browse who is available, who is trusted, and where referrals fit best.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/directory">Browse therapists</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={(session ? "/member/feed" : "/login") as never}>{session ? "Referrals" : "Member sign in"}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/join/apply">Join the beta</Link>
            </Button>
          </div>
        </div>

        <Card className="border-primary/10 bg-white/70 shadow-none">
          <CardHeader>
            <CardTitle>Available now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Directory filters for availability, payment, and care format.</p>
            <p>Referral posting inside the member workspace.</p>
            <p>Follow clinicians and build short curated trust lists.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Directory</p>
            <h2 className="font-serif text-4xl leading-tight text-foreground">Current clinicians</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/directory">Open directory</Link>
          </Button>
        </div>
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
    </PageShell>
  );
}
