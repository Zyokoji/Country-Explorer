import { useState, useEffect } from 'react'

const PAGE_SIZE = 100 // free plan max per request

// Custom hook: fetches every page from the REST Countries v5 API
// and tracks loading / error state.
export function useFetch(url, apiKey) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      if (!url || !apiKey) {
        setError('VITE_API_URL or VITE_API_KEY is missing in .env. Add them and restart the dev server.')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const all = []
        let offset = 0
        let more = true

        // The API returns results in pages, so keep asking until "more" is false.
        while (more) {
          const res = await fetch(`${url}?limit=${PAGE_SIZE}&offset=${offset}`, {
            headers: { Authorization: `Bearer ${apiKey}` },
            signal: controller.signal,
          })
          const json = await res.json()
          if (!res.ok) {
            throw new Error(json.errors?.[0]?.message ?? `Request failed (status ${res.status})`)
          }
          all.push(...json.data.objects)
          more = json.data.meta.more
          offset += PAGE_SIZE
        }

        setData(all)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort() // cancel if the component unmounts
  }, [url, apiKey, reloadKey])

  const refetch = () => setReloadKey((k) => k + 1)

  return { data, loading, error, refetch }
}
