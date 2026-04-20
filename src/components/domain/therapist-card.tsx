import Link from "next/link";

import { followClinician, unfollowClinician } from "@/app-actions/member-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvailabilityLabel, getPaymentModelLabelForUi } from "@/lib/data/live-data";
import type { PublicTherapistSummary } from "@/types";

export function TherapistCard({
  therapist,
  currentProfileId,
  returnTo = "/directory"
}: {
  therapist: PublicTherapistSummary;
  currentProfileId?: string;
  returnTo?: string;
}) {
  const careFormat = [therapist.inPerson ? "In person" : null, therapist.telehealth ? "Telehealth" : null]
    .filter(Boolean)
    .join(" + ");
  const canFollow = currentProfileId && currentProfileId !== therapist.profileId;

  return (
    <Card className="h-full bg-white/90">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{therapist.displayName}</CardTitle>
            <CardDescription>{therapist.title}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline">{therapist.membershipLabel}</Badge>
            <Badge>{getAvailabilityLabel(therapist.availabilityStatus)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{therapist.bio}</p>
        <div className="flex flex-wrap gap-2">
          {therapist.specialties.slice(0, 5).map((specialty) => (
            <Badge key={specialty} variant="muted">
              {specialty}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {therapist.therapyStyleTags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{therapist.approachSummary}</p>
          <p>{getPaymentModelLabelForUi(therapist.paymentModel)}</p>
          {therapist.neighborhoods.length > 0 ? <p>{therapist.neighborhoods.join(", ")}</p> : <p>{therapist.city}</p>}
          <p>{careFormat || therapist.city}</p>
          <p>{therapist.availabilityUpdatedAtLabel}</p>
          <p>
            Trusted by{" "}
            {therapist.trustedBy.length > 0
              ? therapist.trustedBy.map((connection) => connection.name).join(", ")
              : "active members in the collective"}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{therapist.endorsementCount} trusted-by endorsements</span>
          <div className="flex items-center gap-2">
            {canFollow ? (
              <form action={therapist.isFollowed ? unfollowClinician : followClinician}>
                <input name="followedProfileId" type="hidden" value={therapist.profileId} />
                <input name="returnTo" type="hidden" value={returnTo} />
                <Button size="sm" type="submit" variant={therapist.isFollowed ? "outline" : "ghost"}>
                  {therapist.isFollowed ? "Following" : "Follow"}
                </Button>
              </form>
            ) : null}
            <Link className="font-medium text-primary hover:text-primary/80" href={`/directory/${therapist.slug}`}>
              View profile
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
