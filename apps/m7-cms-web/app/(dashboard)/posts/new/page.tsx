import { PostForm } from "@/components/posts/post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo post</h1>
        <p className="text-muted-foreground">
          Preencha os dados para criar um novo post
        </p>
      </div>
      <PostForm />
    </div>
  );
}
