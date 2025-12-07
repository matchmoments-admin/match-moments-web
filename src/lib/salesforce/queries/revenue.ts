import { getSalesforceConnection } from '../connection';

export async function getRevenueMetrics(params: {
  startDate?: string | null;
  endDate?: string | null;
} = {}) {
  const conn = await getSalesforceConnection();
  const { startDate, endDate } = params;

  // Default to current year if no dates provided
  const start = startDate || `${new Date().getFullYear()}-01-01`;
  const end = endDate || `${new Date().getFullYear()}-12-31`;

  // Query all revenue streams
  const revenueResult = await conn.query(`
    SELECT 
      Id, Amount__c, Revenue_Date__c, Stream_Type__c,
      Gender_Focus__c, Revenue_Type__c, Account__r.Name,
      Payment_Status__c
    FROM Revenue_Stream__c
    WHERE Revenue_Date__c >= ${start}
      AND Revenue_Date__c <= ${end}
      AND Payment_Status__c = 'Paid'
    ORDER BY Revenue_Date__c DESC
  `);

  const revenueData = revenueResult.records;

  // Calculate MRR (Monthly Recurring Revenue)
  const currentMonth = new Date().toISOString().substring(0, 7);
  const mrrRecords = revenueData.filter((r: any) =>
    r.Revenue_Date__c.startsWith(currentMonth) &&
    r.Revenue_Type__c?.includes('Monthly')
  );
  const mrr = mrrRecords.reduce((sum: number, r: any) => sum + (r.Amount__c || 0), 0);

  // Calculate ARR
  const arr = mrr * 12;

  // Previous month MRR for growth calculation
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().substring(0, 7);
  const lastMrrRecords = revenueData.filter((r: any) =>
    r.Revenue_Date__c.startsWith(lastMonthStr) &&
    r.Revenue_Type__c?.includes('Monthly')
  );
  const lastMrr = lastMrrRecords.reduce((sum: number, r: any) => sum + (r.Amount__c || 0), 0);
  const mrrGrowth = lastMrr > 0 ? Math.round(((mrr - lastMrr) / lastMrr) * 100) : 0;

  // Women's revenue
  const womensRevenue = revenueData
    .filter((r: any) => r.Gender_Focus__c === "Women's Sports")
    .reduce((sum: number, r: any) => sum + (r.Amount__c || 0), 0);

  const totalRevenue = revenueData.reduce((sum: number, r: any) => sum + (r.Amount__c || 0), 0);
  const womensRevenuePercent = totalRevenue > 0
    ? Math.round((womensRevenue / totalRevenue) * 100)
    : 0;

  // Active customers count
  const customerResult = await conn.query(`
    SELECT COUNT(Id) count
    FROM Subscription__c
    WHERE Status__c = 'Active'
  `);
  const activeCustomers = customerResult.records[0]?.count || 0;

  // New customers this month
  const newCustomersResult = await conn.query(`
    SELECT COUNT(Id) count
    FROM Subscription__c
    WHERE Status__c = 'Active'
      AND CreatedDate >= ${currentMonth}-01T00:00:00Z
  `);
  const newCustomersThisMonth = newCustomersResult.records[0]?.count || 0;

  // Monthly revenue trend (last 12 months)
  const monthlyRevenue = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().substring(0, 7);

    const monthRevenue = revenueData
      .filter((r: any) => r.Revenue_Date__c.startsWith(monthStr))
      .reduce((sum: number, r: any) => sum + (r.Amount__c || 0), 0);

    monthlyRevenue.push({
      month: monthStr,
      revenue: monthRevenue,
    });
  }

  // Revenue by stream type
  const streamTypes = [
    'Subscription',
    'Advertising',
    'Sponsorship',
    'Media Licensing',
    'Team Portal',
    'API Access',
    'Affiliate',
  ];
  const byStream = streamTypes.map((type) => {
    const typeRevenue = revenueData
      .filter((r: any) => r.Stream_Type__c?.includes(type))
      .reduce((sum: number, r: any) => sum + (r.Amount__c || 0), 0);

    return {
      type,
      revenue: typeRevenue,
      percentage: totalRevenue > 0 ? Math.round((typeRevenue / totalRevenue) * 100) : 0,
    };
  });

  // Revenue by gender
  const byGender = [
    {
      gender: "Women's Sports",
      revenue: womensRevenue,
      percentage: womensRevenuePercent,
    },
    {
      gender: "Men's Sports",
      revenue: revenueData
        .filter((r: any) => r.Gender_Focus__c === "Men's Sports")
        .reduce((sum: number, r: any) => sum + (r.Amount__c || 0), 0),
      percentage: 0,
    },
    {
      gender: 'Both',
      revenue: revenueData
        .filter((r: any) => r.Gender_Focus__c === 'Both')
        .reduce((sum: number, r: any) => sum + (r.Amount__c || 0), 0),
      percentage: 0,
    },
  ];

  // Calculate remaining percentages
  byGender[1].percentage = totalRevenue > 0
    ? Math.round((byGender[1].revenue / totalRevenue) * 100)
    : 0;
  byGender[2].percentage = totalRevenue > 0
    ? Math.round((byGender[2].revenue / totalRevenue) * 100)
    : 0;

  // Recent transactions
  const recentTransactions = revenueData.slice(0, 10).map((r: any) => ({
    id: r.Id,
    date: r.Revenue_Date__c,
    customer: r.Account__r?.Name || 'N/A',
    amount: r.Amount__c,
    streamType: r.Stream_Type__c,
    genderFocus: r.Gender_Focus__c,
    status: r.Payment_Status__c,
  }));

  return {
    mrr,
    arr,
    arrTarget: 1920000, // From business plan
    mrrGrowth,
    womensRevenue,
    womensRevenuePercent,
    activeCustomers,
    newCustomersThisMonth,
    monthlyRevenue,
    byStream,
    byGender,
    recentTransactions,
  };
}

