import { NextRequest, NextResponse } from "next/server";
import jsforce from "jsforce";
import { cookies } from "next/headers";

/**
 * OAuth 2.0 Callback Route
 * Handles the redirect from Salesforce, exchanges code for access token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No authorization code found" }, { status: 400 });
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
    await conn.authorize(code);
    const cookieStore = await cookies();
    
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
    return NextResponse.json({ 
      error: "Salesforce Auth Error",
      message: error.message 
    }, { status: 500 });
  }
}
