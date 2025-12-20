import { getSalesforceClient } from '../client';
import type { Opportunity } from '../types';
import { getCached } from '../../cache/redis';
import { CacheKeys, CacheStrategy } from '../../cache/strategies';

/**
 * Get sales pipeline with caching
 */
export async function getSalesPipeline() {
  return getCached(
    CacheKeys.SALES_PIPELINE,
    async () => {
      const client = getSalesforceClient();

      const result = await client.query<any>(`
        SELECT 
          StageName, COUNT(Id) count, SUM(Amount) total
        FROM Opportunity
        WHERE IsClosed = false
        GROUP BY StageName
      `);

      // Define standard stages
      const stages = [
        'Prospecting',
        'Qualification',
        'Needs Analysis',
        'Value Proposition',
        'Proposal/Price Quote',
        'Negotiation/Review',
        'Closed Won',
      ];

      const pipelineData = stages.map((stage) => {
        const stageData = result.find((r: any) => r.StageName === stage) || {
          count: 0,
          total: 0,
        };

        return {
          stage,
          count: stageData.count || 0,
          value: stageData.total || 0,
        };
      });

      return pipelineData;
    },
    CacheStrategy.salesPipeline
  );
}

/**
 * Get opportunities with optional filters and caching
 */
export async function getOpportunities(filters: {
  stage?: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  return getCached(
    CacheKeys.SALES_OPPORTUNITIES,
    async () => {
      const client = getSalesforceClient();

      let whereClause = '';
      const conditions = [];

      if (filters.stage) {
        conditions.push(`StageName = '${filters.stage}'`);
      }
      if (filters.owner) {
        conditions.push(`OwnerId = '${filters.owner}'`);
      }
      if (filters.startDate) {
        conditions.push(`CloseDate >= ${filters.startDate}`);
      }
      if (filters.endDate) {
        conditions.push(`CloseDate <= ${filters.endDate}`);
      }

      if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }

      const opportunities = await client.query<Opportunity>(`
        SELECT 
          Id, Name, Account.Name, StageName, Amount,
          CloseDate, Probability, Owner.Name,
          Revenue_Stream_Type__c, Customer_Type__c
        FROM Opportunity
        ${whereClause}
        ORDER BY CloseDate ASC, Amount DESC
        LIMIT 100
      `);

      return opportunities;
    },
    CacheStrategy.salesOpportunities
  );
}

/**
 * Get sales forecast for upcoming months
 */
export async function getForecast(months: number = 6) {
  return getCached(
    CacheKeys.SALES_FORECAST,
    async () => {
      const client = getSalesforceClient();
      const monthlyForecasts = [];

      for (let i = 0; i < months; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
        const monthStr = date.toISOString().substring(0, 7);

        const result = await client.query<any>(`
          SELECT 
            COUNT(Id) count,
            SUM(Amount) total,
            SUM(Amount * Probability / 100) weighted
          FROM Opportunity
          WHERE CloseDate >= ${monthStart}
            AND CloseDate <= ${monthEnd}
            AND IsClosed = false
        `);

        const record = result[0] || { count: 0, total: 0, weighted: 0 };

        monthlyForecasts.push({
          month: monthStr,
          count: record.count || 0,
          pipeline: record.total || 0,
          forecast: record.weighted || 0,
        });
      }

      return monthlyForecasts;
    },
    CacheStrategy.salesForecast
  );
}

/**
 * Get sales metrics with caching
 */
export async function getSalesMetrics() {
  return getCached(
    CacheKeys.SALES_METRICS,
    async () => {
      const client = getSalesforceClient();

      // Total pipeline value
      const pipelineResult = await client.query<any>(`
        SELECT SUM(Amount) total
        FROM Opportunity
        WHERE IsClosed = false
      `);
      const totalPipeline = pipelineResult[0]?.total || 0;

      // Win rate (last 90 days)
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const winRateResult = await client.query<any>(`
        SELECT 
          COUNT(Id) total,
          SUM(CASE WHEN IsWon = true THEN 1 ELSE 0 END) won
        FROM Opportunity
        WHERE IsClosed = true
          AND CloseDate >= ${ninetyDaysAgo}
      `);
      const winRateData = winRateResult[0];
      const winRate = winRateData && winRateData.total > 0
        ? Math.round((winRateData.won / winRateData.total) * 100)
        : 0;

      // Average deal size
      const avgDealResult = await client.query<any>(`
        SELECT AVG(Amount) avg
        FROM Opportunity
        WHERE IsWon = true
          AND CloseDate >= ${ninetyDaysAgo}
      `);
      const avgDealSize = avgDealResult[0]?.avg || 0;

      // Sales cycle length (average days)
      const cycleResult = await client.query<any>(`
        SELECT AVG(Days_To_Close__c) avg
        FROM Opportunity
        WHERE IsWon = true
          AND CloseDate >= ${ninetyDaysAgo}
      `);
      const avgSalesCycle = cycleResult[0]?.avg || 0;

      return {
        totalPipeline,
        winRate,
        avgDealSize,
        avgSalesCycle,
      };
    },
    CacheStrategy.salesMetrics
  );
}
