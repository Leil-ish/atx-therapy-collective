import { createMemberPost } from "@/app-actions/member-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPostPage() {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Create a member post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-7 text-muted-foreground">
          Keep referral posts high-signal and quick to scan. The goal is to help another therapist make a confident decision without needing a giant intake form.
        </p>
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
            placeholder="Write the post body, including age, presenting concerns, care format, and any urgency."
          />
          <Button type="submit">Save placeholder draft</Button>
        </form>
      </CardContent>
    </Card>
  );
}
