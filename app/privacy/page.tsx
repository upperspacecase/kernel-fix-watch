import Link from "next/link";

export default function Privacy() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Privacy</h1>
      <div className="mt-6 space-y-4 text-base text-slate-600">
        <p>We store the email address, Ubuntu release and kernel flavor you submit, and the time you submitted them. Nothing else is collected.</p>
        <p>That data is used for one purpose: to email you when a fixed kernel for the release and flavor you chose reaches -proposed or -updates. It is not sold or shared.</p>
        <p>Reply to any email we send to have your record deleted.</p>
      </div>
      <Link href="/" className="mt-10 inline-block cursor-pointer text-base text-slate-600 underline transition-colors duration-200 hover:text-slate-900">
        Back
      </Link>
    </main>
  );
}
