"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signInWithGoogle = async () => {
  await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/dashboard",
    },
  });
};


export const signInWithGitHub = async () => {
  await auth.api.signInSocial({
    body: {
      provider: "github",
      callbackURL: "/dashboard",
    },
  });
};


export const getUserSession = async () => {
    const data = await auth.api.getSession({
        headers: await headers()
    })
    return data;
}
