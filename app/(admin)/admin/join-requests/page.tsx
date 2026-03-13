import { AdminListCard } from "@/components/domain/admin-list-card";
import { pendingJoinRequests } from "@/lib/data/mock-data";

export default function AdminJoinRequestsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {pendingJoinRequests.map((request) => (
        <AdminListCard
          body={`${request.credentials} applying in ${request.marketName}. Sponsored by ${request.sponsorName}.`}
          key={request.id}
          meta={`${request.createdAtLabel} · ${request.status}`}
          title={request.fullName}
        />
      ))}
    </div>
  );
}
