"use client";

import { StoreForm } from "@/components/stores/store-form";

export default function NewStorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova Loja</h1>
        <p className="text-muted-foreground">
          Cadastre uma nova loja ou filial.
        </p>
      </div>
      <StoreForm />
    </div>
  );
}
