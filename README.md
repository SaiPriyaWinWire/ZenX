# ZenX Base Template

Starter Node.js/Express application for an AI-powered TQA review management system. It ships with a reusable layout, shared CSS/JS helpers, session-backed authentication, and time-based MFA enforcement so teams can build on it quickly.

## Features

- Express + EJS with a centralized layout and asset helpers for CSS/JS injection
- Pre-styled UI components inspired by the WinBuild TQA dashboard
- Passwordless email login (MFA disabled by request)
- Flash messaging, session handling, and basic logging utilities
- .env-powered configuration with an initial seed account

## Getting Started

1. Install dependencies

	```bash
	npm install
	```

2. Copy the sample environment file and adjust values

	```bash
	cp .env.example .env
	```

	- `SESSION_SECRET` must be a long random string.
	- Update the seed user credentials (`PRIMARY_USER_*`) to match your first account.

3. Launch the dev server

	```bash
	npm run dev
	```

	Visit http://localhost:3000 and sign in with the seed user. Complete the MFA step with the TOTP secret you set (the default example secret works with Google Authenticator or similar apps).

## Project Layout

- Server entry point: [src/app.js](src/app.js)
- Configuration loader: [src/config/index.js](src/config/index.js)
- Authentication flow: [src/controllers/authController.js](src/controllers/authController.js)
- MFA helpers: [src/services/mfaService.js](src/services/mfaService.js)
- Shared styling assets: [public/css/main.css](public/css/main.css)
- Views and layout: [views](views)

## Next Steps

- Replace the in-memory user store with your database of choice.
- Add rate limiting, CSRF protection, and production-grade logging.
- Extend the dashboard modules or wire the UI to real AI-driven risk analysis services.
