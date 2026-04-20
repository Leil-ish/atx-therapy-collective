import Link from "next/link";

import { signOut } from "@/app-actions/auth-actions";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

const publicNav = [
  { href: "/directory", label: "Directory" },
  { href: "/join/apply", label: "Join" },
  { href: "/about", label: "How it works" }
] as const;

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-primary/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-primary/20 bg-primary text-sm font-semibold tracking-[0.2em] text-primary-foreground">
            T
          </div>
          <div>
            <p className="font-serif text-xl leading-none">Trusted Therapist Collective</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Trust-led referrals in Austin</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {publicNav.map((item) => (
            <Link className="text-sm text-muted-foreground hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <form action={signOut}>
              <Button type="submit" variant="ghost">
                Sign out
              </Button>
            </form>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/login">Member sign in</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/join/apply">Join beta</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
