import { EndorsementCard } from "@/components/domain/endorsement-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { endorsements } from "@/lib/data/mock-data";

export default function MemberEndorsementsPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Trusted-by endorsements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>Active therapist members can endorse another therapist in under a minute. Keep it lightweight: a short trust statement and a public/private toggle.</p>
          <form className="space-y-4">
            <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" placeholder="Therapist name or profile URL" />
            <textarea
              className="min-h-32 w-full rounded-2xl border bg-background px-4 py-3 text-sm"
              placeholder="What makes this therapist someone you would confidently refer to?"
            />
            <Button type="submit">Save endorsement placeholder</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {endorsements.map((endorsement) => (
          <EndorsementCard endorsement={endorsement} key={endorsement.id} />
        ))}
      </div>
    </div>
  );
}
