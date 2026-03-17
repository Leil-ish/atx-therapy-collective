import { createEndorsement } from "@/app-actions/member-actions";
import { EndorsementCard } from "@/components/domain/endorsement-card";
import { EmptyState } from "@/components/state/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getEndorsementCandidates, getEndorsementsForMember } from "@/lib/data/live-data";

function getStatusCopy(error?: string, saved?: string) {
  if (saved) {
    return "Endorsement saved.";
  }

  if (error === "invalid-endorsement") {
    return "Choose another therapist and add a short endorsement.";
  }

  if (error === "missing-target") {
    return "We couldn't find that therapist profile.";
  }

  if (error === "save-failed") {
    return "We couldn't save that endorsement. Please try again.";
  }

  return null;
}

export default async function MemberEndorsementsPage({
  searchParams
}: {
  searchParams?: Promise<{ saved?: string; error?: string }>;
}) {
  const session = await getSession();
  const params = searchParams ? await searchParams : undefined;
  const statusCopy = getStatusCopy(params?.error, params?.saved);
  const endorsements = session ? await getEndorsementsForMember(session.userId) : [];
  const candidates = session ? await getEndorsementCandidates(session.userId) : [];

  return (
    <div className="space-y-6">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Trusted-by endorsements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>Active therapist members can endorse another therapist in under a minute. Keep it lightweight: a short trust statement and a public/private toggle.</p>
          {statusCopy ? <div className="rounded-[24px] border bg-background p-4">{statusCopy}</div> : null}
          <form action={createEndorsement} className="space-y-4">
            <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue="" name="endorsedProfileId">
              <option value="" disabled>
                Select a therapist
              </option>
              {candidates.map((candidate) => (
                <option key={candidate.profileId} value={candidate.profileId}>
                  {candidate.label}
                </option>
              ))}
            </select>
            <textarea
              className="min-h-32 w-full rounded-2xl border bg-background px-4 py-3 text-sm"
              name="quote"
              placeholder="What makes this therapist someone you would confidently refer to?"
            />
            <label className="flex items-center gap-2 text-sm">
              <input defaultChecked name="isPublic" type="checkbox" />
              Show this endorsement publicly
            </label>
            <Button type="submit">Save endorsement</Button>
          </form>
        </CardContent>
      </Card>

      {endorsements.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {endorsements.map((endorsement) => (
            <EndorsementCard endorsement={endorsement} key={endorsement.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No endorsements yet"
          description="Once you receive or write endorsements, they’ll show up here for quick trust management."
        />
      )}
    </div>
  );
}
