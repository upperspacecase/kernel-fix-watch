import Link from "next/link";
import { ASK_HN_THREAD, MATTIAS_TABLE } from "@/lib/kernels";

const linkClass = "cursor-pointer text-base text-slate-600 transition-colors duration-200 hover:text-slate-900";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl border-t border-slate-200 px-6 py-8">
      <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
        <Link href="/privacy" className={linkClass}>
          Privacy
        </Link>
        <Link href="/terms" className={linkClass}>
          Terms
        </Link>
        <a href={ASK_HN_THREAD} className={linkClass} target="_blank" rel="noreferrer">
          Ask HN thread
        </a>
        <a href={MATTIAS_TABLE} className={linkClass} target="_blank" rel="noreferrer">
          Hand-built table at ma.ttias.be
        </a>
      </nav>
    </footer>
  );
}
