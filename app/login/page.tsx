import Link from "next/link";

import { signInWithMagicLink, signInWithPassword } from "@/app-actions/auth-actions";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getErrorCopy(error?: string, mode?: string) {
  if (error === "missing-email") {
    return "Please enter your email address.";
  }

  if (error === "missing-password") {
    return "Please enter your password.";
  }

  if (error === "invalid-email") {
    return "That email address looks malformed. If you pasted it, try typing it once manually to avoid hidden characters or smart punctuation.";
  }

  if (mode === "password" && error === "Invalid login credentials") {
    return "Those credentials did not match an active account. Double-check the email and password, or fall back to a magic link if needed.";
  }

  return error ? `Sign-in error: ${error}` : null;
}

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ sent?: string; error?: string; mode?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const errorCopy = getErrorCopy(params?.error, params?.mode);

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl space-y-8 px-6 py-16">
        <SectionHeading
          eyebrow="Member access"
          title="Therapist sign-in"
          description="Password sign-in is the default. Magic links remain available as fallback."
        />

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Password sign-in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            {params?.sent ? (
              <div className="rounded-[24px] border bg-background p-4">
                Magic link sent. Check your inbox.
              </div>
            ) : null}
            {errorCopy ? (
              <div className="rounded-[24px] border bg-background p-4">
                {errorCopy}
              </div>
            ) : null}
            <form action={signInWithPassword} className="space-y-4">
              <input
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                inputMode="email"
                name="email"
                placeholder="Therapist email"
                spellCheck={false}
                type="email"
              />
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                name="password"
                placeholder="Password"
                type="password"
              />
              <Button type="submit">Sign in with password</Button>
            </form>
            <p className="text-xs leading-6 text-muted-foreground">
              No password yet? An admin can set one for the beta cohort.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Magic link fallback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Magic links are still subject to email delivery and provider limits.</p>
            <form action={signInWithMagicLink} className="space-y-4">
              <input
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
                inputMode="email"
                name="email"
                placeholder="Therapist email"
                spellCheck={false}
                type="email"
              />
              <Button type="submit" variant="outline">Send magic link</Button>
            </form>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="ghost">
                <Link href="/join/apply">Apply with referral code</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
