import { useState } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

interface AuthProps {
  initialMode?: "signin" | "signup";
  onAuthenticated?: (user: { name?: string; email: string }) => void;
}

export function Auth({ initialMode = "signin", onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  const handleSignIn = async (email: string, password: string) => {
    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation (in a real app, you'd validate credentials with your backend)
    if (password.length < 6) {
      throw new Error("Invalid credentials");
    }

    if (onAuthenticated) {
      onAuthenticated({ email });
    }
  };

  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    // Simulate account creation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation (in a real app, you'd create the account with your backend)
    if (password.length < 6) {
      throw new Error("Password too short");
    }

    if (onAuthenticated) {
      onAuthenticated({ name, email });
    }
  };

  if (mode === "signup") {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => setMode("signin")}
      />
    );
  }

  return (
    <SignIn
      onSignIn={handleSignIn}
      onSwitchToSignUp={() => setMode("signup")}
    />
  );
}
