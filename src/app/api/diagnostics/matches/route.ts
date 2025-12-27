import { NextResponse } from 'next/server';
import { getSalesforceClient } from '@/lib/salesforce/client';

/**
 * Diagnostics endpoint for troubleshooting Salesforce match data issues
 * 
 * GET /api/diagnostics/matches
 * 
 * This endpoint checks:
 * - Salesforce connection
 * - Match records count
 * - Required field population
 * - Team and Competition relationships
 * - Competition sport/gender fields
 */

export const dynamic = 'force-dynamic';

interface DiagnosticResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  data?: any;
}

export async function GET() {
  const results: DiagnosticResult[] = [];
  
  try {
    // 1. Test Salesforce Connection
    try {
      const client = getSalesforceClient();
      results.push({
        check: 'Salesforce Connection',
        status: 'pass',
        message: 'Successfully connected to Salesforce',
      });

      // 2. Check Match Records Count
      try {
        const matchCount = await client.query(`
          SELECT COUNT() 
          FROM Match__c
        `);
        
        results.push({
          check: 'Match Records',
          status: matchCount.length > 0 ? 'pass' : 'warning',
          message: `Found ${matchCount.length} match records`,
          data: { count: matchCount.length },
        });
      } catch (error: any) {
        results.push({
          check: 'Match Records',
          status: 'fail',
          message: `Failed to count matches: ${error.message}`,
        });
      }

      // 3. Sample Match Records - Check required fields
      try {
        const sampleMatches = await client.query(`
          SELECT 
            Id, Name, 
            Match_Date_Time__c, 
            Status__c,
            Home_Team__c, 
            Away_Team__c,
            Competition__c,
            Home_Score_Final__c,
            Away_Score_Final__c
          FROM Match__c
          LIMIT 5
        `);

        if (sampleMatches.length === 0) {
          results.push({
            check: 'Sample Matches',
            status: 'warning',
            message: 'No matches found in database',
          });
        } else {
          const missingFields = sampleMatches.map((match: any) => {
            const missing: string[] = [];
            if (!match.Match_Date_Time__c) missing.push('Match_Date_Time__c');
            if (!match.Status__c) missing.push('Status__c');
            if (!match.Home_Team__c) missing.push('Home_Team__c');
            if (!match.Away_Team__c) missing.push('Away_Team__c');
            if (!match.Competition__c) missing.push('Competition__c');
            return {
              id: match.Id,
              name: match.Name,
              missingFields: missing,
            };
          });

          const matchesWithMissingFields = missingFields.filter(m => m.missingFields.length > 0);

          results.push({
            check: 'Sample Matches Required Fields',
            status: matchesWithMissingFields.length === 0 ? 'pass' : 'warning',
            message: matchesWithMissingFields.length === 0 
              ? 'All sampled matches have required fields'
              : `${matchesWithMissingFields.length} of ${sampleMatches.length} matches missing required fields`,
            data: { matchesWithIssues: matchesWithMissingFields },
          });
        }
      } catch (error: any) {
        results.push({
          check: 'Sample Matches',
          status: 'fail',
          message: `Failed to query sample matches: ${error.message}`,
        });
      }

      // 4. Check Team Relationships
      try {
        const teamsCount = await client.query(`
          SELECT COUNT() 
          FROM Account
          WHERE RecordType.DeveloperName = 'Team'
        `);

        results.push({
          check: 'Team Records',
          status: teamsCount.length > 0 ? 'pass' : 'warning',
          message: `Found ${teamsCount.length} team records`,
          data: { count: teamsCount.length },
        });
      } catch (error: any) {
        results.push({
          check: 'Team Records',
          status: 'fail',
          message: `Failed to query teams: ${error.message}`,
        });
      }

      // 5. Check Competition Records and Required Fields
      try {
        const competitions = await client.query(`
          SELECT 
            Id, Name, 
            Sport__c, 
            Gender_Class__c
          FROM Competition__c
          LIMIT 10
        `);

        if (competitions.length === 0) {
          results.push({
            check: 'Competition Records',
            status: 'warning',
            message: 'No competitions found in database',
          });
        } else {
          const missingFields = competitions.map((comp: any) => {
            const missing: string[] = [];
            if (!comp.Sport__c) missing.push('Sport__c');
            if (!comp.Gender_Class__c) missing.push('Gender_Class__c');
            return {
              id: comp.Id,
              name: comp.Name,
              missingFields: missing,
            };
          });

          const compsWithMissingFields = missingFields.filter(c => c.missingFields.length > 0);

          results.push({
            check: 'Competition Required Fields',
            status: compsWithMissingFields.length === 0 ? 'pass' : 'warning',
            message: compsWithMissingFields.length === 0
              ? 'All sampled competitions have required fields'
              : `${compsWithMissingFields.length} of ${competitions.length} competitions missing required fields`,
            data: { competitionsWithIssues: compsWithMissingFields },
          });
        }
      } catch (error: any) {
        results.push({
          check: 'Competition Records',
          status: 'fail',
          message: `Failed to query competitions: ${error.message}`,
        });
      }

      // 6. Check Match with Full Relationships
      try {
        const fullMatches = await client.query(`
          SELECT 
            Id, Name,
            Home_Team__r.Name,
            Away_Team__r.Name,
            Competition__r.Name,
            Competition__r.Sport__c,
            Competition__r.Gender_Class__c,
            Match_Date_Time__c,
            Status__c
          FROM Match__c
          WHERE Competition__c != null
            AND Home_Team__c != null
            AND Away_Team__c != null
          LIMIT 5
        `);

        results.push({
          check: 'Matches with Complete Relationships',
          status: fullMatches.length > 0 ? 'pass' : 'fail',
          message: fullMatches.length > 0
            ? `Found ${fullMatches.length} matches with complete relationships`
            : 'No matches found with all required relationships (Home Team, Away Team, Competition)',
          data: {
            sampleMatches: fullMatches.map((m: any) => ({
              id: m.Id,
              name: m.Name,
              homeTeam: m.Home_Team__r?.Name,
              awayTeam: m.Away_Team__r?.Name,
              competition: m.Competition__r?.Name,
              sport: m.Competition__r?.Sport__c,
              gender: m.Competition__r?.Gender_Class__c,
              date: m.Match_Date_Time__c,
              status: m.Status__c,
            })),
          },
        });
      } catch (error: any) {
        results.push({
          check: 'Matches with Relationships',
          status: 'fail',
          message: `Failed to query matches with relationships: ${error.message}`,
        });
      }

      // 7. Test the actual getMatches query
      try {
        const { getMatches } = await import('@/lib/salesforce/queries/matches');
        const matches = await getMatches({ limit: 5 });

        results.push({
          check: 'getMatches() Function',
          status: matches.length > 0 ? 'pass' : 'warning',
          message: matches.length > 0
            ? `getMatches() returned ${matches.length} matches successfully`
            : 'getMatches() returned no matches',
          data: {
            matchCount: matches.length,
            sampleMatch: matches[0] || null,
          },
        });
      } catch (error: any) {
        results.push({
          check: 'getMatches() Function',
          status: 'fail',
          message: `getMatches() failed: ${error.message}`,
          data: { error: error.stack },
        });
      }

    } catch (error: any) {
      results.push({
        check: 'Salesforce Connection',
        status: 'fail',
        message: `Failed to connect to Salesforce: ${error.message}`,
        data: { error: error.stack },
      });
    }

    // Generate summary
    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;
    const warningCount = results.filter(r => r.status === 'warning').length;

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        passed: passCount,
        failed: failCount,
        warnings: warningCount,
        overallStatus: failCount === 0 ? (warningCount === 0 ? 'healthy' : 'needs-attention') : 'critical',
      },
      checks: results,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Diagnostics failed to run',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

