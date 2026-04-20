import { saveCuratedList } from "@/app-actions/member-actions";
import { EmptyState } from "@/components/state/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getCuratedListsForMember, getPublicTherapists } from "@/lib/data/live-data";

function getStatusCopy(error?: string, saved?: string) {
  if (saved) {
    return "Curated list saved.";
  }

  if (error === "premium-required") {
    return "Curated lists are a premium beta feature.";
  }

  if (error === "missing-fields") {
    return "Add a title and at least one clinician to the list.";
  }

  if (error === "save-failed") {
    return "We couldn't save that curated list. Please try again.";
  }

  return null;
}

export default async function CuratedListsPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await getSession();
  const params = searchParams ? await searchParams : undefined;
  const [lists, { therapists }] = await Promise.all([
    session ? getCuratedListsForMember(session.userId) : Promise.resolve([]),
    session ? getPublicTherapists(session.userId, 1000, 0, undefined, undefined, undefined, undefined) : Promise.resolve({ therapists: [], totalCount: 0 })
  ]);
  const statusCopy = getStatusCopy(params?.error, params?.saved);

  return (
    <div className="space-y-8">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Curated lists</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Curated lists are short trust rosters for clinicians you would confidently refer to.</p>
          {statusCopy ? <div className="rounded-[24px] border bg-background p-4">{statusCopy}</div> : null}
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Create a curated list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session?.membershipTier === "premium" ? (
            <form action={saveCuratedList} className="space-y-4">
              <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="title" placeholder="List title" />
              <textarea className="min-h-28 w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="description" placeholder="Short description" />
              <div className="grid gap-4 md:grid-cols-2">
                <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue="" name="profileA">
                  <option value="">Choose first clinician</option>
                  {therapists.map((therapist) => (
                    <option key={therapist.profileId} value={therapist.profileId}>{therapist.displayName}</option>
                  ))}
                </select>
                <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="noteA" placeholder="Optional note" />
                <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue="" name="profileB">
                  <option value="">Choose second clinician</option>
                  {therapists.map((therapist) => (
                    <option key={therapist.profileId} value={therapist.profileId}>{therapist.displayName}</option>
                  ))}
                </select>
                <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="noteB" placeholder="Optional note" />
                <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue="" name="profileC">
                  <option value="">Choose third clinician</option>
                  {therapists.map((therapist) => (
                    <option key={therapist.profileId} value={therapist.profileId}>{therapist.displayName}</option>
                  ))}
                </select>
                <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="noteC" placeholder="Optional note" />
              </div>
              <label className="flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 text-sm text-muted-foreground">
                <input defaultChecked name="isPublic" type="checkbox" />
                Publish this list publicly
              </label>
              <Button type="submit">Save curated list</Button>
            </form>
          ) : (
            <EmptyState
              title="Premium beta feature"
              description="Free members can join referrals and follows. Premium adds curated lists."
            />
          )}
        </CardContent>
      </Card>

      {lists.length > 0 ? (
        <div className="grid gap-6">
          {lists.map((list) => (
            <Card className="bg-white/90" key={list.id}>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{list.title}</CardTitle>
                  <Badge variant={list.isPublic ? "default" : "outline"}>{list.isPublic ? "Public" : "Private"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{list.description}</p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>{list.createdAtLabel}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {list.items.map((item) => (
                    <div className="rounded-[24px] border bg-background p-4" key={`${list.id}-${item.therapistProfileId}`}>
                      <p className="font-medium text-foreground">{item.displayName}</p>
                      <p>{item.title}</p>
                      {item.note ? <p className="mt-2 text-sm text-muted-foreground">{item.note}</p> : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No curated lists yet"
          description="Saved lists appear here."
        />
      )}
    </div>
  );
}
