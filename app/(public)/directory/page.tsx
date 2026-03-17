import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/state/empty-state";
import { TherapistCard } from "@/components/domain/therapist-card";
import { getPublicTherapists } from "@/lib/data/live-data";

export default async function DirectoryPage() {
  const therapists = await getPublicTherapists();

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Directory"
          title="Austin therapists, presented with clarity"
          description="This public directory stays intentionally focused: fit, style, trusted-by visibility, and current availability matter more than giant filter trees in the first release."
        />
        {therapists.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {therapists.map((therapist) => (
              <TherapistCard key={therapist.slug} therapist={therapist} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Directory is filling in"
            description="Once active members complete their public profile basics, they’ll appear here for trusted Austin referrals."
          />
        )}
      </section>
    </PageShell>
  );
}
