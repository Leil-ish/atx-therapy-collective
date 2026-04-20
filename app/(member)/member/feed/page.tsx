import { FeedCard } from "@/components/domain/feed-card";
import { EmptyState } from "@/components/state/empty-state";
import { getMemberFeedItems } from "@/lib/data/live-data";

export default async function MemberFeedPage() {
  const feedItems = await getMemberFeedItems();

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border bg-white/90 p-6 text-sm leading-7 text-muted-foreground shadow-soft">
        A tighter feed shaped by follows, fit, and current availability.
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
