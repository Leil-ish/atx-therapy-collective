import { submitJoinApplication } from "@/app-actions/member-actions";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReferralLinkByCode } from "@/lib/data/mock-data";

export default async function JoinApplyPage({
  searchParams
}: {
  searchParams?: Promise<{ code?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const referralCode = params?.code?.trim() ?? "";
  const referralLink = referralCode ? getReferralLinkByCode(referralCode) : undefined;

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Join"
          title="Apply with a therapist referral link"
          description="Membership is referral-link based. Keep first-pass onboarding minimal now, then complete the rest of the profile after sign-in."
        />

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Referral application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {referralCode ? (
              <div className="rounded-[24px] border bg-background p-4 text-sm leading-7 text-muted-foreground">
                {referralLink ? (
                  <>
                    <p>Referral code recognized.</p>
                    <p>Sponsored by {referralLink.sponsorName}.</p>
                    <p>{referralLink.expiresAtLabel}</p>
                  </>
                ) : (
                  <>
                    <p>This referral code could not be verified in the current MVP mock data.</p>
                    <p>You can still submit the form, but real Supabase validation should happen in the server action.</p>
                  </>
                )}
              </div>
            ) : null}
            <form action={submitJoinApplication} className="space-y-4">
              <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="fullName" placeholder="Full name" />
              <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="email" placeholder="Email" type="email" />
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                name="websiteUrl"
                placeholder="Practice website (optional)"
                type="url"
              />
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                defaultValue={referralCode}
                name="referralCode"
                placeholder="Referral code"
              />
              <textarea
                className="min-h-32 w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                name="note"
                placeholder="Short note about your practice"
              />
              <Button type="submit">Submit application</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
