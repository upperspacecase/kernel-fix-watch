import Link from "next/link";

export default function Terms() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Terms</h1>
      <div className="mt-6 space-y-4 text-base text-slate-600">
        <p>kernel_fix_watch is an early prototype offered as-is. Status is read from Ubuntu&apos;s public Launchpad publishing history and apt archive indexes; we do not interpret or guarantee it.</p>
        <p>Alerts may be late or missed. You remain responsible for your own patching decisions and for verifying any kernel version on your hosts before removing a mitigation.</p>
        <p>You can stop alerts at any time by replying to any email we send.</p>
      </div>
      <Link href="/" className="mt-10 inline-block cursor-pointer text-base text-slate-600 underline transition-colors duration-200 hover:text-slate-900">
        Back
      </Link>
    </main>
  );
}
