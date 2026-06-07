export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden">
      {children}
    </div>
  );
}
