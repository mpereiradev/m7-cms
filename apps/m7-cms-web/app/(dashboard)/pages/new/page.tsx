import { PageForm } from "@/components/pages/page-form";

export default function NewPagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova pagina</h1>
        <p className="text-muted-foreground">
          Preencha os dados para criar uma nova pagina
        </p>
      </div>
      <PageForm />
    </div>
  );
}
