import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "A trusted member refers a therapist into the network through a referral link that doubles as a sponsorship path.",
  "Admin verifies fit, keeps quality high, and activates therapists only after the referral and profile basics are in place.",
  "Active members use the Collective before public listservs or Facebook groups when they need a trusted referral fast."
];

export default function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl space-y-10 px-6 py-16">
        <SectionHeading
          eyebrow="How it works"
          title="Built for professional trust, not open-network growth"
          description="ATX Therapy Collective is designed for private-practice therapists and group practice owners who need a calmer, more credible local referral workflow."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card className="bg-white/90" key={step}>
              <CardHeader>
                <CardTitle>Step {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">{step}</CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>MVP decisions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Public profile fields emphasize fit, style, trust, and current availability rather than trying to become a giant search taxonomy.</p>
            <p>Trust stays simple in v1: trusted-by endorsements from active members, without gamified tiers or weighted social ranking.</p>
            <p>Facilities, events, and algorithmic connection tiers remain later-phase so the Austin therapist experience can stay focused and dense first.</p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
