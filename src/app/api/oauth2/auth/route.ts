import { NextResponse } from "next/server";
import jsforce from "jsforce";

/**
 * OAuth 2.0 Login Route
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

  const oauth2 = new jsforce.OAuth2({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'http://localhost:3001/api/oauth2/callback',
    loginUrl: loginUrl,
  });

  const authUrl = oauth2.getAuthorizationUrl({
    scope: "api id web refresh_token",
  });

  return NextResponse.redirect(authUrl);
}
