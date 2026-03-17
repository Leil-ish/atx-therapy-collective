import { reviewJoinRequest } from "@/app-actions/admin-actions";
import { EmptyState } from "@/components/state/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminJoinRequests } from "@/lib/data/live-data";

function getStatusCopy(error?: string, reviewed?: string) {
  if (reviewed === "active") {
    return "Join request approved.";
  }

  if (reviewed === "rejected") {
    return "Join request rejected.";
  }

  if (error === "invalid-review") {
    return "Please choose a valid review action.";
  }

  if (error === "missing-request") {
    return "That join request could not be found.";
  }

  if (error === "review-failed") {
    return "We couldn't save that review decision. Please try again.";
  }

  return null;
}

export default async function AdminJoinRequestsPage({
  searchParams
}: {
  searchParams?: Promise<{ reviewed?: string; error?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const requests = await getAdminJoinRequests();
  const statusCopy = getStatusCopy(params?.error, params?.reviewed);

  return (
    <div className="space-y-6">
      {statusCopy ? (
        <div className="rounded-[28px] border bg-white/90 p-6 text-sm leading-7 text-muted-foreground shadow-soft">
          {statusCopy}
        </div>
      ) : null}

      {requests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {requests.map((request) => (
            <Card className="bg-white/90" key={request.id}>
              <CardHeader className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {request.createdAtLabel} · {request.status}
                </p>
                <CardTitle className="text-xl">{request.fullName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>{request.credentials}{request.licenseNumber ? ` · ${request.licenseNumber}` : ""}</p>
                <p>{request.email}</p>
                <p>Sponsored by {request.sponsorName}</p>
                <p>Referral code: {request.referralCode || "Unavailable"}</p>
                <form action={reviewJoinRequest} className="space-y-3">
                  <input name="requestId" type="hidden" value={request.id} />
                  <label className="flex items-center gap-2">
                    <input name="grantReferrals" type="checkbox" />
                    Grant trusted-referrer access on approval
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                    name="rejectionReason"
                    placeholder="Optional rejection note"
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button name="decision" type="submit" value="approve">
                      Approve
                    </Button>
                    <Button name="decision" type="submit" value="reject" variant="outline">
                      Reject
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No join requests pending"
          description="New therapist applications submitted with referral links will appear here for manual review."
        />
      )}
    </div>
  );
}
