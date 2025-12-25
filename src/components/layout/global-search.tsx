'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { MdSportsSoccer, MdSportsBasketball } from 'react-icons/md';
import { HiUserGroup, HiNewspaper } from 'react-icons/hi2';
import { BsTrophy } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SearchResult {
  Id: string;
  Name: string;
  type: 'team' | 'player' | 'competition' | 'article';
  Sport__c?: string;
  Gender_Class__c?: string;
  Position__c?: string;
  Headline__c?: string;
  Logo_Url__c?: string;
  Logo_URL__c?: string;
  Featured_Image_URL__c?: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  counts: {
    teams: number;
    players: number;
    competitions: number;
    articles: number;
    total: number;
  };
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/sports/search?q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = (result: SearchResult) => {
    switch (result.type) {
      case 'team':
        return <HiUserGroup className="w-5 h-5 text-blue-500" />;
      case 'player':
        return <MdSportsSoccer className="w-5 h-5 text-green-500" />;
      case 'competition':
        return <BsTrophy className="w-5 h-5 text-yellow-500" />;
      case 'article':
        return <HiNewspaper className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getResultPath = (result: SearchResult) => {
    const genderPath = result.Gender_Class__c?.toLowerCase().includes('women') ? 'womens' : 'mens';
    const sportPath = result.Sport__c?.toLowerCase() || 'soccer';
    
    switch (result.type) {
      case 'team':
        return `/${genderPath}/${sportPath}/teams/${result.Id}`;
      case 'player':
        return `/${genderPath}/${sportPath}/players/${result.Id}`;
      case 'competition':
        return `/${genderPath}/${sportPath}/competitions/${result.Id}`;
      case 'article':
        return `/articles/${result.Id}`;
      default:
        return '/';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    setResults(null);
    router.push(getResultPath(result));
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-primary transition-colors"
        aria-label="Search"
      >
        <IoSearchOutline className="w-5 h-5" />
        <span className="text-sm text-muted-foreground hidden sm:inline">Search...</span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-screen max-w-2xl bg-background border border-border rounded-lg shadow-2xl z-50">
          <div className="p-4">
            {/* Search Input */}
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search teams, players, competitions, articles..."
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setResults(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <IoCloseOutline className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {/* Results */}
            {results && results.results.length > 0 && (
              <div className="mt-4 max-h-96 overflow-y-auto">
                <div className="space-y-1">
                  {results.results.map((result) => (
                    <button
                      key={result.Id}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      {/* Icon or Image */}
                      <div className="flex-shrink-0">
                        {(result.Logo_Url__c || result.Logo_URL__c || result.Featured_Image_URL__c) ? (
                          <Image
                            src={result.Logo_Url__c || result.Logo_URL__c || result.Featured_Image_URL__c || ''}
                            alt={result.Name}
                            width={40}
                            height={40}
                            className="object-contain rounded"
                          />
                        ) : (
                          getResultIcon(result)
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {result.Headline__c || result.Name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{result.type}</span>
                          {result.Sport__c && (
                            <>
                              <span>•</span>
                              <span>{result.Sport__c}</span>
                            </>
                          )}
                          {result.Position__c && (
                            <>
                              <span>•</span>
                              <span>{result.Position__c}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Counts */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Found {results.counts.total} results</span>
                    <div className="flex gap-3">
                      {results.counts.teams > 0 && <span>{results.counts.teams} teams</span>}
                      {results.counts.players > 0 && <span>{results.counts.players} players</span>}
                      {results.counts.competitions > 0 && <span>{results.counts.competitions} comps</span>}
                      {results.counts.articles > 0 && <span>{results.counts.articles} articles</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Results */}
            {results && results.results.length === 0 && !loading && (
              <div className="mt-4 text-center text-sm text-muted-foreground py-8">
                No results found for &quot;{query}&quot;
              </div>
            )}

            {/* Help Text */}
            {!query && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="mb-2">Search for:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Teams (e.g., &quot;Arsenal&quot;, &quot;USWNT&quot;)</li>
                  <li>• Players (e.g., &quot;Megan Rapinoe&quot;)</li>
                  <li>• Competitions (e.g., &quot;WSL&quot;, &quot;NWSL&quot;)</li>
                  <li>• Articles and news</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

