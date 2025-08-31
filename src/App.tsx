import { useState, useEffect } from "react";
import { ChatApp } from "./components/chat/ChatLayout";
import { Auth } from "./components/auth/Auth";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("chat");
  const { isAuthenticated, isLoading } = useAuth();

  // Simple URL-based routing
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === "/signin") {
        setCurrentPage("signin");
      } else if (path === "/signup") {
        setCurrentPage("signup");
      } else {
        setCurrentPage("chat");
      }
    };

    // Listen for browser navigation
    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange(); // Check initial route

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  const handleAuthenticated = () => {
    // Redirect to chat after authentication
    window.history.pushState({}, "", "/");
    setCurrentPage("chat");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-wp-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-wp-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-wp-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth pages or redirect to signin
  if (!isAuthenticated) {
    if (currentPage === "signup") {
      return (
        <Auth initialMode="signup" onAuthenticated={handleAuthenticated} />
      );
    }

    // Default to signin for unauthenticated users
    if (currentPage !== "signin") {
      window.history.pushState({}, "", "/signin");
      setCurrentPage("signin");
    }

    return <Auth initialMode="signin" onAuthenticated={handleAuthenticated} />;
  }

  // If authenticated but trying to access auth pages, redirect to chat
  if (currentPage === "signin" || currentPage === "signup") {
    window.history.pushState({}, "", "/");
    setCurrentPage("chat");
  }

  // Show chat app for authenticated users
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
