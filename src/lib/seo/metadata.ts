import { Metadata } from 'next';

const siteConfig = {
  name: 'Match Moments',
  description: 'Your premier destination for women\'s sports coverage, match moments, highlights, and statistics.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://matchmoments.co',
  ogImage: '/og-image.jpg',
  twitterHandle: '@matchmoments',
};

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}): Metadata {
  const pageTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateMatchMetadata(match: {
  Home_Team__r: { Name: string };
  Away_Team__r: { Name: string };
  Competition__r?: { Name: string };
  Match_Date_Time__c: string;
  Home_Score_Final__c?: number;
  Away_Score_Final__c?: number;
}) {
  const title = `${match.Home_Team__r.Name} vs ${match.Away_Team__r.Name}`;
  const score = match.Home_Score_Final__c !== undefined && match.Away_Score_Final__c !== undefined
    ? ` ${match.Home_Score_Final__c}-${match.Away_Score_Final__c}`
    : '';
  const competition = match.Competition__r?.Name ? ` - ${match.Competition__r.Name}` : '';
  
  return generateMetadata({
    title,
    description: `${title}${score}${competition}. Get live updates, lineups, and match statistics.`,
    type: 'article',
  });
}

export function generatePlayerMetadata(player: {
  Name: string;
  Position__c?: string;
  Team__r?: { Name: string };
  Nationality__c?: string;
}) {
  const position = player.Position__c ? ` - ${player.Position__c}` : '';
  const team = player.Team__r?.Name ? ` | ${player.Team__r.Name}` : '';
  
  return generateMetadata({
    title: `${player.Name}${position}`,
    description: `View ${player.Name}'s profile, statistics, awards, and career history${team}.`,
    type: 'profile',
  });
}

export function generateTeamMetadata(team: {
  Name: string;
  League__c?: string;
  Sport__c?: string;
}) {
  const league = team.League__c ? ` - ${team.League__c}` : '';
  
  return generateMetadata({
    title: `${team.Name}${league}`,
    description: `${team.Name} squad, fixtures, results, and statistics. Follow the latest news and updates.`,
  });
}

export function generateCompetitionMetadata(competition: {
  Name: string;
  Country__c?: string;
  Sport__c?: string;
}) {
  return generateMetadata({
    title: competition.Name,
    description: `${competition.Name} standings, fixtures, results, and top scorers. Follow all the action.`,
  });
}

export function generateArticleMetadata(article: {
  Headline__c: string;
  Meta_Description__c?: string;
  Featured_Image_URL__c?: string;
  Author__r?: { Name: string };
  Published_Date__c?: string;
}) {
  return generateMetadata({
    title: article.Headline__c,
    description: article.Meta_Description__c,
    image: article.Featured_Image_URL__c,
    type: 'article',
  });
}

