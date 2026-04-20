import { FeedCard } from "@/components/domain/feed-card";
import { EmptyState } from "@/components/state/empty-state";
import { Button } from "@/components/ui/button";
import { getMemberFeedItems } from "@/lib/data/live-data";
import Link from "next/link";

export default async function MemberFeedPage() {
  const feedItems = await getMemberFeedItems();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/90 p-6 shadow-soft">
        <div>
          <h2 className="font-serif text-3xl">Referrals</h2>
        </div>
        <Button asChild>
          <Link href="/member/posts/new">Send referral</Link>
        </Button>
      </div>
      {feedItems.length > 0 ? (
        feedItems.map((item) => <FeedCard item={item} key={item.id} />)
      ) : (
        <EmptyState
          title="No posts yet"
          description="Posts appear here as members start using the network."
        />
      )}
    </div>
  );
}
