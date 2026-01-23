"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { BetterAuthError } from "better-auth";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DeleteUser({ userId }: { userId: string }) {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const AdminDeleteUser = async (userId: string) => {
    try {
      await authClient.admin.removeUser(
        { userId },
        {
          onRequest: () => {
            setIsRequesting(true);
            toast("Requesting...", {
              description: "Wait a little",
            });
          },
          onSuccess: () => {
            setIsRequesting(false);
            toast("User deleted by Admin", {
              description: "The user has been removed successfully.",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
          },
          onError: (ctx) => {
            setIsRequesting(false);
            console.log("error", ctx);
            toast("Something went wrong while deleting user...", {
              description: "Try again",
            });
          },
        },
      );
    } catch (error) {
      console.error("Error deleting user via Admin Dashboard :", error);
      if (error instanceof BetterAuthError) {
        console.log(error.message);
      }
    }
  };

  return (
    <div>
      <Button
        onClick={() => AdminDeleteUser(userId)}
        disabled={isRequesting}
        variant="secondary"
        aria-label="admin button for permanently deleting users"
        className={cn(
          "rounded-px cursor-pointer hover:ring",
          isRequesting ? "disabled:opacity-30" : "",
        )}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}
