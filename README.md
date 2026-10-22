# puckdrop

A small web app that shows upcoming NHL games for the current week, pulled live from the NHL public schedule API.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Production

```bash
npm run build
npm start
```

`npm start` serves the built app and proxies `/nhl/*` to `https://api-web.nhle.com` (needed because the NHL API does not send CORS headers).

## Notes

- Times are displayed in **America/Toronto** (Eastern).
- Finished games are filtered out so the list stays focused on what’s next.
- Not affiliated with the National Hockey League.
