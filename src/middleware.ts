import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { canAccessPage } from './lib/auth/permissions';
import { DashboardRole } from './lib/auth/roles';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

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
  matcher: ['/dashboard/:path*', '/api/dashboard/:path*'],
};

