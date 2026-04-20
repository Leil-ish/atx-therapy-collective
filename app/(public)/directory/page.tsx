import { PageShell } from "@/components/layout/page-shell";
import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/state/empty-state";
import { TherapistCard } from "@/components/domain/therapist-card";
import { getSession } from "@/lib/auth/session";
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
    page?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const session = await getSession();

  const query = params?.q?.trim() ?? "";
  const availability = params?.availability?.trim() ?? "";
  const payment = params?.payment?.trim() ?? "";
  const format = params?.format?.trim() ?? "";

  const THERAPISTS_PER_PAGE = 20;
  const page = Number(params?.page ?? "1");
  const offset = (page - 1) * THERAPISTS_PER_PAGE;

  const { therapists, totalCount } = await getPublicTherapists(
    session?.userId,
    THERAPISTS_PER_PAGE,
    offset,
    query,
    availability,
    payment,
    format
  );

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Directory"
          title="Connecting Austin Therapists: A Curated Directory"
          description="Our directory prioritizes what truly matters for successful referrals: a strong therapeutic fit, clear care formats, transparent payment models, and current availability. We believe in quality connections over endless listings."
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
              <TherapistCard key={therapist.slug} therapist={therapist} currentProfileId={session?.userId} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No therapists match those filters"
            description="Try broadening the search or removing a filter. As more active members complete their public profile, directory coverage will deepen."
          />
        )}

        {totalCount > THERAPISTS_PER_PAGE && (
          <div className="flex items-center justify-center gap-2">
            <Link
              className="rounded-full border px-4 py-2 text-sm font-medium"
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              href={`/directory?q=${query}&availability=${availability}&payment=${payment}&format=${format}&page=${page - 1}`}
            >
              Previous
            </Link>
            <Link
              className="rounded-full border px-4 py-2 text-sm font-medium"
              aria-disabled={page * THERAPISTS_PER_PAGE >= totalCount}
              tabIndex={page * THERAPISTS_PER_PAGE >= totalCount ? -1 : undefined}
              href={`/directory?q=${query}&availability=${availability}&payment=${payment}&format=${format}&page=${page + 1}`}
            >
              Next
            </Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}
