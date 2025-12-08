import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { heavyRateLimit, lightRateLimit, defaultRateLimit } from "@/lib/rate-limit";

export async function proxy(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
  const pathname = request.nextUrl.pathname;

  // Determine which rate limiter to use based on route
  let rateLimit = defaultRateLimit;
  let routeType = "default";

  // Heavy routes (pagination endpoints)
  if (
    pathname.startsWith("/compounds") ||
    pathname.startsWith("/developers") ||
    pathname.startsWith("/properties") ||
    pathname.startsWith("/areas") ||
    pathname.startsWith("/offers")
  ) {
    rateLimit = heavyRateLimit;
    routeType = "heavy";
  }

  // Light routes (single slug fetches)
  if (
    pathname.match(/\/(compounds|developers|properties|areas)\/[^\/]+$/)
  ) {
    rateLimit = lightRateLimit;
    routeType = "light";
  }

  try {
    const { success, limit, reset, remaining } = await rateLimit.limit(
      `${routeType}_${ip}_${pathname}`
    );

    const response = success
      ? NextResponse.next()
      : NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again later.",
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          { status: 429 }
        );

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    if (!success) {
      console.log(
        `[Rate Limit] ${routeType.toUpperCase()} - IP: ${ip} - Path: ${pathname} - Exceeded`
      );
      response.headers.set("Retry-After", Math.ceil((reset - Date.now()) / 1000).toString());
    }

    return response;
  } catch (error) {
    console.error("[Rate Limit] Error:", error);
    // Allow request to proceed if rate limiting fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - manifest.webmanifest (PWA manifest)
     * - opengraph-image (OG images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|opengraph-image).*)",
  ],
};
