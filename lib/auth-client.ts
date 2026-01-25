import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, usernameClient, organizationClient, lastLoginMethodClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
    plugins: [
        usernameClient(),
        adminClient(),
        organizationClient(),
        lastLoginMethodClient(),
        inferAdditionalFields<typeof auth>(),
    ],
    /** The base URL of the server (optional if you're using the same domain) */
    // baseURL: process.env.BETTER_AUTH_URL as string,
})


export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
