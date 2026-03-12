import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "A therapist receives an invitation or submits a join request tied to an endorsement from an active member.",
  "Admin reviews the request, verifies fit, and sets membership to pending, active, rejected, or suspended.",
  "Active therapist members access referrals, consultations, jobs, groups, and endorsement tools in the private workspace."
];

export default function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl space-y-10 px-6 py-16">
        <SectionHeading
          eyebrow="How it works"
          title="Built for professional trust, not open-network growth"
          description="ATX Therapy Collective is a therapist-centered platform that keeps public discovery simple and reserves deeper collaboration for verified members."
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
            <p>Membership is endorsement-based only. There is no open self-serve therapist signup into full access.</p>
            <p>Endorsements are lightweight and count toward monthly fee-waiver logic once they come from active members.</p>
            <p>Austin is the launch market, but the schema and route naming stay city-agnostic so expansion remains straightforward later.</p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
