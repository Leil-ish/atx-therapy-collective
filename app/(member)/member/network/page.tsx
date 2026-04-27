import Link from "next/link";

import { EmptyState } from "@/components/state/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getAvailabilityLabel, getDirectReferralActivity, getFollowedClinicians, getPublicTherapists } from "@/lib/data/live-data";

function getTrustCopy(trustedBy: Array<{ name: string }>, endorsementCount: number) {
  if (trustedBy.length === 1) {
    return `Trusted by ${trustedBy[0]?.name}`;
  }

  if (trustedBy.length > 1) {
    return `Trusted by ${trustedBy[0]?.name} and ${trustedBy.length - 1} others`;
  }

  return `${endorsementCount} trust signal${endorsementCount === 1 ? "" : "s"}`;
}

export default async function MemberNetworkPage() {
  const session = await getSession();
  const [following, directReferrals, { therapists }] = await Promise.all([
    session ? getFollowedClinicians(session.userId) : Promise.resolve([]),
    session
      ? getDirectReferralActivity(session.userId)
      : Promise.resolve({ sentCount: 0, receivedCount: 0, exchangedCount: 0, incoming: [], outgoing: [] }),
    getPublicTherapists(session?.userId, 60, 0)
  ]);

  const suggestions = therapists
    .filter((therapist) => !therapist.isFollowed)
    .filter((therapist) => therapist.trustedBy.length > 0 || therapist.endorsementCount > 0)
    .slice(0, 6);
  const recentPartners = [...new Set([...directReferrals.outgoing, ...directReferrals.incoming].map((item) => item.counterpartName))].slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border bg-white/90 p-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Network</p>
          <h2 className="font-serif text-3xl text-foreground">People you trust and who they trust</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Keep trusted therapists close, see second-degree trust clearly, and remember who you refer to most.
          </p>
        </div>
        <Button asChild>
          <Link href="/member/referrals">Find a therapist match</Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{following.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">People you trust</CardContent>
        </Card>
        <Card className="bg-white/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{suggestions.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Trusted by your network</CardContent>
        </Card>
        <Card className="bg-white/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{directReferrals.exchangedCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Active referral partners</CardContent>
        </Card>
      </section>

      {following.length > 0 ? (
        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-foreground">People you trust</h3>
            <p className="text-sm text-muted-foreground">These therapists stay close at hand while you are making referrals.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {following.map((clinician) => (
              <Card className="bg-white/90" key={clinician.profileId}>
                <CardContent className="flex items-start justify-between gap-4 pt-6">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-foreground">{clinician.displayName}</p>
                      <p className="text-sm text-muted-foreground">{clinician.title}</p>
                    </div>
                    <Badge>{getAvailabilityLabel(clinician.availabilityStatus)}</Badge>
                    <p className="text-sm text-muted-foreground">Added {clinician.followedAtLabel}</p>
                  </div>
                  <Link className="text-sm font-medium text-primary hover:text-primary/80" href={`/directory/${clinician.slug}`}>
                    View profile
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="No trusted therapists saved yet"
          description="Save therapists from the directory and they will appear here for quicker referrals."
        />
      )}

      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-foreground">Trusted by your network</h3>
          <p className="text-sm text-muted-foreground">These are good people to review next when you need a trusted second-degree match.</p>
        </div>
        {suggestions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {suggestions.map((therapist) => (
              <Card className="bg-white/90" key={therapist.profileId}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-foreground">{therapist.displayName}</p>
                      <p className="text-sm text-muted-foreground">{therapist.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{getAvailabilityLabel(therapist.availabilityStatus)}</Badge>
                      <Badge variant="outline">{therapist.neighborhoods[0] ?? therapist.city}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{getTrustCopy(therapist.trustedBy, therapist.endorsementCount)}</p>
                  <Link className="text-sm font-medium text-primary hover:text-primary/80" href={`/directory/${therapist.slug}`}>
                    View profile
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No second-degree trust matches yet"
            description="As your network grows, trusted introductions from your contacts will show up here."
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-foreground">Recent referral partners</h3>
          <p className="text-sm text-muted-foreground">These are the clinicians you have exchanged referrals with most recently.</p>
        </div>
        {recentPartners.length > 0 ? (
          <Card className="bg-white/90">
            <CardContent className="flex flex-wrap gap-3 pt-6">
              {recentPartners.map((name) => (
                <Badge key={name} variant="outline">
                  {name}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title="No recent referral partners yet"
            description="Once you start sending referrals, your active referral relationships will show up here."
          />
        )}
      </section>
    </div>
  );
}
