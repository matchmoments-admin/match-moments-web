import { DashboardRole } from '@/lib/auth/roles';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      dashboardRole?: DashboardRole;
    };
  }

  interface User {
    id: string;
    dashboardRole?: DashboardRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    dashboardRole?: DashboardRole;
  }
}

