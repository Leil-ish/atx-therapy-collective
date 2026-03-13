import { GroupCard } from "@/components/domain/group-card";
import { memberGroups } from "@/lib/data/mock-data";

export default function MemberGroupsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {memberGroups.map((group) => (
        <GroupCard group={group} key={group.id} memberView />
      ))}
    </div>
  );
}
