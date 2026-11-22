# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Tripdizer is a travel-planning site (bilingual English/Arabic). The repo holds several independent Node.js apps, each with its own `package.json` and `app.yaml`, deployed as separate Google App Engine (flex) services in GCP project `feisty-parity-188109`. There is no root package, no build step, no linter and no test suite.

| Dir | What it is | Entry | Default port | GAE service |
|---|---|---|---|---|
| `services/` | REST backend (Express 3 + MySQL) | `server.js` | 8080 | `tripdizer-backend` |
| `public/` | Public website (static HTML + AngularJS 1, served by a small Express app) | `server.js` | 8082 | `default` |
| `dashboard/` | Admin control center (Express + EJS + Passport, AdminLTE UI) | `server.js` | 8081 | `tripdizer-dashboard` |
| `chatting-server/` | Socket.io live-chat prototype (agent/customer), see `design.txt` | `index.js` | — | `tripdizer-online-chatting-backend` |

The root-level `main.js` is a stray socket.io chat client sample, not part of any app.

## Commands

Run from inside the app directory:

```bash
npm install
npm start            # services/, public/, chatting-server/
node server.js       # dashboard/ (no start script)
gcloud app deploy    # deploys that directory's app.yaml
```

The backend needs MySQL database `hws`. Credentials come from `services/config.json`; with `NODE_ENV: "production"` it connects via the Cloud SQL unix socket `/cloudsql/<INSTANCE_CONNECTION_NAME>`, so for local runs change `NODE_ENV` (and add `host`) in `services/hws_modules/dataaccess/hws_dao_utilities.js`. DB scripts live in `services/db_scripts/` (gitignored); import steps are in `services/Importing DB scripts.info`.

## Backend architecture (`services/hws_modules/`)

Strict three-layer pattern, one file per entity per layer, named `hws_<entity>_<layer>.js`:

- `webserver/hws_server.js` — the single place all routes are registered. Convention: `GET` read, `PUT` create, `POST` update (some entities, e.g. statuses, are inverted — check the route table). Auth middleware is applied per-route here.
- `webserver/hws_<entity>_interface.js` — Express handlers: pull args from `req`, call business, map callbacks to responses.
- `business/hws_<entity>_business.js` — often just re-exports the DAO functions; real logic lives in `requests`, `email`, `users`, `grouptrips`.
- `dataaccess/hws_<entity>_dao.js` — raw `mysql` queries; every function opens its own connection via `hws_dao_utilities.createConnection()` and must `connection.end()` on every path. Maps DB `Pascal_Case` columns to camel/snake JS objects by hand.

Callbacks, not promises: functions take `(args..., onSuccess, onFailure, onBusinessError)`; interfaces map the last two to HTTP 500.

Localization: entities store `EN_*` and `AR_*` columns; DAOs accept a `lang` query param and set `name`/`description` from the matching language.

Auth (`app/auth/index.js`): clients send `Authorization: JWT <token>`; the token is a `jwt-simple` encoding of `{username, password}` with `config.SECRET`, and each protected request re-runs `users.login`. `isAuthenticatedAsAdmin` additionally requires `user.admin`.

`app/cron/index.js` is loaded by the server and runs a daily requests-count report email. Emails are sent through `nodemailer` in `hws_email_business.js`; HTML templates/PDF attachments are in `services/` and `services/attachments/`.

## Frontends

- Both `public/` and `dashboard/static/g2g/js/` are AngularJS apps that hardcode the backend URL as `$rootScope.serverURL` at the top of each `*Application.js` (remote backend active, `localhost:8080` commented out). `dashboard/auth.js` and `public/js/google-sheets.js` hardcode it too. Switch all of these together when pointing at a local backend.
- Arabic versions are parallel copies with an `-ar` suffix (`index-ar.html`, `reservation-ar.html`, `*-ar.js`, `*-ar.css`). Changes to an English page/script usually need mirroring in its `-ar` twin.
- Note there are duplicate controller files in `public/application/` and `public/js/`; check which one the HTML page actually loads before editing.
- Dashboard: `dashboard/server.js` renders EJS pages in `views/pages/` (layout + partials) after Passport local login, which proxies to the backend's `POST /user/login` and stores the returned JWT in the session. Each page sets `res.locals.controller` to select its Angular controller. `static/` is a vendored AdminLTE template; app code is in `static/g2g/`.
