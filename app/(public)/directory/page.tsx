import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { TherapistCard } from "@/components/domain/therapist-card";
import { therapists } from "@/lib/data/mock-data";

export default function DirectoryPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Directory"
          title="Austin therapists, presented with clarity"
          description="This public directory is intentionally simple for MVP: search and filters can come next, but the initial release should center trust, fit, and local context."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {therapists.map((therapist) => (
            <TherapistCard key={therapist.slug} therapist={therapist} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
