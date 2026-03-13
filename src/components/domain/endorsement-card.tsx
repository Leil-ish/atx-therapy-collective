import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EndorsementSummary } from "@/types";

export function EndorsementCard({ endorsement }: { endorsement: EndorsementSummary }) {
  return (
    <Card className="bg-white/90">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{endorsement.receiverName}</CardTitle>
          <Badge variant={endorsement.isPublic ? "default" : "outline"}>
            {endorsement.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
        <p>&ldquo;{endorsement.quote}&rdquo;</p>
        <p>
          Trusted by{" "}
          {endorsement.giverSlug ? (
            <Link className="font-medium text-primary hover:text-primary/80" href={`/directory/${endorsement.giverSlug}`}>
              {endorsement.giverName}
            </Link>
          ) : (
            endorsement.giverName
          )}
        </p>
        <p>{endorsement.createdAtLabel}</p>
      </CardContent>
    </Card>
  );
}
