# kernel_fix_watch

Hypothesis-testing landing page: a public per-CVE tracker that shows, per Ubuntu release and exact kernel flavor, whether a fixed kernel is in -proposed or -updates, with an alert when your row flips.

## Run

```
npm install
npm run dev
```

Deep links preselect the row: `/?release=22.04&flavor=aws`. Flavors: generic, hwe, aws, azure, gcp, nvidia, lowlatency.

## Sign-ups

`POST /api/subscribe` requires `email`, `release` and `flavor`, and logs each sign-up as a JSON line (`event: "signup"`) to the server log, which Vercel keeps under the deployment's Logs tab. Set `SIGNUP_WEBHOOK_URL` to also forward each sign-up as JSON to a webhook.

## Demo video

The demo is a Remotion composition in `remotion/Demo.tsx`, embedded with `@remotion/player`. Preview it standalone with:

```
npx remotion studio remotion/index.ts
```
