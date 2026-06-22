"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      const supabase = createClient();
      await supabase.auth.signOut();

      document.cookie = "m7_tenant_id=; path=/; max-age=0";
      localStorage.removeItem("tenant_id");

      router.replace("/login");
    }

    logout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground">Saindo...</p>
    </div>
  );
}
