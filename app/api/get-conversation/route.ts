import { db } from "@/db/drizzle";
import { conversation } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, or } from "drizzle-orm";
import { headers } from "next/headers";
export const runtime = "edge";

export async function GET() {
  try {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = userSession?.user.id;

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 } 
      );
    }

    const activeConversation = await db
      .select({ id: conversation.id })
      .from(conversation)
      .where(
        or(
          eq(conversation.receiverId, userId),
          eq(conversation.senderId, userId)
        )
      );

      
    if (activeConversation.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No active conversations found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Fetched all active conversations",
        data: activeConversation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_CONVERSATIONS_ERROR:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error while fetching conversations",
      },
      { status: 500 }
    );
  }
}