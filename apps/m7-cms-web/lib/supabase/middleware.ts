import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/** Routes that don't require authentication */
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/auth"];

/** Routes that don't require a tenant to be selected */
const TENANT_EXEMPT_ROUTES = [
  ...PUBLIC_ROUTES,
  "/select-tenant",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isTenantExemptRoute(pathname: string): boolean {
  return TENANT_EXEMPT_ROUTES.some((route) => pathname.startsWith(route));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Unauthenticated users are redirected to /login (except public routes)
  if (!user && !isPublicRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Authenticated users visiting /login are redirected to /dashboard
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 3. Authenticated users without a tenant cookie are redirected to /select-tenant
  //    (except tenant-exempt routes). The AuthProvider + TenantSelector handle this
  //    on the client side, but the middleware provides a server-side fallback.
  if (user && !isTenantExemptRoute(pathname)) {
    const tenantId = request.cookies.get("m7_tenant_id")?.value;
    if (!tenantId) {
      const url = request.nextUrl.clone();
      url.pathname = "/select-tenant";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
