import { FeedCard } from "@/components/domain/feed-card";
import { GroupCard } from "@/components/domain/group-card";
import { EmptyState } from "@/components/state/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getMemberFeedItems } from "@/lib/data/live-data";
import { memberGroups } from "@/lib/data/mock-data";
import Link from "next/link";

export default async function MemberDashboardPage() {
  const session = await getSession();
  const feedItems = await getMemberFeedItems();

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-white/90">
          <CardHeader>
            <Badge>Membership active</Badge>
            <CardTitle>Welcome back, {session?.fullName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>This workspace is optimized for one behavior: before posting in a broad Facebook group, check the Collective first.</p>
            <p>Use it to find trusted referrals faster, see who is actually available, and stay visible to the right Austin clinicians.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/member/posts/new">Post a referral request</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/member/profile">Update profile</Link>
              </Button>
            </div>
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
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Beta launch focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>For the first beta, the goal is simple: make it fast to move trusted referrals without falling back to broad listservs or Slack channels.</p>
            <p>The highest-value early partners are agencies and group practices that already have steady referral flow but weak trusted-match systems.</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Next trust actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Once your profile is in good shape, the fastest way to strengthen the network is to invite 1-3 trusted clinicians and add endorsements for people you already refer to confidently.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline">
                <Link href="/member/endorsements">Add endorsements</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/member/referrals">Invite clinicians</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {feedItems[0] ? (
          <FeedCard item={feedItems[0]} />
        ) : (
          <EmptyState
            title="No referral activity yet"
            description="Your member feed will populate here once therapists begin posting live referral requests in the collective."
          />
        )}
        <GroupCard group={memberGroups[2]} memberView />
      </section>
    </div>
  );
}
