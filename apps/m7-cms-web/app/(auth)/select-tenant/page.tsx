import type { Metadata } from "next";
import { SelectTenantContent } from "./select-tenant-content";

export const metadata: Metadata = {
  title: "Selecionar site | M7 CMS",
  description: "Selecione o site que deseja gerenciar",
};

export default function SelectTenantPage() {
  return <SelectTenantContent />;
}
