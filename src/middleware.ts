import { Region } from "@medusajs/medusa"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, Region>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        next: {
          revalidate: 3600,
          tags: ["regions"],
        },
      })
      
      const { regions } = await response.json()

      if (!regions) {
        return new Map()
      }

      regionMapCache.regionMap.clear()
      regions.forEach((region: Region) => {
        region.countries.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2, region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      console.error("Error fetching regions:", error)
      return new Map()
    }
  }

  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, Region | number>
) {
  try {
    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      return vercelCountryCode
    }

    return DEFAULT_REGION
  } catch (error) {
    return DEFAULT_REGION
  }
}

export async function middleware(request: NextRequest) {
  // Skip middleware for specific paths
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes("favicon.ico") ||
    request.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|mp4|mp3)$/)
  ) {
    return NextResponse.next()
  }

  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding") === "true"
  const cartId = searchParams.get("cart_id")
  const checkoutStep = searchParams.get("step")

  const regionMap = await getRegionMap()
  const countryCode = await getCountryCode(request, regionMap)

  // Get path segments
  const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean)
  
  // Check if the first segment is already a valid country code
  const firstSegment = pathSegments[0]?.toLowerCase()
  const hasValidCountryCode = firstSegment && regionMap.has(firstSegment)

  // Only redirect if we're at the root or don't have a valid country code
  if (!hasValidCountryCode) {
    const newPath = `/${countryCode}${request.nextUrl.pathname}`
    const queryString = request.nextUrl.search || ""
    const redirectUrl = `${request.nextUrl.origin}${newPath}${queryString}`
    
    const response = NextResponse.redirect(redirectUrl, 307)

    // Handle cart and onboarding parameters
    if (cartId && !checkoutStep) {
      response.cookies.set("_medusa_cart_id", cartId, { maxAge: 60 * 60 * 24 })
    }

    if (isOnboarding) {
      response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })
    }

    return response
  }

  // If we already have a valid country code, just continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/"
  ]
}