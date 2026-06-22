export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative / branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-muted">
        <div className="text-center space-y-4 px-8">
          <h1 className="text-4xl font-bold tracking-tight">M7 CMS</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Gerencie seus sites com facilidade. Plataforma multi-site moderna e
            intuitiva.
          </p>
        </div>
      </div>
      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
