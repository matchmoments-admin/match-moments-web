'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Headphones, Play, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ease-in-out"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-200 ease-in-out rounded-l-[16px] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
            <h2 className="text-2xl font-bold text-black">Menu</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors duration-150"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Content */}
          <nav className="flex-1 p-6" aria-label="Main navigation">
            {/* Main Categories */}
            <div className="space-y-4 mb-8">
              <button className="w-full flex items-center justify-between text-left text-base font-bold text-black hover:opacity-70 transition-opacity duration-150 py-2">
                <span>Sports</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button className="w-full flex items-center justify-between text-left text-base font-bold text-black hover:opacity-70 transition-opacity duration-150 py-2">
                <span>Pop Culture</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button className="w-full flex items-center justify-between text-left text-base font-bold text-black hover:opacity-70 transition-opacity duration-150 py-2">
                <span>All Topics</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Content Types */}
            <div className="space-y-4 border-t border-[#E5E7EB] pt-6">
              <Link
                href="/podcasts"
                className="flex items-center gap-3 text-base font-normal text-black hover:underline transition-all duration-150 py-2"
                onClick={onClose}
              >
                <Headphones className="h-5 w-5 text-orange-500" />
                <span>Podcasts</span>
              </Link>
              <Link
                href="/videos"
                className="flex items-center gap-3 text-base font-normal text-black hover:underline transition-all duration-150 py-2"
                onClick={onClose}
              >
                <Play className="h-5 w-5 text-blue-500" />
                <span>Videos</span>
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}

