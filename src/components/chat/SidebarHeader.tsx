import {
  DotsIcon,
  SearchIcon,
  ArchiveIcon,
  CameraIcon,
  NewChatIcon,
} from "./Icons";

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: "all" | "unread" | "favorites" | "groups";
  onFilterChange: (filter: "all" | "unread" | "favorites" | "groups") => void;
}

export function SidebarHeader({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: SidebarHeaderProps) {
  return (
    <div className="bg-wp-header-bg">
      <div className="h-16 flex items-center justify-between px-4 text-wp-text-primary">
        <h1 className="font-medium text-xl">WhatsApp</h1>
        <div className="flex items-center gap-2">
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
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wp-text-secondary">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full pl-12 pr-4 py-3 text-sm rounded-lg outline-none bg-wp-dark-bg border border-wp-border focus:border-wp-green text-wp-text-primary placeholder-wp-text-secondary"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 pb-3">
        <div className="flex gap-1">
          {(["all", "unread", "favorites", "groups"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-wp-green text-white"
                  : "text-wp-text-secondary hover:bg-wp-hover"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Archived Section */}
      <div className="px-3 pb-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-wp-text-secondary/20">
            <ArchiveIcon />
          </div>
          <span className="text-sm font-medium">Archived</span>
        </button>
      </div>
    </div>
  );
}
