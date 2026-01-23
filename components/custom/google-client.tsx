"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import googleImage from "@/public/search.png";
import { cn } from "@/lib/utils";
import { useAuthInfo } from "./auth-query-provider";
import { authClient } from "@/lib/auth-client";

const googleLogin = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
    
  });
};

export default function GoogleClientBtn() {
  const authInfo = useAuthInfo();
  const lastLoginMethod = authInfo?.data?.user.lastLoginMethod;
  return (
    <Button
      onClick={googleLogin}
      className={cn(
        "flex cursor-pointer hover:scale-105 active:scale-95",
        lastLoginMethod === "google"
          ? "after:ml-0.5 after:text-red-500 after:content-['*']"
          : "",
      )}
      variant={"outline"}
    >
      <Image src={googleImage} alt="Google logo" width={20} height={20} />
      <p>Google</p>
    </Button>
  );
}
