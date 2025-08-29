import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../chat/Icons";

interface InputProps {
  type?: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  disabled = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wp-text-secondary">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full ${
            icon ? "pl-12" : "pl-4"
          } pr-12 py-4 text-base rounded-lg outline-none bg-wp-input-bg border border-wp-border focus:border-wp-green text-wp-text-primary placeholder-wp-text-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-wp-text-secondary hover:text-wp-text-primary transition-colors"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}
