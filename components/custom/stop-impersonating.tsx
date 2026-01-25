
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthInfo } from "./auth-query-provider";

export default function CancelImpersonationBtn() {
  // const queryClient = useQueryClient();
  const router = useRouter();
  const authData = useAuthInfo();

  const stopImpersonation = async () => {
    await authClient.admin.stopImpersonating({
      fetchOptions: {
        onSuccess: async () => {
          router.push("/admin");
          toast.success("Succesfully stopped user impersonation");
          // await queryClient.invalidateQueries({ queryKey: ["betterAuth"] });
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

  // Only show button if user is currently impersonating

  return (
    <Button
      onClick={stopImpersonation}
      variant="outline"
      size="sm"
      className="relative bottom-3 left-2 mt-3 ml-3 cursor-pointer ring transition-all hover:bg-blue-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-950"
      aria-label="Stop impersonating user"
    >
      Stop Impersonation
    </Button>
  );
}
