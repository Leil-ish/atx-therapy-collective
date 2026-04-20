import Link from "next/link";

import { followClinician, unfollowClinician } from "@/app-actions/member-actions";
import { EmptyState } from "@/components/state/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getAvailabilityLabel, getFollowedClinicians, getPublicTherapists } from "@/lib/data/live-data";
import type { FollowedClinicianSummary, PublicTherapistSummary } from "@/types";

export default async function MemberFollowingPage() {
  const session = await getSession();
  const [following, { therapists }] = await Promise.all([
    session ? getFollowedClinicians(session.userId) : Promise.resolve([] as FollowedClinicianSummary[]),
    session ? getPublicTherapists(session.userId, 100, 0, undefined, undefined, undefined, undefined) : Promise.resolve({ therapists: [], totalCount: 0 })
  ]);
  const suggestions = therapists.filter((therapist) => therapist.profileId !== session?.userId).slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Prioritized</p>
        <h2 className="font-serif text-4xl">Prioritized clinicians</h2>
      </div>

      {following.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {following.map((clinician) => (
            <Card className="bg-white/90" key={clinician.profileId}>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-2xl">{clinician.displayName}</CardTitle>
                  <Badge>{getAvailabilityLabel(clinician.availabilityStatus)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{clinician.title}</p>
                {clinician.headline ? <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{clinician.headline}</p> : null}
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>{clinician.followedAtLabel}</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/directory/${clinician.slug}`}>View profile</Link>
                  </Button>
                  <form action={unfollowClinician}>
                    <input name="followedProfileId" type="hidden" value={clinician.profileId} />
                    <input name="returnTo" type="hidden" value="/member/following" />
                    <Button size="sm" type="submit" variant="ghost">Unfollow</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No prioritized clinicians yet"
          description="Prioritized clinicians rank higher in your matches and feed."
        />
      )}

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Suggested clinicians to prioritize</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {suggestions.map((therapist) => (
            <div className="rounded-[24px] border bg-background p-4 text-sm leading-7 text-muted-foreground" key={therapist.profileId}>
              <p className="font-medium text-foreground">{therapist.displayName}</p>
              <p>{therapist.title}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/directory/${therapist.slug}`}>Profile</Link>
                </Button>
                {therapist.isFollowed ? null : (
                  <form action={followClinician}>
                    <input name="followedProfileId" type="hidden" value={therapist.profileId} />
                    <input name="returnTo" type="hidden" value="/member/following" />
                    <Button size="sm" type="submit">Prioritize</Button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
