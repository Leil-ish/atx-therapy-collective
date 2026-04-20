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
        <CardTitle>Send a referral through the network</CardTitle>
      </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-7 text-muted-foreground">
            High-signal posts are easier to scan and easier to answer.
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
          Strong referral posts usually cover age, concerns, care format, payment, and any fit factors that matter.
        </div>
      </CardContent>
    </Card>
  );
}
