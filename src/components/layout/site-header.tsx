import Link from "next/link";

import { Button } from "@/components/ui/button";

const publicNav = [
  { href: "/directory", label: "Directory" },
  { href: "/groups", label: "Groups" },
  { href: "/about", label: "How it works" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            ATX
          </div>
          <div>
            <p className="font-serif text-xl leading-none">ATX Therapy Collective</p>
            <p className="text-xs text-muted-foreground">Austin therapists, connected with care</p>
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
          <Button asChild variant="ghost">
            <Link href="/member">Member sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">Request an introduction</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
