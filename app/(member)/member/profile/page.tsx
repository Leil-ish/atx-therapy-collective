import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemberProfilePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Edit public profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Profile editing should let members update public-facing fields separately from private account metadata.</p>
          <p>This keeps the line between directory content and community operations easy to maintain.</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Endorsements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Members can endorse other active therapists with a short note and optional public visibility.</p>
          <p>Only endorsements from active therapist members count toward monthly fee-waiver logic.</p>
        </CardContent>
      </Card>
    </div>
  );
}
