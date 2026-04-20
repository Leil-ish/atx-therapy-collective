import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl space-y-10 px-6 py-16">
        <SectionHeading
          eyebrow="How it works"
          title="Trusted Therapist Collective"
          description="A trust-based referral and visibility network for Austin clinicians."
        />

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>What members see here</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Profiles, referrals, follows, and endorsements.</p>
            <p>Premium adds curated lists and expanded profile tools.</p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
