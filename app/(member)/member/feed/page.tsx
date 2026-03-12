import { FeedCard } from "@/components/domain/feed-card";
import { feedItems } from "@/lib/data/mock-data";

export default function MemberFeedPage() {
  return (
    <div className="space-y-6">
      {feedItems.map((item) => (
        <FeedCard item={item} key={item.id} />
      ))}
    </div>
  );
}
