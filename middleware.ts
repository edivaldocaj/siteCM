import { NextResponse, type NextRequest } from 'next/server'

const payloadCookieNames = ['payload-token', 'users-token']

export function middleware(req: NextRequest) {
  if (process.env.PROTECT_ADMIN_TOOLS !== 'true') {
    return NextResponse.next()
  }

  const hasPayloadSession = payloadCookieNames.some((name) => Boolean(req.cookies.get(name)?.value))

  if (!hasPayloadSession) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin-tools/:path*'],
}