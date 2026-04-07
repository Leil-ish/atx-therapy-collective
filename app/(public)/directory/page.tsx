import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/state/empty-state";
import { TherapistCard } from "@/components/domain/therapist-card";
import { getPublicTherapists } from "@/lib/data/live-data";

function matchesSearch(haystack: string[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return haystack.some((value) => value.toLowerCase().includes(normalizedQuery));
}

export default async function DirectoryPage({
  searchParams
}: {
  searchParams?: Promise<{
    q?: string;
    availability?: string;
    payment?: string;
    format?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const allTherapists = await getPublicTherapists();
  const query = params?.q?.trim() ?? "";
  const availability = params?.availability?.trim() ?? "";
  const payment = params?.payment?.trim() ?? "";
  const format = params?.format?.trim() ?? "";

  const therapists = allTherapists.filter((therapist) => {
    const searchMatch = matchesSearch(
      [
        therapist.displayName,
        therapist.title,
        therapist.bio,
        therapist.approachSummary,
        therapist.city,
        ...therapist.specialties,
        ...therapist.populations,
        ...therapist.neighborhoods,
        ...therapist.therapyStyleTags
      ],
      query
    );
    const availabilityMatch = !availability || therapist.availabilityStatus === availability;
    const paymentMatch = !payment || therapist.paymentModel === payment;
    const formatMatch =
      !format ||
      (format === "telehealth" && therapist.telehealth) ||
      (format === "in_person" && therapist.inPerson) ||
      (format === "both" && therapist.telehealth && therapist.inPerson);

    return searchMatch && availabilityMatch && paymentMatch && formatMatch;
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Directory"
          title="Austin therapists, presented with clarity"
          description="This public directory stays intentionally focused: fit, trusted relationships, care format, payment model, and current availability matter more than giant taxonomy trees."
        />
        <form className="grid gap-4 rounded-[28px] border bg-white/90 p-5 md:grid-cols-[1.8fr_repeat(3,1fr)]">
          <input
            className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
            defaultValue={query}
            name="q"
            placeholder="Search by name, specialty, neighborhood, or approach"
          />
          <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue={availability} name="availability">
            <option value="">Any availability</option>
            <option value="accepting">Accepting new clients</option>
            <option value="waitlist">Limited openings</option>
            <option value="full">Not accepting referrals</option>
          </select>
          <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue={payment} name="payment">
            <option value="">Any payment model</option>
            <option value="private_pay">Private pay</option>
            <option value="insurance">Insurance</option>
            <option value="both">Private pay + insurance</option>
          </select>
          <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue={format} name="format">
            <option value="">Any care format</option>
            <option value="telehealth">Telehealth</option>
            <option value="in_person">In person</option>
            <option value="both">Both</option>
          </select>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            Showing {therapists.length} therapist{therapists.length === 1 ? "" : "s"}
            {query ? ` for "${query}"` : ""}.
          </p>
          <p>Use the filters to narrow for fit before sending a referral out.</p>
        </div>
        {therapists.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {therapists.map((therapist) => (
              <TherapistCard key={therapist.slug} therapist={therapist} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No therapists match those filters"
            description="Try broadening the search or removing a filter. As more active members complete their public profile, directory coverage will deepen."
          />
        )}
      </section>
    </PageShell>
  );
}
