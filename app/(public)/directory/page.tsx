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
          description="This public directory stays intentionally focused: fit, style, trusted-by visibility, and current availability matter more than giant filter trees in the first release."
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
