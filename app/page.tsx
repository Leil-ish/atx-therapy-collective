import Link from "next/link";

import { GroupCard } from "@/components/domain/group-card";
import { TherapistCard } from "@/components/domain/therapist-card";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicGroups, therapists } from "@/lib/data/mock-data";

export default function HomePage() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Austin-based therapist collective</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-tight text-foreground md:text-7xl">
              A calmer, more trusted way for Austin therapists to be known and connected.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Public profiles and groups help clients browse with confidence, while active members collaborate privately on referrals, consultation, hiring, and endorsement.
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
            <CardTitle>Invite-only by design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Therapists do not freely self-enroll into membership. Each join request is tied to an endorsement or invitation from an active member.</p>
            <p>This keeps the community local, credible, and useful for real referral trust.</p>
            <p>The private area is reserved for verified therapist members and admins only.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <SectionHeading
          eyebrow="Public directory"
          title="Featured therapist profiles"
          description="Public-facing profiles stay lightweight for MVP: clear specialties, public endorsements, and enough signal for clients and peers to know who to contact."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {therapists.map((therapist) => (
            <TherapistCard key={therapist.slug} therapist={therapist} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <SectionHeading
          eyebrow="Public groups"
          title="Community visibility without exposing the private workspace"
          description="Public groups help people understand the collective’s shape, while private collaboration remains inside the therapist-only area."
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
