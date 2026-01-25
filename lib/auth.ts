import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { schema } from "@/db/schema";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";

import {
    admin,
    lastLoginMethod,
    createAuthMiddleware,
    openAPI,
    username,
    organization,
} from "better-auth/plugins";

const origins = [
    process.env.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.9:3000"
    
].filter(Boolean) as string[];

export const auth = betterAuth({
     

    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    
    trustedOrigins: origins.map(url => url.replace(/\/$/, "")),



    user: {
        additionalFields: {
            isAcceptingMessages: {
                type: "boolean",
                required: true,
                defaultValue: true,
                returned: true,
            },
        },
    },

    emailAndPassword: {
        enabled: true,
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    if (user.emailVerified) {
                        const username = user.email.split("@")[0];
                        return { data: { ...user, username } };
                    }
                    return { data: user };
                    // Return user even if email not verified
                },
            },
        },
    },

    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                if (!ctx.body?.email.endsWith("@gmail.com")) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Email must end with @gmail.com",
                    });
                }
            }
        }),
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache duration in seconds // 5 min
        },
    },

    experimental: { joins: true },

    plugins: [
        admin(),
        openAPI(),
        lastLoginMethod({
            storeInDatabase: true,
            // cookieName: "Better_Drizzle.last_login_method_used",
        }),
        organization({ allowUserToCreateOrganization: false }),
        username({
            minUsernameLength: 8,
            maxUsernameLength: 20,
            usernameValidator: (username) => {
                if (username === "admin") return false;
                return true;
            },
        }),
        nextCookies(),
    ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
