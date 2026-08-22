export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-3xl font-medium tracking-tight">Portfolio News Monitor</h1>
      <p className="mt-2 max-w-md text-sm text-[#5B6576]">
        Schritt 1 erledigt: Next.js, TypeScript, Tailwind und die Google Fonts laufen. Als Nächstes bauen wir das
        Datenmodell und den Portfolio-Import.
      </p>
      <button className="btn-primary mt-8 text-[15px]">Setup erfolgreich ✓</button>
    </main>
  );
}
