import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPostPage() {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Create a member post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
        <p>The MVP post composer can branch into three post types: referral request, consultation request, or job opening.</p>
        <p>Use a server action later to insert a base `posts` row plus the matching typed detail row.</p>
      </CardContent>
    </Card>
  );
}
