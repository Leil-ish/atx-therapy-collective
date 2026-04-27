import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl space-y-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">About</p>
          <h1 className="font-serif text-5xl leading-tight text-foreground">Austin Therapist Exchange</h1>
          <p className="text-base text-muted-foreground">Private referral access for Austin clinicians.</p>
        </div>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>What it includes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>A directory for quick scanning, a referral workspace, and a practical trust network.</p>
            <p>Members use it to find the right therapist match faster than email, spreadsheets, or Facebook groups.</p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
