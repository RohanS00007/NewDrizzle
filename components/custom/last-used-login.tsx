"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GitHubBtn from "./github-client";
import GoogleClientBtn from "./google-client";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

type LoginMethod = "github" | "google" | "email" | null;

/**
 * Fetches the last login method from Better Auth cookies
 * Better Auth stores this in the `better-auth.last-method` cookie
 * Format: "method.<provider>" e.g., "method.github", "method.google"
 */
function getLastLoginMethodFromCookie(): LoginMethod {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "better-auth.last-method") {
      const decodedValue = decodeURIComponent(value);
      // Better Auth stores the method as "method.<provider>"
      const methodMatch = decodedValue.match(/^method\.(\w+)$/);
      if (methodMatch) {
        const method = methodMatch[1];
        if (["github", "google", "email"].includes(method)) {
          return method as LoginMethod;
        }
      }
      // Also handle direct provider values
      if (["github", "google", "email"].includes(decodedValue)) {
        return decodedValue as LoginMethod;
      }
    }
  }
  return null;
}

interface LastUsedLoginProps {
  className?: string;
  showLabel?: boolean;
  onMethodSelect?: (method: LoginMethod) => void;
}

/**
 * LastUsedLogin Component
 *
 * Displays the user's last used login method fetched from browser cookies.
 * This component helps users quickly sign in with their previously used authentication method.
 *
 * @example
 * ```tsx
 * <LastUsedLogin
 *   showLabel={true}
 *   onMethodSelect={(method) => console.log(method)}
 * />
 * ```
 */
export default function LastUsedLogin({
  className,
  showLabel = true,
  onMethodSelect,
}: LastUsedLoginProps) {
  const [lastMethod, setLastMethod] = useState<LoginMethod>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the last login method from cookies
    const method = getLastLoginMethodFromCookie();
    setLastMethod(method);
    setIsLoading(false);

    if (method && onMethodSelect) {
      onMethodSelect(method);
    }
  }, [onMethodSelect]);

  if (isLoading || !lastMethod) {
    return null;
  }

  const getMethodLabel = (method: LoginMethod) => {
    switch (method) {
      case "github":
        return "GitHub";
      case "google":
        return "Google";
      case "email":
        return "Email";
      default:
        return "Last Method";
    }
  };

  const renderLoginButton = () => {
    switch (lastMethod) {
      case "github":
        return <GitHubBtn />;
      case "google":
        return <GoogleClientBtn />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {showLabel && (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Last login method:</p>
          <span className="text-foreground text-sm font-medium">
            {getMethodLabel(lastMethod)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">{renderLoginButton()}</div>

      {showLabel && (
        <>
          <Separator className="my-2" />
          <p className="text-muted-foreground text-center text-xs">
            Or continue with another method below
          </p>
        </>
      )}
    </div>
  );
}
