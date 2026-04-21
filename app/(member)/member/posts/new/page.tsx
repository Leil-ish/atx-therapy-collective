import { ReferralComposeForm } from "@/components/domain/referral-compose-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getPublicTherapists } from "@/lib/data/live-data";

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
  const session = await getSession();
  const { therapists } = await getPublicTherapists(session?.userId, 250, 0);

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Send a referral</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReferralComposeForm currentUserId={session?.userId} senderEmail={session?.email} statusCopy={statusCopy} therapists={therapists} />
      </CardContent>
    </Card>
  );
}
