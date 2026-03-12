import { FeedCard } from "@/components/domain/feed-card";
import { GroupCard } from "@/components/domain/group-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { feedItems, memberGroups } from "@/lib/data/mock-data";

export default function MemberDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-white/90">
          <CardHeader>
            <Badge>Membership active</Badge>
            <CardTitle>Good morning, therapist member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>This is the internal starting point for referrals, consultation, hiring, and group participation.</p>
            <p>For MVP, this page highlights the highest-value collaboration surfaces instead of trying to be a full social feed.</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Fee-waiver logic snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Track monthly endorsement counts per therapist.</p>
            <p>If a therapist receives 5 or more qualifying endorsements in a month, mark fees as waived for that billing period.</p>
            <p>Billing is intentionally not implemented in MVP.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <FeedCard item={feedItems[0]} />
        <GroupCard group={memberGroups[2]} memberView />
      </section>
    </div>
  );
}
