import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getSalesforceConnection } from '@/lib/salesforce/connection';
import { DashboardRole } from '@/lib/auth/roles';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Check if user exists in Salesforce
      try {
        const conn = await getSalesforceConnection();

        const sfUser = await conn.sobject('User').findOne({
          Email: user.email,
        });

        if (!sfUser) {
          // User not found in Salesforce - deny access
          console.log(`[AUTH] User ${user.email} not found in Salesforce`);
          return '/auth/access-denied?reason=not-in-salesforce';
        }

        console.log(`[AUTH] User ${user.email} authenticated successfully`);
        return true;
      } catch (error) {
        console.error('[AUTH] Error during sign-in:', error);
        return '/auth/error';
      }
    },

    async session({ session, token }) {
      if (session.user) {
        // Fetch user's dashboard role from Salesforce
        try {
          const conn = await getSalesforceConnection();

          const sfUser = await conn.sobject('User').findOne(
            {
              Email: session.user.email,
            },
            {
              Id: 1,
              Dashboard_Role__c: 1,
              Name: 1,
            }
          );

          if (sfUser) {
            session.user.id = sfUser.Id;
            session.user.name = sfUser.Name;
            session.user.dashboardRole = sfUser.Dashboard_Role__c as DashboardRole;
          }
        } catch (error) {
          console.error('[AUTH] Error fetching user session:', error);
        }
      }

      return session;
    },

    async jwt({ token, user, account }) {
      // Store role in JWT token for middleware access
      if (user) {
        try {
          const conn = await getSalesforceConnection();

          const sfUser = await conn.sobject('User').findOne(
            {
              Email: user.email,
            },
            {
              Dashboard_Role__c: 1,
            }
          );

          if (sfUser) {
            token.dashboardRole = sfUser.Dashboard_Role__c;
          }
        } catch (error) {
          console.error('[AUTH] Error updating JWT:', error);
        }
      }

      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

