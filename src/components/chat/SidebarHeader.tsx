import { DotsIcon, SearchIcon, CameraIcon, NewChatIcon } from "./Icons";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { StartChatModal } from "./StartChatModal";
import { apiService } from "../../services/api";
import type { Chat } from "../../services/api";

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: "all" | "unread" | "favorites" | "groups";
  onFilterChange: (filter: "all" | "unread" | "favorites" | "groups") => void;
  onChatStarted?: (chat?: Chat) => void;
}

export function SidebarHeader({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onChatStarted,
}: SidebarHeaderProps) {
  const { logout, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showStartChatModal, setShowStartChatModal] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleStartChat = async (email: string, message?: string) => {
    setIsStartingChat(true);
    try {
      const response = await apiService.startChatByEmail({
        recipientEmail: email,
        initialMessage: message,
      });

      // Notify parent component with the new chat
      onChatStarted?.(response.chat);
    } catch (error: any) {
      console.error("Failed to start chat:", error);
      throw error; // Re-throw to let modal handle the error display
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="bg-wp-header-bg">
      {/* Main Header */}
      <div className="h-[60px] flex items-center justify-between px-4 text-wp-text-primary">
        <div>
          <h1 className="font-medium text-[19px]">WhatApp</h1>
          {user && (
            <p className="text-[12px] text-wp-text-secondary">
              {user.name} ({user.email})
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 relative">
          <button className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
            <CameraIcon />
          </button>
          <button
            onClick={() => setShowStartChatModal(true)}
            className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary"
            title="Start new chat"
          >
            <NewChatIcon />
          </button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary"
          >
            <DotsIcon />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-wp-header-bg border border-wp-border rounded-lg shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-wp-text-primary hover:bg-wp-hover rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
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
          {(["All", "Unread", "favorites", "Groups"] as const).map((filter) => (
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
          ))}
        </div>
      </div>

      {/* Start Chat Modal */}
      <StartChatModal
        isOpen={showStartChatModal}
        onClose={() => setShowStartChatModal(false)}
        onSubmit={handleStartChat}
        isLoading={isStartingChat}
      />
    </div>
  );
}
