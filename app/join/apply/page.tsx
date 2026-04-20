import { submitJoinApplication } from "@/app-actions/member-actions";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function getMessageCopy(error?: string) {
  if (error === "invalid-code") return "That referral code could not be found.";
  if (error === "expired-code") return "That referral code is inactive, expired, or already used.";
  if (error === "email-mismatch") return "This referral code is reserved for a different email address.";
  if (error === "already-submitted") return "An active or pending application already exists for this email.";
  if (error === "submit-failed") return "We couldn't submit your application. Please try again.";
  if (error === "missing-fields") return "Please fill in your name, email, credentials, and referral code.";
  return null;
}

export default async function JoinApplyPage({
  searchParams
}: {
  searchParams?: Promise<{ code?: string; submitted?: string; error?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const referralCode = params?.code?.trim() ?? "";
  const admin = createSupabaseAdminClient();
  const message = getMessageCopy(params?.error);
  const { data: referralLink } = referralCode
    ? await admin
        .from("invitations")
        .select("code, invited_email, is_active, max_uses, use_count, expires_at, invited_by")
        .eq("code", referralCode.toUpperCase())
        .maybeSingle()
    : { data: null };

  const sponsor = referralLink?.invited_by
    ? await admin.from("profiles").select("full_name").eq("id", referralLink.invited_by).maybeSingle()
    : { data: null };

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Join"
          title="Apply through a trusted referral path"
          description="Access is sponsor-backed. The rest of the profile comes after sign-in."
        />

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Referral application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {params?.submitted ? (
              <div className="rounded-[24px] border bg-background p-4 text-sm leading-7 text-muted-foreground">
                Application submitted. After approval, sign in and finish the profile.
              </div>
            ) : null}
            {message ? (
              <div className="rounded-[24px] border bg-background p-4 text-sm leading-7 text-muted-foreground">
                {message}
              </div>
            ) : null}
            {referralCode ? (
              <div className="rounded-[24px] border bg-background p-4 text-sm leading-7 text-muted-foreground">
                {referralLink ? (
                  <>
                    <p>Referral code recognized.</p>
                    <p>Sponsored by {sponsor.data?.full_name ?? "a trusted member"}.</p>
                    <p>
                      {referralLink.expires_at
                        ? `Expires ${new Date(referralLink.expires_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })}`
                        : "No expiration set."}
                    </p>
                  </>
                ) : (
                  <>
                    <p>This referral code could not be verified.</p>
                    <p>The request will still be checked against the live invitation record.</p>
                  </>
                )}
              </div>
            ) : null}
            <form action={submitJoinApplication} className="space-y-4">
              <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="fullName" placeholder="Full name" />
              <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="email" placeholder="Email" type="email" />
              <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="credentials" placeholder="Credentials (e.g. LPC, LCSW, LMFT)" />
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                name="licenseNumber"
                placeholder="License number (optional)"
              />
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                name="websiteUrl"
                placeholder="Practice website (optional)"
                type="url"
              />
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                defaultValue={referralCode.toUpperCase()}
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
