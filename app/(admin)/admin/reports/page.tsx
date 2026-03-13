import { AdminListCard } from "@/components/domain/admin-list-card";
import { moderationReports } from "@/lib/data/mock-data";

export default function AdminReportsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {moderationReports.map((report) => (
        <AdminListCard
          body={`Reported by ${report.reporterName}. Reason: ${report.reason}.`}
          key={report.id}
          meta={`${report.createdAtLabel} · ${report.targetType} · ${report.status}`}
          title="Moderation report"
        />
      ))}
    </div>
  );
}
