import { therapists } from "@/lib/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemberProfilePage() {
  const therapist = therapists[0];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Edit public profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Keep profile setup lightweight: website, style tags, specialties, and one quick availability toggle do most of the work.</p>
          <div className="space-y-3">
            <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue="https://example.com" placeholder="Website URL" />
            <input
              className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
              defaultValue={therapist.specialties.join(", ")}
              placeholder="Specialties (comma separated)"
            />
            <input
              className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
              defaultValue={therapist.therapyStyleTags.join(", ")}
              placeholder="Therapy style tags"
            />
            <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue={therapist.availabilityStatus}>
              <option value="accepting">Accepting clients</option>
              <option value="waitlist">Waitlist</option>
              <option value="full">Currently full</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Trusted-by visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Public trust should feel professional, not competitive. Show who trusts your work, not who is trying to win a leaderboard.</p>
          <p>Only endorsements from active therapist members count toward visibility and future fee-waiver logic.</p>
          <p>Availability freshness is part of trust too: members should be able to update it in seconds.</p>
        </CardContent>
      </Card>
    </div>
  );
}
