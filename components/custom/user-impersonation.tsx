"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { UserCog2 } from "lucide-react";

interface ImpersonateUserProps {
  userId: string;
}

export default function ImpersonateUser({ userId }: ImpersonateUserProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleImpersonateUser = async () => {
    try {
      const { data, error } = await authClient.admin.impersonateUser(
        {
          userId,
        },
        {
          onRequest: () => {
            toast.success("Requesting...");
          },
          onError(context) {
            const text = context.response.statusText;
            toast.error(text as string);
          },
          onSuccess: () => {
            toast.success("Impersonating User...");
            queryClient.invalidateQueries({ queryKey: ["betterAuth"] });
          },
        },
      );
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to impersonate user:", error);
    }
  };

  return (
    <Button onClick={handleImpersonateUser} variant="outline" size="sm">
      <UserCog2 />
    </Button>
  );
}
