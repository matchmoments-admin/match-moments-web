import { NextResponse } from "next/server";
import jsforce from "jsforce";
import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * OAuth 2.0 Login Route with PKCE Support
 * Redirects user to Salesforce for authentication
 */
export async function GET() {
  // Determine login URL based on instance URL
  let loginUrl = 'https://login.salesforce.com';
  
  if (process.env.SALESFORCE_INSTANCE_URL) {
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL.toLowerCase();
    // Only use test.salesforce.com for actual sandboxes (not Developer Edition)
    if (instanceUrl.includes('.sandbox.my.salesforce.com')) {
      loginUrl = 'https://test.salesforce.com';
    }
  }

  // Generate PKCE code verifier and challenge
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // Store code verifier in cookie for callback validation
  const cookieStore = await cookies();
  cookieStore.set('pkce_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });

  const oauth2 = new jsforce.OAuth2({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'http://localhost:3001/api/oauth2/callback',
    loginUrl: loginUrl,
  });

  const authUrl = oauth2.getAuthorizationUrl({
    scope: "api id web refresh_token",
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return NextResponse.redirect(authUrl);
}
