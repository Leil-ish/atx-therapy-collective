import { createReferralLink } from "@/app-actions/member-actions";
import { ReferralLinkCard } from "@/components/domain/referral-link-card";
import { EmptyState } from "@/components/state/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getReferralLinksForMember } from "@/lib/data/live-data";

function getStatusCopy(error?: string, created?: string) {
  if (created) {
    return "Referral link created.";
  }

  if (error === "not-allowed") {
    return "You do not have referral-link privileges yet.";
  }

  if (error === "create-failed") {
    return "We couldn't create that referral link. Please try again.";
  }

  if (error === "invalid-link") {
    return "Please choose a valid invitation setup.";
  }

  return null;
}

export default async function MemberReferralsPage({
  searchParams
}: {
  searchParams?: Promise<{ created?: string; error?: string }>;
}) {
  const session = await getSession();
  const params = searchParams ? await searchParams : undefined;
  const statusCopy = getStatusCopy(params?.error, params?.created);
  const referralLinks = session ? await getReferralLinksForMember(session.userId, session.fullName) : [];

  return (
    <div className="space-y-6">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Referral links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Referral links are the only therapist onboarding path in MVP. Each link acts as the sponsorship path and should only be issued by trusted members.
          </p>
          <p>
            Use the direct invite link when you want the simplest experience. If you reserve the invite for an email, you can also launch a prefilled email draft from the card below.
          </p>
          {statusCopy ? <div className="rounded-[24px] border bg-background p-4">{statusCopy}</div> : null}
          {session?.canIssueReferrals ? (
            <form action={createReferralLink} className="space-y-4">
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                name="invitedEmail"
                placeholder="Invitee email (optional)"
                type="email"
              />
              <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue="1" name="maxUses">
                <option value="1">Single use</option>
                <option value="3">Up to 3 uses</option>
              </select>
              <Button type="submit">Create referral link</Button>
            </form>
          ) : (
            <EmptyState
              title="Referral privileges not enabled"
              description="Admins can grant trusted-referrer status once a therapist is established on the platform."
            />
          )}
        </CardContent>
      </Card>

      {referralLinks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {referralLinks.map((referralLink) => (
            <ReferralLinkCard key={referralLink.id} referralLink={referralLink} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No referral links yet"
          description="Once you issue referral links, they'll appear here with usage counts and expiration details."
        />
      )}
    </div>
  );
}
