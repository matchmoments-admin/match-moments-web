import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { canAccessPage } from './lib/auth/permissions';
import { DashboardRole } from './lib/auth/roles';

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Legacy URL redirects - handle before auth checks
  // Redirect old /games/[id] to new structure
  if (path.startsWith('/games/') && path.split('/').length === 3) {
    const id = path.split('/')[2];
    // Default to women's soccer for demo - in production, fetch from DB
    const newUrl = new URL(`/womens/soccer/fixtures/${id}`, req.url);
    return NextResponse.redirect(newUrl, 301);
  }

  // Redirect old /moments/[id] to new structure
  if (path.startsWith('/moments/') && path.split('/').length === 3) {
    // In production, query database to get fixture context
    const newUrl = new URL('/womens', req.url);
    return NextResponse.redirect(newUrl, 301);
  }

  // Public routes - allow access
  if (!path.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Dashboard routes - require authentication
  if (!token) {
    const signInUrl = new URL('/api/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access
  const userRole = token.dashboardRole as DashboardRole;

  if (!userRole) {
    // No role assigned - redirect to access request page
    return NextResponse.redirect(new URL('/auth/access-denied', req.url));
  }

  // Extract resource from path (e.g., /dashboard/revenue -> revenue)
  const pathParts = path.split('/');
  const resource = pathParts[2]; // dashboard/[resource]/...

  if (resource && resource !== 'overview' && !canAccessPage(userRole, resource)) {
    // User doesn't have permission - redirect to overview
    return NextResponse.redirect(new URL('/dashboard/overview', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/dashboard/:path*',
    '/games/:path*',
    '/moments/:path*',
  ],
};

