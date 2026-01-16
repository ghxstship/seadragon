export interface ApiOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined>
}

import { URLS } from '../constants/config'

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(path, typeof window !== 'undefined' ? window.location.origin : URLS.DEVELOPMENT)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value))
    })
  }
  return url.toString()
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { query, headers, ...rest } = options
  const url = buildUrl(path, query)
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string> | undefined),
    },
    ...rest,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${res.statusText} ${text}`)
  }

  return res.json() as Promise<T>
}
