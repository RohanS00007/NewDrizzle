"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

const MotionButton = motion.create(Button);

export default function SignOutBtn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await authClient.signOut();
  };

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onError: (error) => {
      toast.error("Sign Out failed.", {
        description: error.message,
      });
    },
    onSuccess: () => {
      router.push("/sign-in");
      queryClient.invalidateQueries({ queryKey: ["betterAuth"] });
    },
  });

  return (
    <MotionButton
      className="group cursor-pointer bg-black font-bold text-blue-600 active:bg-blue-100"
      onClick={() => signOutMutation.mutate()}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      disabled={signOutMutation.isPending}
    >
      <LogOutIcon className="size-5" />
      <span className="hidden text-base group-hover:text-white md:block md:text-sm">
        Sign Out
      </span>
    </MotionButton>
  );
}
