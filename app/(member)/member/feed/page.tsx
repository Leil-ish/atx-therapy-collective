import { FeedCard } from "@/components/domain/feed-card";
import { EmptyState } from "@/components/state/empty-state";
import { getMemberFeedItems } from "@/lib/data/live-data";

export default async function MemberFeedPage() {
  const feedItems = await getMemberFeedItems();

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border bg-white/90 p-6 text-sm leading-7 text-muted-foreground shadow-soft">
        Prioritize clinicians who are trusted and actually available. Later, this feed can support decline and closed states more explicitly without changing the overall workflow.
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
