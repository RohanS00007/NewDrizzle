import { db } from "@/db/drizzle";
import { blockedAccounts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
// export const runtime = "edge"

export async function POST(request: NextRequest) {
    const { blockAccountUserId } = await request.json();

    try {
        const currentUserSession = await auth.api.getSession({
            headers: await headers(),
        });

        if (!currentUserSession) {
            return Response.json(
                {
                    success: false,
                    message: "User is not authenticated",
                },
                { status: 403 },
            );
        }

        if (!blockAccountUserId) {
            return Response.json(
                {
                    success: false,
                    message: "Please provide userId of account that you want to block",
                },
                { status: 400 },
            );
        }

        const currentUser = currentUserSession?.user.id;

        await db.insert(blockedAccounts).values({
            id: randomUUID(),
            blockedBy: currentUser,
            blocked: blockAccountUserId,
        });
    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong while blocking user",
            },
            { status: 500 },
        );
    }
}