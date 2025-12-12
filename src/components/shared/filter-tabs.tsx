'use client';

interface FilterTabsProps {
  filters: { id: string; label: string }[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export function FilterTabs({ filters, activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            px-4 py-2 rounded-[20px] text-base font-normal transition-all duration-150
            ${
              activeFilter === filter.id
                ? 'bg-black text-white'
                : 'bg-white text-black border border-[#E5E7EB] hover:bg-gray-50'
            }
          `}
          aria-pressed={activeFilter === filter.id}
        >
          {filter.label}
        </button>
      ))}
      <button
        className="ml-auto flex items-center gap-2 px-4 py-2 text-base font-normal text-black hover:underline transition-all duration-150"
        aria-label="Filter options"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filter</span>
      </button>
    </div>
  );
}

