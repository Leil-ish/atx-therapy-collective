import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthGuardNote({ title, body }: { title: string; body: string }) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-muted-foreground">{body}</CardContent>
    </Card>
  );
}
