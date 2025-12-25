import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceClient } from '@/lib/salesforce/client';
import { getCached } from '@/lib/cache/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // teams, players, competitions, articles
    const sport = searchParams.get('sport');
    const gender = searchParams.get('gender');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const cacheKey = `search:${query}:${type || 'all'}:${sport || 'all'}:${gender || 'all'}:${limit}`;

    const results = await getCached(
      cacheKey,
      async () => {
        const client = getSalesforceClient();
        const searchTerm = query.replace(/'/g, "\\'"); // Escape single quotes
        const searchResults: any = {
          teams: [],
          players: [],
          competitions: [],
          articles: [],
        };

        // Build WHERE clauses for filters
        const sportFilter = sport ? `AND Sport__c = '${sport}'` : '';
        const genderFilter = gender ? `AND Gender_Class__c = '${gender}'` : '';

        // Search Teams (if type is 'teams' or 'all')
        if (!type || type === 'teams' || type === 'all') {
          try {
            const teams = await client.query(`
              SELECT 
                Id, Name, Sport__c, Gender_Class__c, 
                League__c, Abbreviation__c, Logo_Url__c
              FROM Account
              WHERE RecordType.DeveloperName = 'Team'
                AND Name LIKE '%${searchTerm}%'
                ${sportFilter}
                ${genderFilter}
              ORDER BY Name
              LIMIT ${limit}
            `);
            searchResults.teams = teams.map((t: any) => ({
              ...t,
              type: 'team',
            }));
          } catch (error) {
            console.error('Error searching teams:', error);
          }
        }

        // Search Players (if type is 'players' or 'all')
        if (!type || type === 'players' || type === 'all') {
          try {
            const players = await client.query(`
              SELECT 
                Id, Name, Sport__c, Gender_Class__c,
                Position__c, Date_of_Birth__c, Nationality__c
              FROM Contact
              WHERE RecordType.DeveloperName = 'Player'
                AND Name LIKE '%${searchTerm}%'
                ${sportFilter}
                ${genderFilter}
              ORDER BY Name
              LIMIT ${limit}
            `);
            searchResults.players = players.map((p: any) => ({
              ...p,
              type: 'player',
            }));
          } catch (error) {
            console.error('Error searching players:', error);
          }
        }

        // Search Competitions (if type is 'competitions' or 'all')
        if (!type || type === 'competitions' || type === 'all') {
          try {
            const sportFilterComp = sport ? `AND Sport__c = '${sport}'` : '';
            const genderFilterComp = gender ? `AND Gender_Class__c = '${gender}'` : '';
            
            const competitions = await client.query(`
              SELECT 
                Id, Name, Sport__c, Gender_Class__c,
                Competition_Tier__c, Country__c, Logo_URL__c
              FROM Competition__c
              WHERE Name LIKE '%${searchTerm}%'
                ${sportFilterComp}
                ${genderFilterComp}
              ORDER BY Name
              LIMIT ${limit}
            `);
            searchResults.competitions = competitions.map((c: any) => ({
              ...c,
              type: 'competition',
            }));
          } catch (error) {
            console.error('Error searching competitions:', error);
          }
        }

        // Search Articles (if type is 'articles' or 'all')
        if (!type || type === 'articles' || type === 'all') {
          try {
            const articles = await client.query(`
              SELECT 
                Id, Name, Headline__c, Article_Type__c,
                Featured_Image_URL__c, Published_Date__c,
                Author__c
              FROM Article__c
              WHERE (Headline__c LIKE '%${searchTerm}%' 
                OR Body__c LIKE '%${searchTerm}%')
                AND Status__c = 'Published'
              ORDER BY Published_Date__c DESC
              LIMIT ${limit}
            `);
            searchResults.articles = articles.map((a: any) => ({
              ...a,
              type: 'article',
            }));
          } catch (error) {
            console.error('Error searching articles:', error);
          }
        }

        // Combine all results
        const allResults = [
          ...searchResults.teams,
          ...searchResults.players,
          ...searchResults.competitions,
          ...searchResults.articles,
        ];

        return {
          query,
          results: type && type !== 'all' ? searchResults[type] : allResults,
          counts: {
            teams: searchResults.teams.length,
            players: searchResults.players.length,
            competitions: searchResults.competitions.length,
            articles: searchResults.articles.length,
            total: allResults.length,
          },
        };
      },
      300
    );

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Search failed' 
      },
      { status: 500 }
    );
  }
}

