// converatioId need to fetched from url,
// based on that we will fetch all those message table rows which matches with this particular conversationId,

import { db } from "@/db/drizzle";
import { message } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

// we will arrange and layout messages in whatsApp ways

export async function POST(request: NextRequest) {
  try {
    const { conversationId } = await request.json();

    // console.log(conversationId)

    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = userSession?.user.id;
    // console.log(userId)

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 },
      );
    }

    if (!conversationId) {
      return Response.json(
        {
          success: false,
          message: "Conversation ID doesn't exist",
        },
        { status: 500 },
      );
    }

    const data = await db
      .select({
        authorId: message.authorId,
        content: message.content,
        createdAt: message.createdAt,
      })
      .from(message)
      .where(eq(message.conversationId, conversationId));

    // console.log(data)  

    if (data.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messsage exists in this conversation",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Fetched all messages for this conversationId",
        convoMessages: data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
