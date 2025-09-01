import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { EmailIcon, LockIcon, UserIcon } from "../chat/Icons";

interface SignUpProps {
  onSignUp?: (name: string, email: string, password: string) => Promise<void>;
  onSwitchToSignIn?: () => void;
  error?: string | null;
  isLoading?: boolean;
}

export function SignUp({
  onSignUp,
  onSwitchToSignIn,
  error: externalError,
  isLoading: externalLoading,
}: SignUpProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSubmitting = loading || externalLoading;
  const displayError = error || externalError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // password must have at least one number, one uppercase letter, one lowercase letter and one special character
    const passwordStrength =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/.test(password);
    if (!passwordStrength) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (onSignUp) {
        await onSignUp(name, email, password);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Sign up:", { name, email, password });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wp-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-wp-green rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <span className="text-2xl md:text-3xl">💬</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-wp-text-primary mb-2">
            Join WhatsApp
          </h1>
          <p className="text-sm md:text-base text-wp-text-secondary px-4">
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <div className="bg-wp-header-bg rounded-lg p-6 md:p-8 border border-wp-border mx-4 md:mx-0">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-wp-text-primary mb-2">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={setName}
                icon={<UserIcon />}
                required
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={setPassword}
                icon={<LockIcon />}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wp-text-primary mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                icon={<LockIcon />}
                required
              />
            </div>

            {displayError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {displayError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-wp-border text-center">
            <p className="text-wp-text-secondary text-sm">
              Already have an account?{" "}
              <button
                onClick={onSwitchToSignIn}
                className="text-wp-green hover:underline font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-6 md:mt-8 px-4">
          <p className="text-xs text-wp-text-secondary">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
