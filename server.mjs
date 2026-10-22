import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')
const port = Number(process.env.PORT || 4173)
const NHL_ORIGIN = 'https://api-web.nhle.com'

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

app.listen(port, () => {
  console.log(`puckdrop listening on http://localhost:${port}`)
})
