"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FLAVORS, FLAVOR_LABELS, RELEASES, type Flavor, type Release } from "@/lib/kernels";

function releaseFromParam(value: string | null): Release | null {
  return (RELEASES as readonly string[]).includes(value ?? "") ? (value as Release) : null;
}

function flavorFromParam(value: string | null): Flavor | null {
  const cleaned = (value ?? "").replace(/^linux-/, "").toLowerCase();
  return (FLAVORS as readonly string[]).includes(cleaned) ? (cleaned as Flavor) : null;
}

const chipClass = (active: boolean) =>
  `cursor-pointer rounded-full border px-4 py-1.5 text-base font-medium transition-colors duration-200 ${
    active
      ? "border-slate-900 bg-slate-900 text-white"
      : "border-slate-300 bg-white/70 text-slate-700 hover:border-slate-500"
  }`;

export function SignupForm() {
  const params = useSearchParams();
  const [release, setRelease] = useState<Release | null>(() => releaseFromParam(params.get("release")));
  const [flavor, setFlavor] = useState<Flavor | null>(() => flavorFromParam(params.get("flavor")));
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const rowChosen = release !== null && flavor !== null;
  const rowLabel = rowChosen ? `${release} / ${FLAVOR_LABELS[flavor]}` : "";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!rowChosen) return;
    setState("sending");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, release, flavor }),
    });
    if (!res.ok) {
      setState("error");
      return;
    }
    localStorage.setItem("kernel_fix_watch_signup", JSON.stringify({ email, release, flavor }));
    setState("done");
  }

  if (state === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-[0_8px_32px_rgba(30,41,59,0.08)] backdrop-blur-xl"
      >
        <p className="text-base font-semibold">You are watching {rowLabel}.</p>
        <p className="mt-1 text-base text-slate-600">
          We will email {email} the hour a fixed kernel for {rowLabel} lands in -proposed, again when it reaches -updates with the exact version string, and then tell you that you can remove your stopgap.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/40 bg-white/60 p-4 shadow-[0_8px_32px_rgba(30,41,59,0.08)] backdrop-blur-xl sm:p-5"
    >
      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-2 text-base text-slate-600">Which Ubuntu release is your fleet on?</legend>
        {RELEASES.map((r) => (
          <button key={r} type="button" aria-pressed={r === release} onClick={() => setRelease(r)} className={chipClass(r === release)}>
            {r} LTS
          </button>
        ))}
      </fieldset>

      <fieldset className="mt-4 flex flex-wrap gap-2">
        <legend className="mb-2 text-base text-slate-600">Which kernel flavor does uname -r show?</legend>
        {FLAVORS.map((f) => (
          <button key={f} type="button" aria-pressed={f === flavor} onClick={() => setFlavor(f)} className={chipClass(f === flavor)}>
            {FLAVOR_LABELS[f]}
          </button>
        ))}
      </fieldset>

      {rowChosen ? (
        <div className="mt-5 rounded-xl border border-slate-900/10 bg-white/80 p-3">
          <p className="text-base text-slate-600">
            Your row: <span className="font-semibold text-slate-900">{rowLabel}</span>
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder:text-slate-400 sm:flex-1"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="h-12 cursor-pointer rounded-xl bg-accent px-5 text-base font-semibold text-slate-900 transition-colors duration-200 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
            >
              {state === "sending" ? (
                "Saving"
              ) : (
                <>
                  Alert me when {rowLabel} flips to <span className="whitespace-nowrap">-updates</span>
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-base text-slate-500">
            Two emails: the hour it lands in -proposed, and the hour you can reboot and remove your mitigation. No agent, no root, nothing to install.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-base text-slate-500">Pick a release and a flavor to claim your row. The alert is tied to that exact row.</p>
      )}

      {state === "error" && (
        <p role="alert" className="mt-3 text-base text-red-700">
          That did not save. Check the email address and try again.
        </p>
      )}
    </form>
  );
}
