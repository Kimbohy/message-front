import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { EmailIcon, LockIcon } from "../chat/Icons";

interface SignInProps {
  onSignIn?: (email: string, password: string) => Promise<void>;
  onSwitchToSignUp?: () => void;
}

export function SignIn({ onSignIn, onSwitchToSignUp }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (onSignIn) {
        await onSignIn(email, password);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Sign in:", { email, password });
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wp-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-wp-green rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-3xl font-light text-wp-text-primary mb-2">
            Welcome to WhatsApp
          </h1>
          <p className="text-wp-text-secondary">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <div className="bg-wp-header-bg rounded-lg p-8 border border-wp-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-wp-text-primary mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                icon={<EmailIcon />}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wp-text-primary mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                icon={<LockIcon />}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-wp-border text-center">
            <p className="text-wp-text-secondary text-sm">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignUp}
                className="text-wp-green hover:underline font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-8">
          <p className="text-xs text-wp-text-secondary">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
