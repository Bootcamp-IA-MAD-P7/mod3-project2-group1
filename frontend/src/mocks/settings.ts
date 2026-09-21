export type SettingsRole = "Administrator" | "Moderator"

export type SettingsUserStatus = "Active" | "Invited" | "Pending"

export interface SettingsUser {
  id: string
  name: string
  email: string
  role: SettingsRole
  status: SettingsUserStatus
}

/** Example-only data for the Settings page. Not persisted and not fetched from an API. */
export const SETTINGS_USERS: SettingsUser[] = [
  { id: "u1", name: "María López", email: "maria.lopez@civika.app", role: "Administrator", status: "Active" },
  { id: "u2", name: "Víctor García", email: "victor.garcia@civika.app", role: "Administrator", status: "Active" },
  { id: "u3", name: "Naimireth Díaz", email: "naimireth.diaz@civika.app", role: "Moderator", status: "Active" },
  { id: "u4", name: "Veru Sanz", email: "veru.sanz@civika.app", role: "Moderator", status: "Invited" },
  { id: "u5", name: "Andrea Soto", email: "andrea.soto@civika.app", role: "Moderator", status: "Pending" },
]

export const ROLE_PERMISSIONS: Record<SettingsRole, string[]> = {
  Administrator: [
    "Dashboard",
    "Analyze Conversation",
    "Analyze Comment",
    "Analyze Content",
    "History",
    "Laboratory",
    "Settings",
    "User Management",
  ],
  Moderator: ["Dashboard", "Analyze Conversation", "Analyze Comment", "Analyze Content", "History"],
}