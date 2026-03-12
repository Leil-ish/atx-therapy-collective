import { GroupCard } from "@/components/domain/group-card";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicGroups } from "@/lib/data/mock-data";

export default function PublicGroupsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Groups"
          title="Public-facing groups that reflect the collective"
          description="Public groups are discoverable without login, while any private therapist collaboration remains in the member area."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {publicGroups.map((group) => (
            <GroupCard group={group} key={group.slug} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
