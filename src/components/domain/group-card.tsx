import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GroupSummary } from "@/types";

export function GroupCard({ group, memberView = false }: { group: GroupSummary; memberView?: boolean }) {
  return (
    <Card className="h-full bg-white/90">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-2xl">{group.name}</CardTitle>
          <Badge variant={group.visibility === "public" ? "default" : "outline"}>{group.visibility}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{group.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{group.memberCount} members</span>
          <Link
            className="font-medium text-primary hover:text-primary/80"
            href={memberView ? `/member/groups/${group.slug}` : `/groups/${group.id}`}
          >
            {memberView ? "Open group" : "Learn more"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
