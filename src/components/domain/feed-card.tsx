import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeedItem } from "@/types";

export function FeedCard({ item }: { item: FeedItem }) {
  const statusLabel =
    item.status === "matched"
      ? "Matched"
      : item.status === "declined"
        ? "Declined"
        : item.status === "closed"
          ? "Closed"
          : "Open";

  return (
    <Card className="bg-white/90">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{item.kindLabel}</Badge>
          <Badge variant="outline">{statusLabel}</Badge>
          <span className="text-sm text-muted-foreground">{item.createdAtLabel}</span>
        </div>
        <CardTitle className="text-2xl">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
        {item.availabilitySignal ? <p className="text-sm leading-6 text-muted-foreground">{item.availabilitySignal}</p> : null}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Posted by {item.authorName}</span>
          <span className="font-medium text-primary">{item.ctaLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
