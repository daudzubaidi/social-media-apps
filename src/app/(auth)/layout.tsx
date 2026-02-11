export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-950">
      {/* Purple gradient blobs — bottom */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary-200/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-primary-300/15 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-display-xs font-bold text-primary">Sociality</h1>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-lg md:border-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}
