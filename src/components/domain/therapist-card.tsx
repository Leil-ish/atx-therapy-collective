import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvailabilityLabel } from "@/lib/data/mock-data";
import type { PublicTherapistSummary } from "@/types";

export function TherapistCard({ therapist }: { therapist: PublicTherapistSummary }) {
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
        <p className="text-sm leading-6 text-muted-foreground">{therapist.approachSummary}</p>
        <div className="flex flex-wrap gap-2">
          {therapist.specialties.map((specialty) => (
            <Badge key={specialty} variant="muted">
              {specialty}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {therapist.therapyStyleTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{therapist.city} · {therapist.inPerson ? "In person" : ""}{therapist.inPerson && therapist.telehealth ? " + " : ""}{therapist.telehealth ? "Telehealth" : ""}</p>
          <p>{therapist.availabilityUpdatedAtLabel}</p>
          <p>Trusted by {therapist.trustedBy.map((connection) => connection.name).join(", ")}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{therapist.endorsementCount} trusted-by endorsements</span>
          <Link className="font-medium text-primary hover:text-primary/80" href={`/directory/${therapist.slug}`}>
            View profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
