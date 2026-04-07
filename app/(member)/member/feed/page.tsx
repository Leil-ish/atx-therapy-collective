import { FeedCard } from "@/components/domain/feed-card";
import { EmptyState } from "@/components/state/empty-state";
import { getMemberFeedItems } from "@/lib/data/live-data";

export default async function MemberFeedPage() {
  const feedItems = await getMemberFeedItems();

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border bg-white/90 p-6 text-sm leading-7 text-muted-foreground shadow-soft">
        This feed is meant to feel more useful than a broad listserv: quick to scan, centered on fit, and clear about who is ready to step into a referral, consultation ask, or hiring need.
      </div>
      {feedItems.length > 0 ? (
        feedItems.map((item) => <FeedCard item={item} key={item.id} />)
      ) : (
        <EmptyState
          title="No posts yet"
          description="As soon as active members start using the collective for live referrals, those posts will appear here."
        />
      )}
    </div>
  );
}
