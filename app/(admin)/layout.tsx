export default function AdminGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-shell="admin" className="min-h-dvh">
      {children}
    </div>
  );
}
