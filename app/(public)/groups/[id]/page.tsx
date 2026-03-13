import { notFound } from "next/navigation";

import { GroupCard } from "@/components/domain/group-card";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memberGroups } from "@/lib/data/mock-data";

export default async function PublicGroupDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = memberGroups.find((item) => item.id === id && item.visibility === "public");

  if (!group) {
    notFound();
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-16">
        <GroupCard group={group} />
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>About this group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>This page is public because the group is public-facing.</p>
            <p>Discussion threads, membership management, and therapist collaboration remain inside the private member area.</p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
