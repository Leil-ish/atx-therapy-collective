import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReferralLinkSummary } from "@/types";

export function ReferralLinkCard({ referralLink }: { referralLink: ReferralLinkSummary }) {
  return (
    <Card className="bg-white/90">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{referralLink.code}</CardTitle>
          <Badge variant={referralLink.isActive ? "default" : "outline"}>
            {referralLink.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
        <p>Sponsor: {referralLink.sponsorName}</p>
        <p>Usage: {referralLink.useCount} / {referralLink.maxUses}</p>
        <p>{referralLink.expiresAtLabel}</p>
        {referralLink.invitedEmail ? <p>Reserved for: {referralLink.invitedEmail}</p> : null}
        {referralLink.inviteUrl ? (
          <div className="rounded-2xl border bg-background px-4 py-3 text-xs leading-6 text-foreground">
            {referralLink.inviteUrl}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-1">
          {referralLink.inviteUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={referralLink.inviteUrl}>Open invite link</a>
            </Button>
          ) : null}
          {referralLink.emailInviteHref ? (
            <Button asChild size="sm">
              <a href={referralLink.emailInviteHref}>Email invitation</a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
