import { cookies } from "next/headers";
import jsforce from "jsforce";
import Link from "next/link";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("salesforce_access_token")?.value;
  const instanceUrl = cookieStore.get("salesforce_instance_url")?.value;

  if (!accessToken || !instanceUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please log in to Salesforce</h1>
          <p className="text-gray-600 mb-8">You need to authenticate with Salesforce to view this page.</p>
          <Link href="/api/oauth2/auth">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Log in with Salesforce
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const conn = new jsforce.Connection({
    accessToken: accessToken,
    instanceUrl: instanceUrl,
  });

  let accounts: any[] = [];
  let userInfo: any = null;
  let error: string | null = null;

  try {
    // Get user information
    userInfo = await conn.identity();
    
    // Query Salesforce Data
    const result = await conn.query("SELECT Id, Name, Type, Industry, Phone FROM Account LIMIT 15");
    accounts = result.records;
  } catch (err: any) {
    error = err.message;
    console.error('[Dashboard] Failed to fetch data from Salesforce:', err);
  }

  return (
    <div className="min-h-screen bg-background p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Salesforce Dashboard</h1>
          {userInfo && (
            <p className="text-gray-600">
              Logged in as: <span className="font-semibold">{userInfo.display_name}</span> ({userInfo.username})
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Accounts Table */}
        {!error && accounts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-semibold">Salesforce Accounts ({accounts.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account: any) => (
                    <tr key={account.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.Type || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.Industry || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.Phone || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && accounts.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No accounts found in your Salesforce org.</p>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8">
          <Link href="/">
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
