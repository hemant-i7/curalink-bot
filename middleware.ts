import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(request: NextRequest) {
    const token = request.nextauth.token
    const { pathname } = request.nextUrl

    // Allow access to public routes
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

    // If user is not authenticated, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user has selected a role
    if (!token.role && pathname !== '/select-role') {
      return NextResponse.redirect(new URL('/select-role', request.url))
    }

    // Role-based route protection
    const userRole = token.role as string

    // Clinician-only routes
    if (pathname.startsWith('/medical') && userRole !== 'clinician') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Patient-only routes (like completing profile info)
    if (pathname.startsWith('/faiz/info') && userRole !== 'patient') {
      return NextResponse.redirect(new URL('/medical/dashboard', request.url))
    }

    // Redirect to appropriate dashboard based on role
    if (pathname === '/dashboard' && userRole === 'clinician') {
      return NextResponse.redirect(new URL('/medical/dashboard', request.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to public routes
        if (
          pathname.startsWith('/login') ||
          pathname.startsWith('/select-role') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon.ico') ||
          pathname === '/'
        ) {
          return true
        }

        // Require authentication for all other routes
        return !!token
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
