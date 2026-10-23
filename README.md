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
npm start
```

`npm start` builds the app, then serves it at `http://127.0.0.1:4173` and `http://localhost:4173`. It also proxies `/nhl/*` to `https://api-web.nhle.com` (needed because the NHL API does not send CORS headers).

If `localhost` does not open, use `http://127.0.0.1:4173`. If that port is already taken, run `PORT=4174 npm start` and open that port instead.

## Notes

- Times are displayed in **America/Toronto** (Eastern).
- Finished games are filtered out so the list stays focused on what’s next.
- Not affiliated with the National Hockey League.
