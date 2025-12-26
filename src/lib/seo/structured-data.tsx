// JSON-LD Structured Data for SEO

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Match Moments',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://matchmoments.co',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: 'Premier destination for women\'s sports coverage and match moments.',
    sameAs: [
      'https://twitter.com/matchmoments',
      'https://instagram.com/matchmoments',
      'https://facebook.com/matchmoments',
    ],
  };
}

export function generateSportsEventSchema(match: {
  Id: string;
  Home_Team__r: { Name: string; Logo_Url__c?: string };
  Away_Team__r: { Name: string; Logo_Url__c?: string };
  Competition__r?: { Name: string };
  Match_Date_Time__c: string;
  Venue__c?: string;
  Home_Score_Final__c?: number;
  Away_Score_Final__c?: number;
  Status__c?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://matchmoments.co';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.Home_Team__r.Name} vs ${match.Away_Team__r.Name}`,
    description: `${match.Competition__r?.Name || 'Match'}: ${match.Home_Team__r.Name} vs ${match.Away_Team__r.Name}`,
    startDate: match.Match_Date_Time__c,
    eventStatus: match.Status__c === 'Finished' 
      ? 'https://schema.org/EventScheduled' 
      : 'https://schema.org/EventScheduled',
    homeTeam: {
      '@type': 'SportsTeam',
      name: match.Home_Team__r.Name,
      logo: match.Home_Team__r.Logo_Url__c,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: match.Away_Team__r.Name,
      logo: match.Away_Team__r.Logo_Url__c,
    },
    ...(match.Home_Score_Final__c !== undefined && {
      homeTeamScore: match.Home_Score_Final__c,
      awayTeamScore: match.Away_Score_Final__c,
    }),
    ...(match.Venue__c && {
      location: {
        '@type': 'Place',
        name: match.Venue__c,
      },
    }),
    url: `${baseUrl}/womens/soccer/fixtures/${match.Id}`,
  };
}

export function generatePersonSchema(player: {
  Id: string;
  Name: string;
  Position__c?: string;
  Date_of_Birth__c?: string;
  Nationality__c?: string;
  Team__r?: { Name: string };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://matchmoments.co';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: player.Name,
    jobTitle: player.Position__c || 'Professional Athlete',
    birthDate: player.Date_of_Birth__c,
    nationality: player.Nationality__c,
    ...(player.Team__r && {
      affiliation: {
        '@type': 'SportsTeam',
        name: player.Team__r.Name,
      },
    }),
    url: `${baseUrl}/womens/soccer/players/${player.Id}`,
  };
}

export function generateSportsTeamSchema(team: {
  Id: string;
  Name: string;
  Sport__c?: string;
  League__c?: string;
  Logo_Url__c?: string;
  Founded__c?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://matchmoments.co';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team.Name,
    sport: team.Sport__c || 'Soccer',
    logo: team.Logo_Url__c,
    ...(team.Founded__c && {
      foundingDate: team.Founded__c,
    }),
    ...(team.League__c && {
      memberOf: {
        '@type': 'SportsOrganization',
        name: team.League__c,
      },
    }),
    url: `${baseUrl}/womens/soccer/teams/${team.Id}`,
  };
}

export function generateArticleSchema(article: {
  Id: string;
  Headline__c: string;
  Meta_Description__c?: string;
  Body__c?: string;
  Featured_Image_URL__c?: string;
  Author__r?: { Name: string };
  Published_Date__c?: string;
  Modified_Date__c?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://matchmoments.co';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.Headline__c,
    description: article.Meta_Description__c,
    image: article.Featured_Image_URL__c,
    datePublished: article.Published_Date__c,
    dateModified: article.Modified_Date__c || article.Published_Date__c,
    author: {
      '@type': 'Person',
      name: article.Author__r?.Name || 'Match Moments',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Match Moments',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    url: `${baseUrl}/articles/${article.Id}`,
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://matchmoments.co';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

export function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

