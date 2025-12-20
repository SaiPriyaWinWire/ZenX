# ZenX Base Template

Starter Node.js/Express application for an AI-powered TQA review management system. It ships with a reusable layout, shared CSS/JS helpers, session-backed authentication, and time-based MFA enforcement so teams can build on it quickly.

## Features

- Express + EJS with a centralized layout and asset helpers for CSS/JS injection
- Pre-styled UI components inspired by the WinBuild TQA dashboard
- Passwordless email login (MFA disabled by request)
- Flash messaging, session handling, and basic logging utilities
- .env-powered configuration with an initial seed account

## Getting Started

# ZenX

This repository contains the ZenX base template (a Node.js/Express starter app)
and a small demo webapp for the AI-powered TQA Review Management dashboard.

This README covers both the base template and the demo so contributors can run
the demo quickly and also understand the intended larger project layout.

## Overview

- The **Base Template** provides an Express + EJS application scaffold with
	session-backed authentication, TOTP MFA helpers, and an asset pipeline.
- The **Demo Webapp** is a minimal Node/Express static server that implements a
	simplified TQA dashboard UI (used for quick design iteration and testing).

## Getting Started

1. Install dependencies

		```powershell
		npm install
		```

2. Copy the sample environment and adjust values (for the base template)

		```powershell
		cp .env.example .env
		```

		- `SESSION_SECRET` must be a long random string.
		- Update any `PRIMARY_USER_*` seed credentials if you plan to use the base
			template's auth flow.

3. Run the demo webapp (quick)

		```powershell
		# starts the demo server which serves the static dashboard at :3000
		npm start
		```

		Open http://localhost:3000 to view the demo dashboard.

4. Run the base-template app (development)

		```powershell
		npm run dev
		```

		The base template application uses `src/app.js` as the entry point and may
		require additional env settings from `.env` to enable auth and MFA flows.

## Files Added / Demo Notes

- `server.js` — demo Express server and `/api/dashboard` endpoint (demo data)
- `public/index.html` — demo frontend markup
- `public/styles.css` — demo styling
- `public/main.js` — demo client-side data wiring

The demo is intentionally small and self-contained. Use it to prototype UI
changes; when ready, port components or API wiring into the base-template code
under `src/`.

## Project Layout (Base Template)

- Server entry point: `src/app.js`
- Configuration loader: `src/config/index.js`
- Authentication flow: `src/controllers/authController.js`
- MFA helpers: `src/services/mfaService.js`
- Shared styling assets: `public/css/main.css`
- Views and layout: `views`

## Recommendations

- Add a `.gitignore` ignoring `node_modules/` (if not present) and remove
	committed `node_modules` from the repo to keep history clean.
- Regenerate `package-lock.json` after finalizing `package.json` by running

		```powershell
		npm install
		```

## License

MIT
