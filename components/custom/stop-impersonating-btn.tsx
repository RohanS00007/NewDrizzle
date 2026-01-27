"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthInfo } from "./auth-query-provider";
import { toast } from "sonner";

export default function StopImpersonationBtn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const authData = useAuthInfo();
  const handleStopImpersonation = async () => {
    await authClient.admin.stopImpersonating({
      fetchOptions: {
        onSuccess: async () => {
          router.push("/admin");
          toast.success("Stopped impersonating user.");
          await queryClient.invalidateQueries({ queryKey: ["betterAuth"] });
          authData?.refetch();
        },
        onError: (ctx) => {
          console.log(ctx.response.statusText);
          toast.error("Error occured while stopping user impersonation", {
            description: ctx.error.message as string,
          });
        },
      },
    });
  };

  return (
    <Button onClick={handleStopImpersonation} className={"tsxt-sm"}>
      Impersonating X
    </Button>
  );
}
