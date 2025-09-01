import { useState } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { useAuth } from "../../context/AuthContext";

interface AuthProps {
  initialMode?: "signin" | "signup";
  onAuthenticated?: (user: { name?: string; email: string }) => void;
}

export function Auth({ initialMode = "signin", onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const { login, register, error, isLoading, clearError } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    try {
      clearError();
      await login(email, password);

      if (onAuthenticated) {
        onAuthenticated({ email });
      }
    } catch (error) {
      // Error is handled by the auth context
      throw error;
    }
  };

  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      clearError();
      await register(name, email, password);

      if (onAuthenticated) {
        onAuthenticated({ name, email });
      }
    } catch (error) {
      // Error is handled by the auth context
      throw error;
    }
  };

  if (mode === "signup") {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => {
          clearError();
          setMode("signin");
        }}
        error={error}
        isLoading={isLoading}
      />
    );
  }

  return (
    <SignIn
      onSignIn={handleSignIn}
      onSwitchToSignUp={() => {
        clearError();
        setMode("signup");
      }}
      error={error}
      isLoading={isLoading}
    />
  );
}
