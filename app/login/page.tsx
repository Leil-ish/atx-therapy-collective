import Link from "next/link";

import { signInWithMagicLink } from "@/app-actions/auth-actions";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ sent?: string; error?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Member access"
          title="Therapist sign-in"
          description="Use a Supabase magic link for member sign-in. Membership access is still gated by your app-level membership state after authentication."
        />

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Email sign-in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            {params?.sent ? (
              <div className="rounded-[24px] border bg-background p-4">
                Magic link sent. Check your email and follow the link to finish sign-in.
              </div>
            ) : null}
            {params?.error ? (
              <div className="rounded-[24px] border bg-background p-4">
                Sign-in error: {params.error}
              </div>
            ) : null}
            <form action={signInWithMagicLink} className="space-y-4">
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                name="email"
                placeholder="Therapist email"
                type="email"
              />
              <Button type="submit">Send magic link</Button>
            </form>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline">
                <Link href="/join/apply">Apply with referral code</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
