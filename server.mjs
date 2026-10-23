import { existsSync } from 'node:fs'
import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')
const indexHtml = path.join(dist, 'index.html')
const port = Number(process.env.PORT || 4173)
const NHL_ORIGIN = 'https://api-web.nhle.com'

if (!existsSync(indexHtml)) {
  console.error('Missing dist/index.html. From the project folder run: npm start')
  process.exit(1)
}

const app = express()

app.use('/nhl', async (req, res) => {
  const url = `${NHL_ORIGIN}${req.url}`

  try {
    const upstream = await fetch(url, {
      headers: { Accept: 'application/json' },
      redirect: 'follow',
    })
    const body = await upstream.text()
    res.status(upstream.status)
    res.set('Content-Type', upstream.headers.get('content-type') || 'application/json')
    res.send(body)
  } catch (error) {
    console.error('NHL proxy error', error)
    res.status(502).json({ error: 'Unable to reach NHL schedule API' })
  }
})

app.use(express.static(dist))
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

function listen(host) {
  const server = app.listen({ port, host, ipv6Only: false }, () => {
    console.log(`puckdrop listening on http://127.0.0.1:${port}`)
    console.log(`puckdrop listening on http://localhost:${port}`)
  })

  server.on('error', (error) => {
    if (host === '::' && ['EAFNOSUPPORT', 'EADDRNOTAVAIL', 'EINVAL'].includes(error.code)) {
      listen('0.0.0.0')
      return
    }
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the other puckdrop server, or run PORT=4174 npm start`)
      process.exit(1)
    }
    console.error(error)
    process.exit(1)
  })
}

listen('::')
