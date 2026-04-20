import { FeedCard } from "@/components/domain/feed-card";
import { GroupCard } from "@/components/domain/group-card";
import { EmptyState } from "@/components/state/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getCuratedListsForMember, getFollowedClinicians, getMemberFeedItems } from "@/lib/data/live-data";
import { memberGroups } from "@/lib/data/mock-data";
import Link from "next/link";

export default async function MemberDashboardPage() {
  const session = await getSession();
  const [feedItems, followedClinicians, curatedLists] = await Promise.all([
    getMemberFeedItems(session?.userId),
    session ? getFollowedClinicians(session.userId) : Promise.resolve([]),
    session ? getCuratedListsForMember(session.userId) : Promise.resolve([])
  ]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-white/90">
          <CardHeader>
            <Badge>Membership active</Badge>
            <CardTitle>Welcome back, {session?.fullName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Referrals, follows, and profile visibility in one place.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/member/posts/new">Post a referral request</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={"/member/following" as never}>Following</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Tier and visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              {session?.membershipTier === "premium"
                ? "Curated lists and expanded profile tools are available."
                : "Free tier active. Premium adds curated lists and expanded profile tools."}
            </p>
            <Button asChild variant="outline">
              <Link href="/member/profile">Update profile</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Follow signal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>{followedClinicians.length > 0 ? `Following ${followedClinicians.length} clinicians.` : "No follows yet."}</p>
            <Button asChild variant="outline">
              <Link href={"/member/following" as never}>Manage follows</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Curation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>{curatedLists.length > 0 ? `${curatedLists.length} curated list${curatedLists.length === 1 ? "" : "s"} published.` : "No curated lists yet."}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline">
                <Link href={"/member/lists" as never}>Curated lists</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/member/endorsements">Endorse clinicians</Link>
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
            description="Posts will appear here."
          />
        )}
        <GroupCard group={memberGroups[2]} memberView />
      </section>
    </div>
  );
}
