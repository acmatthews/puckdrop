import type { ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function nhlProxy(): ProxyOptions {
  return {
    target: 'https://api-web.nhle.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/nhl/, ''),
    configure: (proxy) => {
      proxy.on('proxyRes', (proxyRes) => {
        const location = proxyRes.headers.location
        if (typeof location !== 'string' || location.length === 0) return
        try {
          const url = new URL(location, 'https://api-web.nhle.com')
          if (url.hostname === 'api-web.nhle.com') {
            proxyRes.headers.location = `/nhl${url.pathname}${url.search}`
          }
        } catch {
          // Leave a malformed Location header untouched.
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/nhl': nhlProxy(),
    },
  },
  preview: {
    proxy: {
      '/nhl': nhlProxy(),
    },
  },
})
