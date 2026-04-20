import { FeedCard } from "@/components/domain/feed-card";
import { EmptyState } from "@/components/state/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getCuratedListsForMember, getFollowedClinicians, getMemberFeedItems } from "@/lib/data/live-data";
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
      <section className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/90">
          <CardHeader className="pb-2">
            <Badge>Account</Badge>
            <CardTitle className="text-3xl">{session?.membershipTier === "premium" ? "Premium" : "Free"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Tier</CardContent>
        </Card>
        <Card className="bg-white/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{followedClinicians.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Following</CardContent>
        </Card>
        <Card className="bg-white/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{feedItems.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Visible posts</CardContent>
        </Card>
        <Card className="bg-white/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{curatedLists.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Lists</CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/member/posts/new">Send referral</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/member/profile">Profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={"/member/following" as never}>Following</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={"/member/lists" as never}>Lists</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{followedClinicians.length > 0 ? `Following ${followedClinicians.length} clinicians.` : "No follows yet."}</p>
            <p>{curatedLists.length > 0 ? `${curatedLists.length} curated list${curatedLists.length === 1 ? "" : "s"}.` : "No curated lists yet."}</p>
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
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Directory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Profile signal, availability, payment, and trust context stay in the public directory.</p>
            <Button asChild variant="outline">
              <Link href="/directory">Open directory</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
