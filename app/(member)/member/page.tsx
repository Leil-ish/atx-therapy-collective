import { FeedCard } from "@/components/domain/feed-card";
import { GroupCard } from "@/components/domain/group-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { feedItems, memberGroups } from "@/lib/data/mock-data";
import Link from "next/link";

export default async function MemberDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-white/90">
          <CardHeader>
            <Badge>Membership active</Badge>
            <CardTitle>Good morning, therapist member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>This workspace is optimized for one behavior: before posting in a broad Facebook group, check the Collective first.</p>
            <p>Use it to find trusted referrals faster, see who is actually available, and stay visible to the right Austin clinicians.</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Referral-link access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              {session?.canIssueReferrals
                ? "You can create referral links for new therapists. Each link acts as the sponsorship path into the platform."
                : "You do not have trusted-referrer privileges yet. Admins can enable referral-link access for established members."}
            </p>
            <Button asChild variant="outline">
              <Link href="/member/referrals">Manage referral links</Link>
            </Button>
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
