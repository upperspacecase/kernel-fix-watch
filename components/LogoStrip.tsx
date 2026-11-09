const LOGOS = [
  { name: "ubuntu.com/security", className: "font-semibold" },
  { name: "Launchpad", className: "font-bold tracking-tight" },
  { name: "USN RSS", className: "font-black uppercase tracking-widest text-[0.85em]" },
  { name: "Tenable", className: "font-extrabold tracking-tighter" },
  { name: "Trivy", className: "font-bold" },
  { name: "ma.ttias.be", className: "font-medium tracking-wide" },
  { name: "Hacker News", className: "font-black" },
];

export function LogoStrip() {
  return (
    <section aria-label="Sources admins polled by hand during CVE-2026-98432" className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-16">
      <p className="text-base text-slate-500">
        The pages and feeds ops teams were refreshing by hand for ten days during CVE-2026-98432.
      </p>
      <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4 text-xl text-slate-400 sm:text-2xl">
        {LOGOS.map((logo) => (
          <li key={logo.name} className={logo.className}>
            {logo.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
