export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative text-center space-y-4 px-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              M7
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">M7 CMS</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Gerencie seus sites com facilidade. Plataforma multi-site moderna e
            intuitiva.
          </p>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-card">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
