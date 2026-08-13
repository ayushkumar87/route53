import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "default", ...props }, ref) => {
    const variants = {
      primary:
        "bg-[var(--color-aws-primary)] text-white hover:bg-[var(--color-aws-primary-hover)] border-transparent",
      secondary:
        "bg-white text-[var(--color-aws-text)] border border-[var(--color-aws-secondary-border)] hover:bg-[var(--color-aws-secondary-hover)]",
      danger:
        "bg-[var(--color-aws-danger)] text-white hover:bg-[var(--color-aws-danger-hover)] border-transparent",
      ghost: "hover:bg-[var(--color-aws-secondary-hover)] text-[var(--color-aws-text)] border-transparent",
      outline: "border border-[var(--color-aws-border)] bg-transparent hover:bg-[var(--color-aws-secondary-hover)] text-[var(--color-aws-text)]",
    };

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-10 px-8",
      icon: "h-9 w-9",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
