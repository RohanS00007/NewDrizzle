"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import githubImage from "@/public/github-logo.png";
import { cn } from "@/lib/utils";
import { useAuthInfo } from "./auth-query-provider";
import { authClient } from "@/lib/auth-client";
import { neon } from '@neondatabase/serverless';

const gitHubLogin = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
  });
};

export default function GitHubBtn() {
  const authInfo = useAuthInfo();
  const lastLoginMethod = authInfo?.data?.user.lastLoginMethod;
  return (
    <Button
      onClick={gitHubLogin}
      className={cn(
        "relative flex cursor-pointer hover:scale-105 active:scale-95",
        lastLoginMethod === "github"
          ? "after:absolute after:top-0.5 after:right-0.5 after:z-10 after:text-xs after:text-red-500 after:content-['*']"
          : "",
      )}
      variant={"outline"}
    >
      <Image src={githubImage} alt="Github logo" width={20} height={20} />
      <p>Github</p>
    </Button>
  );
}
