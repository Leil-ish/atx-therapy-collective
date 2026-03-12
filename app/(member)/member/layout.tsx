import Link from "next/link";

const memberNav = [
  { href: "/member", label: "Dashboard" },
  { href: "/member/feed", label: "Feed" },
  { href: "/member/groups/referral-roundtable", label: "Groups" },
  { href: "/member/posts/new", label: "Create post" },
  { href: "/member/profile", label: "My profile" }
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-5 rounded-[32px] border bg-white/85 p-6 shadow-soft md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Private therapist workspace</p>
            <h1 className="font-serif text-4xl">Member community</h1>
          </div>
          <nav className="flex flex-wrap gap-3">
            {memberNav.map((item) => (
              <Link
                className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
