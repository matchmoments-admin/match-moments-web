import { NextRequest, NextResponse } from "next/server";
import jsforce from "jsforce";
import { cookies } from "next/headers";

/**
 * OAuth 2.0 Callback Route with PKCE Support
 * Handles the redirect from Salesforce, exchanges code for access token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const cookieStore = await cookies();

  if (!code) {
    return NextResponse.json({ error: "No authorization code found" }, { status: 400 });
  }

  // Retrieve PKCE code verifier from cookie
  const codeVerifier = cookieStore.get("pkce_code_verifier")?.value;
  
  if (!codeVerifier) {
    return NextResponse.json({ 
      error: "PKCE verification failed", 
      message: "Code verifier not found. Please try logging in again." 
    }, { status: 400 });
  }

  // Determine login URL based on instance URL
  let loginUrl = 'https://login.salesforce.com';
  
  if (process.env.SALESFORCE_INSTANCE_URL) {
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL.toLowerCase();
    // Only use test.salesforce.com for actual sandboxes (not Developer Edition)
    if (instanceUrl.includes('.sandbox.my.salesforce.com')) {
      loginUrl = 'https://test.salesforce.com';
    }
  }

  const oauth2 = new jsforce.OAuth2({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'http://localhost:3001/api/oauth2/callback',
    loginUrl: loginUrl,
  });

  const conn = new jsforce.Connection({ oauth2: oauth2 });

  try {
    // Exchange authorization code for access token with PKCE code verifier
    await conn.authorize(code, { code_verifier: codeVerifier } as any);
    
    // Clear PKCE code verifier cookie
    cookieStore.delete("pkce_code_verifier");
    
    // Store Access Token
    cookieStore.set("salesforce_access_token", conn.accessToken!, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    // Store Instance URL (important for making calls later)
    cookieStore.set("salesforce_instance_url", conn.instanceUrl!, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    // Store refresh token if available
    if (conn.refreshToken) {
      cookieStore.set("salesforce_refresh_token", conn.refreshToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error: any) {
    console.error('[OAuth] Salesforce Auth Error:', error);
    
    // Clear PKCE cookie on error
    cookieStore.delete("pkce_code_verifier");
    
    return NextResponse.json({ 
      error: "Salesforce Auth Error",
      message: error.message 
    }, { status: 500 });
  }
}
