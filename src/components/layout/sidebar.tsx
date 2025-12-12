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

        {/* Menu Content */}
        <nav className="mt-16 space-y-6">
          {/* Main Categories */}
          <SidebarLink href="/sports" onClick={onClose}>
            Sports
          </SidebarLink>
          <SidebarLink href="/pop-culture" onClick={onClose}>
            Pop Culture
          </SidebarLink>
          <SidebarLink href="/topics" onClick={onClose}>
            All Topics
          </SidebarLink>

          {/* Divider */}
          <div className="my-8 border-t border-white/20"></div>

          {/* Media Links with Icons */}
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

          {/* Additional Links */}
          <div className="mt-12 space-y-4 border-t border-white/20 pt-8">
            <SidebarSmallLink href="/about" onClick={onClose}>
              About
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

