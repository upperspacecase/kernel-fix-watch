import { Suspense } from "react";
import { DemoPlayer } from "@/components/DemoPlayer";
import { Footer } from "@/components/Footer";
import { LogoStrip } from "@/components/LogoStrip";
import { SignupForm } from "@/components/SignupForm";
import { ASK_HN_THREAD } from "@/lib/kernels";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 10%, rgba(148,163,184,0.22) 0%, rgba(148,163,184,0) 70%), radial-gradient(50% 45% at 90% 80%, rgba(203,213,225,0.35) 0%, rgba(203,213,225,0) 70%)",
          }}
        />
        <div className="mx-auto w-full max-w-5xl px-6 pb-12 pt-20 sm:pt-28">
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Know when the fixed kernel for your exact Ubuntu flavor hits <span className="whitespace-nowrap">-proposed</span> or <span className="whitespace-nowrap">-updates</span>, read from the archive, not the CVE page that lagged it by 10 days.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            For the one-to-three-person ops team patching an Ubuntu LTS fleet without a Canonical contract: stop polling Launchpad and apt every morning, get one alert, reboot, and pull the stopgap.
          </p>
          <div className="mt-8 max-w-2xl">
            <Suspense fallback={null}>
              <SignupForm />
            </Suspense>
          </div>
        </div>
      </section>

      <section aria-label="Product demo" className="mx-auto w-full max-w-5xl px-6 pb-6 pt-4">
        <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-2 shadow-[0_8px_32px_rgba(30,41,59,0.10)] backdrop-blur-xl">
          <div className="overflow-hidden rounded-xl">
            <Suspense fallback={<div style={{ aspectRatio: "1280 / 720" }} />}>
              <DemoPlayer />
            </Suspense>
          </div>
        </div>
        <p className="mt-3 text-base text-slate-500">
          Simulation. Version strings and timestamps in the demo are illustrative. On CVE-2026-98432 the fixed kernel sat in the archive about ten days before the USN went out, per the{" "}
          <a href={ASK_HN_THREAD} className="cursor-pointer underline transition-colors duration-200 hover:text-slate-900" target="_blank" rel="noreferrer">
            Ask HN thread
          </a>
          .
        </p>
      </section>

      <LogoStrip />
      <Footer />
    </main>
  );
}
