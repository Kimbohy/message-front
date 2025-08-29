import { useState, useEffect } from "react";
import { ChatApp } from "./components/chat/ChatLayout";
import { Auth } from "./components/auth/Auth";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("chat");

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

  const handleAuthenticated = (user: { name?: string; email: string }) => {
    console.log("User authenticated:", user);
    // Redirect to chat after authentication
    window.history.pushState({}, "", "/");
    setCurrentPage("chat");
  };

  // Show auth pages based on URL
  if (currentPage === "signin") {
    return <Auth initialMode="signin" onAuthenticated={handleAuthenticated} />;
  }

  if (currentPage === "signup") {
    return <Auth initialMode="signup" onAuthenticated={handleAuthenticated} />;
  }

  // Show chat app (default)
  return <ChatApp />;
}
