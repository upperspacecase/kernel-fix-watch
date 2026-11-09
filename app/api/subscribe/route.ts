import { FLAVORS, RELEASES, type Flavor, type Release } from "@/lib/kernels";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: unknown; release?: unknown; flavor?: unknown };
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const release = body.release as Release;
  const flavor = body.flavor as Flavor;

  if (!email.includes("@") || !RELEASES.includes(release) || !FLAVORS.includes(flavor)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const record = { event: "signup", email, release, flavor, at: new Date().toISOString() };
  console.log(JSON.stringify(record));

  const webhook = process.env.SIGNUP_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
    });
  }

  return Response.json({ ok: true });
}
