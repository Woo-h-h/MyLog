import { api } from './client'

/** Fire-and-forget page view tracking */
export function trackPageView(path: string) {
  api.post('/pageviews', { path }).catch(() => {
    /* ignore analytics errors */
  })
}
