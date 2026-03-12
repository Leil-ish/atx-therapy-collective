import type { MembershipState, UserRole } from "@/types";

export interface ViewerContext {
  role: UserRole;
  membershipState?: MembershipState;
}

export function isActiveTherapist(viewer: ViewerContext) {
  return viewer.role === "therapist" && viewer.membershipState === "active";
}

export function isAdmin(viewer: ViewerContext) {
  return viewer.role === "admin";
}

export function canAccessMemberArea(viewer: ViewerContext) {
  return isActiveTherapist(viewer) || isAdmin(viewer);
}
