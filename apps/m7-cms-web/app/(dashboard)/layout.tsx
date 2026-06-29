"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  FolderTree,
  Tags,
  Image,
  GalleryHorizontalEnd,
  Share2,
  RectangleHorizontal,
  Store,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
  ChevronsUpDown,
  Globe,
} from "lucide-react";

import { useAuth } from "@/lib/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
};

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Paginas", href: "/pages", icon: FileText },
  { title: "Posts", href: "/posts", icon: Newspaper },
  { title: "Categorias", href: "/categories", icon: FolderTree },
  { title: "Tags", href: "/tags", icon: Tags },
];

const mediaNavItems: NavItem[] = [
  { title: "Midias", href: "/media", icon: Image },
  { title: "Galerias", href: "/galleries", icon: GalleryHorizontalEnd },
];

const contentNavItems: NavItem[] = [
  { title: "Social", href: "/social", icon: Share2 },
  { title: "Banners", href: "/banners", icon: RectangleHorizontal },
  { title: "Lojas", href: "/stores", icon: Store },
  { title: "Contato", href: "/contact-submissions", icon: MessageSquare },
];

const adminNavItems: NavItem[] = [
  { title: "Usuarios", href: "/users", icon: Users },
  { title: "Configuracoes", href: "/settings", icon: Settings },
];

const superAdminNavItems: NavItem[] = [
  {
    title: "Sites",
    href: "/tenants",
    icon: Globe,
    roles: ["super_admin"],
  },
];

function NavGroup({
  label,
  items,
  pathname,
  role,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  role: string | null;
}) {
  const visible = items.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );
  if (visible.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visible.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function DashboardSidebar() {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  M7
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">M7 CMS</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Principal" items={mainNavItems} pathname={pathname} role={role} />
        <NavGroup label="Midia" items={mediaNavItems} pathname={pathname} role={role} />
        <NavGroup label="Conteudo" items={contentNavItems} pathname={pathname} role={role} />
        <NavGroup label="Admin" items={adminNavItems} pathname={pathname} role={role} />
        {role === "super_admin" && (
          <NavGroup label="Super Admin" items={superAdminNavItems} pathname={pathname} role={role} />
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

function TenantSwitcher() {
  const { user, tenantId, setTenantId, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-8 w-40 rounded-md" />;
  }

  if (!user || user.tenants.length === 0) return null;

  const currentTenant = user.tenants.find((t) => t.id === tenantId);

  function handleSwitch(id: string) {
    setTenantId(id);
    window.location.href = "/dashboard";
  }

  if (user.tenants.length === 1) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="truncate max-w-[160px]">{currentTenant?.name ?? user.tenants[0].name}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 max-w-[200px]">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{currentTenant?.name ?? "Selecionar site"}</span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Trocar site</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.tenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onClick={() => handleSwitch(tenant.id)}
            className={tenant.id === tenantId ? "bg-accent" : ""}
          >
            <Building2 className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">{tenant.name}</span>
              <span className="text-xs text-muted-foreground">{tenant.slug}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium truncate">{user?.fullName ?? "Usuario"}</span>
            <span className="text-xs font-normal text-muted-foreground truncate">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopBar() {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
    }));
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <nav className="flex items-center gap-1 text-sm text-muted-foreground flex-1">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-3 w-3" />}
            {crumb.isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <TenantSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <TopBar />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
