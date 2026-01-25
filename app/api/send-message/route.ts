//will receive message content from the message form and receiver username from 

import { db } from "@/db/drizzle";
import { conversation, message, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { username, msgContent } = body;

        // Validate input
        if (!username || !msgContent) {
            return Response.json({
                success: false,
                message: "Username and message content are required"
            }, { status: 400 });
        }


        // Get current session
        const userSession = await auth.api.getSession({
            headers: await headers()
        });

        if (!userSession) {
            return Response.json({
                success: false,
                message: "No current session found"
            }, { status: 401 });
        }

        const senderId = userSession.user.id;
        // console.log(senderId)

        // Find receiver by username
        const [receiver] = await db
            .select({ id: user.id, isAcceptingMessages: user.isAcceptingMessages })
            .from(user)
            .where(eq(user.username, username))
            .limit(1);


        if (!receiver) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // console.log("Receiver", receiver)

        // Check if receiver is accepting messages
        if (!receiver.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "This user is not accepting messages"
            }, { status: 403 });
        }

        // Prevent sending message to self
        if (senderId === receiver.id) {
            return Response.json({
                success: false,
                message: "Cannot send message to yourself"
            }, { status: 400 });
        }

        const receiverId = receiver.id;
        // console.log(receiverId)

        // Find existing conversation between sender and receiver (in either direction)
        const [existingConversation] = await db
            .select({ id: conversation.id })
            .from(conversation)
            .where(
                or(
                    and(
                        eq(conversation.senderId, senderId),
                        eq(conversation.receiverId, receiverId)
                    ),
                    and(
                        eq(conversation.senderId, receiverId),
                        eq(conversation.receiverId, senderId)
                    )
                )
            )
            .limit(1);

        let conversationId: string;

        if (existingConversation) {
            // Use existing conversation
            conversationId = existingConversation.id;

            // Update conversation's updatedAt timestamp
            await db
                .update(conversation)
                .set({ updatedAt: new Date() })
                .where(eq(conversation.id, conversationId));
        } else {
            // Create new conversation
            const [newConversation] = await db
                .insert(conversation)
                .values({
                    id: randomUUID(),
                    senderId: senderId,
                    receiverId: receiverId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning({ id: conversation.id });

            conversationId = newConversation.id;
        }

        // Create the message
        const [newMessage] = await db
            .insert(message)
            .values({
                id: randomUUID(),
                conversationId: conversationId,
                authorId: senderId,
                content: msgContent,
                isRead: false,
                createdAt: new Date(),
            })
            .returning();

        return Response.json({
            success: true,
            message: "Message sent successfully",
            data: {
                messageId: newMessage.id,
                conversationId: conversationId,
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Error sending message:", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}