export const metadata = {
  title: "Partners | Laqta",
};

export default function PartnersPage() {
  return (
    <section className="space-y-3xl">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary-600 animate-slide-up" style={{ opacity: 0 }}>Our Partners</h1>
        <p className="mt-sm text-neutral-600 max-w-2xl mx-auto animate-fade-in" style={{ opacity: 0, animationDelay: "150ms" }}>
          We collaborate with industry-leading partners to deliver top-notch solutions.
        </p>
      </header>
      <div className="grid gap-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg bg-white shadow p-lg flex items-center justify-center h-24">
            <span className="text-neutral-400">Logo #{i + 1}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
