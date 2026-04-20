import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <header className="rounded-[32px] border bg-white/85 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin and moderation</p>
          <h1 className="mt-2 font-serif text-4xl">Network operations</h1>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/90">
          <CardHeader>
            <Badge>Join requests</Badge>
            <CardTitle>Pending membership reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
              Referral-backed applications awaiting review.
          </CardContent>
        </Card>

          <Card className="bg-white/90">
          <CardHeader>
            <Badge variant="outline">Moderation</Badge>
            <CardTitle>Reported content queue</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
              Reports tied to posts, groups, endorsements, or member behavior.
          </CardContent>
        </Card>

          <Card className="bg-white/90">
            <CardHeader>
              <Badge variant="muted">Membership states</Badge>
              <CardTitle>Status controls</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Pending, active, rejected, and suspended states.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
