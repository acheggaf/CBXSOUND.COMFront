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

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (!urlCountryCode || urlCountryCode.length !== 2) {
      if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
        return vercelCountryCode
      }
      return DEFAULT_REGION
    }

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      return urlCountryCode
    }

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

  // Prevent middleware from running twice
  if (request.headers.get("x-middleware-cache")) {
    return NextResponse.next()
  }

  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding") === "true"
  const cartId = searchParams.get("cart_id")
  const checkoutStep = searchParams.get("step")
  const onboardingCookie = request.cookies.get("_medusa_onboarding")
  const cartIdCookie = request.cookies.get("_medusa_cart_id")

  const regionMap = await getRegionMap()
  const countryCode = await getCountryCode(request, regionMap)

  const currentCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  const hasValidCountryCode = currentCountryCode && currentCountryCode.length === 2 && regionMap.has(currentCountryCode)

  let response = NextResponse.next()

  // Only redirect if we're at the root or have an invalid country code
  if (!hasValidCountryCode && countryCode) {
    const redirectPath = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
    const queryString = request.nextUrl.search || ""
    const redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    
    response = NextResponse.redirect(redirectUrl, 307)
  }

  // Handle cart and onboarding parameters
  if (cartId && !checkoutStep) {
    response.cookies.set("_medusa_cart_id", cartId, { maxAge: 60 * 60 * 24 })
  }

  if (isOnboarding) {
    response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })
  }

  // Set cache header to prevent multiple executions
  response.headers.set("x-middleware-cache", "1")

  return response
}

export const config = {
  matcher: [
    // Skip api routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // Optional: Add specific paths you want to match
    "/",
    "/:path*"
  ]
}