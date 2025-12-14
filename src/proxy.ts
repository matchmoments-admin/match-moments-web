import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simplified proxy/middleware for handling redirects
 * No authentication required - Salesforce OAuth handles auth separately
 */
export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Legacy URL redirects
  // Redirect old /games/[id] to new structure
  if (path.startsWith('/games/') && path.split('/').length === 3) {
    const id = path.split('/')[2];
    // Default to women's soccer for demo
    const newUrl = new URL(`/womens/soccer/fixtures/${id}`, req.url);
    return NextResponse.redirect(newUrl, 301);
  }

  // Redirect old /moments/[id] to new structure
  if (path.startsWith('/moments/') && path.split('/').length === 3) {
    const newUrl = new URL('/womens', req.url);
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/games/:path*',
    '/moments/:path*',
  ],
};
