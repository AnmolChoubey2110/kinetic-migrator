import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "brand" | "primary";

type ButtonProps = {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  brand:
    "bg-brand-blue text-white shadow-[0_0_10px_rgba(0,143,211,0.2)] hover:bg-opacity-90",
  primary:
    "bg-primary-container text-on-primary-container shadow-[0_0_10px_rgba(32,152,221,0.2)] hover:bg-primary",
};

export function Button({
  children,
  fullWidth = false,
  variant = "brand",
  className = "",
  type = "button",
  disabled = false,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-DEFAULT py-3 font-headline-sm text-headline-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
        variantClasses[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
