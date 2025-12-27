'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ICONS } from '@/lib/sport-icons';
import { iconClass, ICON_TRANSITIONS } from '@/lib/icon-styles';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed right-0 top-0 z-[100] h-full w-[85%] max-w-[400px] rounded-l-2xl bg-black p-6 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Close menu"
        >
          <ICONS.close className={iconClass('action', ICON_TRANSITIONS.default)} />
        </button>

        {/* Menu Content - Scrollable */}
        <nav className="mt-16 h-[calc(100%-80px)] space-y-6 overflow-y-auto pb-8">
          {/* Core Content & Features */}
          <div className="space-y-2">
            <SectionTitle>Core Content & Features</SectionTitle>
            <SidebarLink href="/" onClick={onClose}>
              Home
            </SidebarLink>
            <SidebarLink href="/games" onClick={onClose}>
              Games
            </SidebarLink>
            <SidebarLink href="/fixtures" onClick={onClose}>
              Fixtures
            </SidebarLink>
            <SidebarLink href="/news" onClick={onClose}>
              News
            </SidebarLink>
            <SidebarLink href="/sports" onClick={onClose}>
              Sports
            </SidebarLink>
            <SidebarLink href="/standings" onClick={onClose}>
              Standings
            </SidebarLink>
            <SidebarLink href="/moments" onClick={onClose}>
              Moments
            </SidebarLink>
            <SidebarLink href="/lineups" onClick={onClose}>
              Lineups
            </SidebarLink>
            <SidebarLink href="/trivia" onClick={onClose}>
              Questions/Trivia
            </SidebarLink>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/20"></div>

          {/* Creator & AI Tools */}
          <div className="space-y-2">
            <SectionTitle>Creator & AI Tools</SectionTitle>
            <SidebarLink href="/creator-tools" onClick={onClose}>
              Creator Tools
            </SidebarLink>
            <SidebarSubLink href="/creator-tools/trivia-generator" onClick={onClose}>
              Trivia Generator
            </SidebarSubLink>
            <SidebarSubLink href="/creator-tools/lineup-predictor" onClick={onClose}>
              Lineup Predictor
            </SidebarSubLink>
            <SidebarSubLink href="/creator-tools/talking-points" onClick={onClose}>
              Talking Points
            </SidebarSubLink>
            <SidebarSubLink href="/creator-tools/social-content" onClick={onClose}>
              Social Media Content
            </SidebarSubLink>
            <SidebarSubLink href="/creator-tools/match-preview" onClick={onClose}>
              Match Preview/Recap
            </SidebarSubLink>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/20"></div>

          {/* Analysis & Insights */}
          <div className="space-y-2">
            <SectionTitle>Analysis & Insights</SectionTitle>
            <SidebarLink href="/analysis" onClick={onClose}>
              Stats & Analysis
            </SidebarLink>
            <SidebarLink href="/player-stats" onClick={onClose}>
              Player Stats
            </SidebarLink>
            <SidebarLink href="/team-comparison" onClick={onClose}>
              Team Comparison
            </SidebarLink>
            <SidebarLink href="/betting-insights" onClick={onClose}>
              Betting Insights
            </SidebarLink>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/20"></div>

          {/* Community & Content */}
          <div className="space-y-2">
            <SectionTitle>Community & Content</SectionTitle>
            <SidebarMediaLink
              href="/podcasts"
              icon={<ICONS.microphone className={iconClass('nav', 'text-white', ICON_TRANSITIONS.default)} />}
              iconBg="bg-gray-700"
              onClick={onClose}
            >
              Podcasts
            </SidebarMediaLink>

            <SidebarMediaLink
              href="/videos"
              icon={<ICONS.video className={iconClass('nav', 'text-white', ICON_TRANSITIONS.default)} />}
              iconBg="bg-gray-600"
              onClick={onClose}
            >
              Videos
            </SidebarMediaLink>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/20"></div>

          {/* Women's Sports */}
          <div className="space-y-2">
            <SectionTitle>Women's Sports (60% Focus)</SectionTitle>
            <SidebarLink href="/womens" onClick={onClose}>
              Women's Sports Hub
            </SidebarLink>
            <SidebarSubLink href="/womens/leagues" onClick={onClose}>
              All Women's Leagues
            </SidebarSubLink>
            <SidebarSubLink href="/womens/featured" onClick={onClose}>
              Featured Content
            </SidebarSubLink>
            <SidebarSubLink href="/womens/stories" onClick={onClose}>
              Stories & Profiles
            </SidebarSubLink>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/20"></div>

          {/* Account & Premium */}
          <div className="space-y-2">
            <SectionTitle>Account & Premium</SectionTitle>
            <SidebarLink href="/account" onClick={onClose}>
              My Account
            </SidebarLink>
            <SidebarLink href="/upgrade" onClick={onClose}>
              Upgrade to Premium
            </SidebarLink>
            <SidebarLink href="/creator-portal" onClick={onClose}>
              Creator Portal
            </SidebarLink>
            <SidebarLink href="/team-portal" onClick={onClose}>
              Team Portal
            </SidebarLink>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/20"></div>

          {/* Additional Features */}
          <div className="space-y-2">
            <SidebarSmallLink href="/api" onClick={onClose}>
              API Access
            </SidebarSmallLink>
            <SidebarSmallLink href="/about" onClick={onClose}>
              About/Help
            </SidebarSmallLink>
            <SidebarSmallLink href="/feedback" onClick={onClose}>
              Feedback
            </SidebarSmallLink>
            <SidebarSmallLink href="/contact" onClick={onClose}>
              Contact
            </SidebarSmallLink>
            <SidebarSmallLink href="/newsletter" onClick={onClose}>
              Newsletter
            </SidebarSmallLink>
          </div>
        </nav>
      </div>
    </>
  );
}

interface SidebarLinkProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

function SidebarLink({ href, onClick, children }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between text-3xl font-bold text-white hover:opacity-80"
    >
      <span>{children}</span>
      <ICONS.chevronRight className={iconClass('arrow', ICON_TRANSITIONS.default)} />
    </Link>
  );
}

interface SidebarMediaLinkProps {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}

function SidebarMediaLink({ href, onClick, icon, iconBg, children }: SidebarMediaLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 text-xl font-medium text-white hover:opacity-80"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <span>{children}</span>
    </Link>
  );
}

interface SidebarSmallLinkProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

function SidebarSmallLink({ href, onClick, children }: SidebarSmallLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-base font-normal text-white/80 hover:text-white hover:underline"
    >
      {children}
    </Link>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-white/50">
      {children}
    </div>
  );
}

interface SidebarSubLinkProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

function SidebarSubLink({ href, onClick, children }: SidebarSubLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block pl-4 text-lg font-normal text-white/90 hover:text-white hover:underline"
    >
      {children}
    </Link>
  );
}

