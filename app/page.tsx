export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/65">
        Next.js rewrite
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-normal text-brand sm:text-5xl">
        Clinic Ranking
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/75">
        Baseline scaffold for the App Router migration. Feature routes, backend
        proxying, and migrated German UX copy will land in follow-up tasks.
      </p>
      <div className="mt-10 h-2 w-32 rounded-full bg-accent" />
    </main>
  );
}
