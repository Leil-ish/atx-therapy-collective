import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminListCard({
  title,
  meta,
  body
}: {
  title: string;
  meta: string;
  body: string;
}) {
  return (
    <Card className="bg-white/90">
      <CardHeader className="space-y-2">
        <p className="text-sm text-muted-foreground">{meta}</p>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-muted-foreground">{body}</CardContent>
    </Card>
  );
}
