import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(request: any) {
    const token = request.nextauth.token
    const { pathname } = request.nextUrl

    // Fast path for public routes - no redirects needed
    if (
      pathname.startsWith('/login') ||
      pathname.startsWith('/select-role') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname === '/'
    ) {
      return NextResponse.next()
    }

    // Fast authentication check
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const userRole = token.role as string
    const hasCompletedInfo = token.hasCompletedInfo as boolean

    // Fast role-based redirects
    if (!userRole && pathname !== '/select-role') {
      return NextResponse.redirect(new URL('/select-role', request.url))
    }

    // Optimized route protection with early returns
    if (userRole === 'clinician') {
      if (pathname.startsWith('/patient/') || pathname.startsWith('/faiz/')) {
        return NextResponse.redirect(new URL('/medical/dashboard', request.url))
      }
      if (pathname === '/dashboard') {
        return NextResponse.redirect(new URL('/medical/dashboard', request.url))
      }
    } else if (userRole === 'patient') {
      if (pathname.startsWith('/medical/')) {
        return NextResponse.redirect(new URL('/patient/dashboard', request.url))
      }
      if (!hasCompletedInfo && pathname.startsWith('/patient/') && pathname !== '/faiz/info') {
        return NextResponse.redirect(new URL('/faiz/info', request.url))
      }
      if (pathname === '/dashboard') {
        return NextResponse.redirect(new URL(hasCompletedInfo ? '/patient/dashboard' : '/faiz/info', request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Fast public route check
        return pathname.startsWith('/login') ||
               pathname.startsWith('/select-role') ||
               pathname.startsWith('/api/auth') ||
               pathname.startsWith('/_next') ||
               pathname.startsWith('/favicon.ico') ||
               pathname === '/' ||
               !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
