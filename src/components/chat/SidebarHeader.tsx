import { DotsIcon, SearchIcon, CameraIcon, NewChatIcon } from "./Icons";

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: "all" | "unread" | "favourites" | "groups";
  onFilterChange: (filter: "all" | "unread" | "favourites" | "groups") => void;
}

export function SidebarHeader({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: SidebarHeaderProps) {
  return (
    <div className="bg-wp-header-bg">
      {/* Main Header */}
      <div className="h-[60px] flex items-center justify-between px-4 text-wp-text-primary">
        <h1 className="font-medium text-[19px]">WhatsApp</h1>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
            <CameraIcon />
          </button>
          <button className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
            <NewChatIcon />
          </button>
          <button className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
            <DotsIcon />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pb-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wp-text-secondary">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full pl-10 pr-4 py-2 text-[14px] rounded-lg outline-none bg-wp-input-bg border-0 text-wp-text-primary placeholder-wp-text-secondary"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 pb-2">
        <div className="flex gap-0.5">
          {(["All", "Unread", "Favourites", "Groups"] as const).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter.toLowerCase() as any)}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 ${
                  activeFilter === filter.toLowerCase()
                    ? "bg-wp-green text-white"
                    : "text-wp-text-secondary hover:bg-wp-hover"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
