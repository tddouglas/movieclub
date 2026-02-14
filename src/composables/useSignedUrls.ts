import { supabase } from '@/database/supabaseClient'

interface CachedSignedUrl {
  signedUrl: string
  expiresAt: number
}

// Module-level cache for signed URLs
const signedUrlCache = new Map<string, CachedSignedUrl>()

// Cache expiry: 1 hour (in seconds for Supabase API)
const CACHE_EXPIRY_SECONDS = 3600
// Refresh 5 minutes before expiration (in milliseconds)
const REFRESH_BUFFER_MS = 5 * 60 * 1000

/**
 * Parse an authenticated Supabase storage URL to extract bucket and path
 * Expected format: https://<project>.supabase.co/storage/v1/object/authenticated/<bucket>/<path>
 */
function parseAuthenticatedUrl(url: string): { bucket: string; path: string } | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/authenticated\/([^/]+)\/(.+)/)
    if (pathMatch) {
      return {
        bucket: pathMatch[1],
        path: pathMatch[2]
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Check if a cached URL is still valid (not expired or about to expire)
 */
function isCacheValid(cached: CachedSignedUrl): boolean {
  return Date.now() < cached.expiresAt - REFRESH_BUFFER_MS
}

/**
 * Get a signed URL for a single authenticated storage URL
 * Uses cache to minimize API calls
 */
export async function getSignedUrl(url: string): Promise<string> {
  // Check cache first
  const cached = signedUrlCache.get(url)
  if (cached && isCacheValid(cached)) {
    return cached.signedUrl
  }

  // Parse the URL to get bucket and path
  const parsed = parseAuthenticatedUrl(url)
  if (!parsed) {
    console.warn('Could not parse authenticated URL:', url)
    return url // Return original URL as fallback
  }

  try {
    const { data, error } = await supabase.storage
      .from(parsed.bucket)
      .createSignedUrl(parsed.path, CACHE_EXPIRY_SECONDS)

    if (error) {
      console.error('Error creating signed URL:', error)
      return url // Return original URL as fallback
    }

    if (data?.signedUrl) {
      // Cache the result
      signedUrlCache.set(url, {
        signedUrl: data.signedUrl,
        expiresAt: Date.now() + CACHE_EXPIRY_SECONDS * 1000
      })
      return data.signedUrl
    }

    return url
  } catch (err) {
    console.error('Error creating signed URL:', err)
    return url // Return original URL as fallback
  }
}

/**
 * Get signed URLs for multiple authenticated storage URLs
 * Groups by bucket for efficient batch signing
 * Returns a Map of original URL -> signed URL
 */
export async function getSignedUrls(urls: string[]): Promise<Map<string, string>> {
  const result = new Map<string, string>()

  // Group URLs by bucket, filtering out cached ones
  const bucketGroups = new Map<string, { originalUrl: string; path: string }[]>()

  for (const url of urls) {
    // Check cache first
    const cached = signedUrlCache.get(url)
    if (cached && isCacheValid(cached)) {
      result.set(url, cached.signedUrl)
      continue
    }

    const parsed = parseAuthenticatedUrl(url)
    if (!parsed) {
      result.set(url, url) // Use original as fallback
      continue
    }

    const group = bucketGroups.get(parsed.bucket) || []
    group.push({ originalUrl: url, path: parsed.path })
    bucketGroups.set(parsed.bucket, group)
  }

  // Process each bucket group
  for (const [bucket, items] of bucketGroups) {
    try {
      const paths = items.map(item => item.path)
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrls(paths, CACHE_EXPIRY_SECONDS)

      if (error) {
        console.error(`Error creating signed URLs for bucket ${bucket}:`, error)
        // Use original URLs as fallback
        items.forEach(item => result.set(item.originalUrl, item.originalUrl))
        continue
      }

      if (data) {
        data.forEach((signedUrlData, index) => {
          const item = items[index]
          if (signedUrlData.signedUrl) {
            // Cache the result
            signedUrlCache.set(item.originalUrl, {
              signedUrl: signedUrlData.signedUrl,
              expiresAt: Date.now() + CACHE_EXPIRY_SECONDS * 1000
            })
            result.set(item.originalUrl, signedUrlData.signedUrl)
          } else {
            result.set(item.originalUrl, item.originalUrl)
          }
        })
      }
    } catch (err) {
      console.error(`Error creating signed URLs for bucket ${bucket}:`, err)
      items.forEach(item => result.set(item.originalUrl, item.originalUrl))
    }
  }

  return result
}

/**
 * Clear the signed URL cache (call on logout)
 */
export function clearSignedUrlCache(): void {
  signedUrlCache.clear()
}
