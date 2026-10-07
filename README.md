# Aarambh — Education Companion

Mathematics learning prototype for Classes 1–10, with a discovery feed, interactive puzzles, teacher feedback, curriculum guides, missions and rewards.

## Upload to GitHub

Extract this ZIP, open the `aarambh` folder, and upload its contents to the root of your GitHub repository. Include hidden configuration files, especially `.openai/hosting.json`. The ZIP contains source code, not installed dependencies or learner data.

## Development

Requires Node.js 22.13 or newer and pnpm (the exact version is in package.json).

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm build
```

Apply each SQL migration in `drizzle/`, in filename order, once to your local database. For each SQL file use:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/FILE.sql
```

Replace FILE.sql with the actual filename. Then run `pnpm dev` and open the local URL printed in the terminal. On a normal local environment the starter uses its portable profile, including local mock sign-in. See STARTER_REFERENCE.md for its sign-in route and runtime details.

## Project layout

- app/: interfaces and API endpoints
- lib/: curriculum, question generation, evidence and reward logic
- db/ and drizzle/: database schema and SQL migrations
- public/: assets and data-preparation starter package
- build/ and scripts/: runtime and build integration (required source, not generated output)

## Hosting

GitHub stores this repository; GitHub Pages cannot run this full-stack application. The existing deployment uses Cloudflare Workers/D1 through ChatGPT Sites. Hosting elsewhere requires configuring a database and trusted authentication integration. Production currently expects identity supplied by the Sites gateway; do not expose an unprotected endpoint that trusts caller-supplied identity headers.

The original Site binding is retained in `.openai/hosting.json` for continuity. This file contains configuration, not a secret. No credentials, live learner records, node_modules or local database state are included.

## Prototype boundaries

The companion adapts through saved evidence and recommendation rules; it does not retrain an AI model. Curriculum content and grade placement require educator review. Sparks, badges and adventure chapters measure activity, not mastery. Separate production child/teacher account roles remain future work.
