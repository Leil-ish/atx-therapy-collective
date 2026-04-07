import { createMemberPost } from "@/app-actions/member-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getStatusCopy(error?: string) {
  if (error === "missing-fields") {
    return "Please add both a title and post body.";
  }

  if (error === "save-failed") {
    return "We couldn't save that post. Please try again.";
  }

  return null;
}

export default async function NewPostPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const statusCopy = getStatusCopy(params?.error);

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Send a referral through the collective</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-7 text-muted-foreground">
          Keep posts high-signal and quick to scan. The goal is to help another therapist make a confident decision without needing a giant intake form or a long back-and-forth thread.
        </p>
        {statusCopy ? <div className="rounded-[24px] border bg-background p-4 text-sm leading-7 text-muted-foreground">{statusCopy}</div> : null}
        <form action={createMemberPost} className="space-y-4">
          <select className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" defaultValue="referral_request" name="type">
            <option value="referral_request">Referral request</option>
            <option value="consultation_request">Consultation request</option>
            <option value="job">Job opening</option>
          </select>
          <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="title" placeholder="Title" />
          <input className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" name="insurance" placeholder="Insurance notes" />
          <input
            className="w-full rounded-2xl border bg-background px-4 py-3 text-sm"
            name="style"
            placeholder="Therapist style preferences or relational fit"
          />
          <textarea
            className="min-h-40 w-full rounded-2xl border bg-background px-4 py-3 text-sm"
            name="body"
            placeholder="Write the post body, including age, presenting concerns, care format, payment notes, and any urgency."
          />
          <Button type="submit">Publish post</Button>
        </form>
        <div className="rounded-[24px] border bg-background p-4 text-sm leading-7 text-muted-foreground">
          A strong referral request usually covers: who the referral is for, presenting concerns, preferred location or telehealth, payment/insurance considerations, and any especially important fit factors.
        </div>
      </CardContent>
    </Card>
  );
}
