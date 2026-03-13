import { FeedCard } from "@/components/domain/feed-card";
import { feedItems } from "@/lib/data/mock-data";

export default function MemberFeedPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border bg-white/90 p-6 text-sm leading-7 text-muted-foreground shadow-soft">
        Prioritize clinicians who are trusted and actually available. Later, this feed can support decline and closed states more explicitly without changing the overall workflow.
      </div>
      {feedItems.map((item) => (
        <FeedCard item={item} key={item.id} />
      ))}
    </div>
  );
}
