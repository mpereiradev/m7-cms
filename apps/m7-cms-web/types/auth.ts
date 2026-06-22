export type Role = "super_admin" | "admin" | "editor" | "author" | "viewer";

export type UserContext = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: Role;
  tenantId: string | null;
  tenants: TenantInfo[];
};

export type TenantInfo = {
  id: string;
  name: string;
  slug: string;
  role: Role;
};

export type AuthState = {
  user: UserContext | null;
  tenantId: string | null;
  role: Role | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  setTenantId: (tenantId: string) => void;
};
