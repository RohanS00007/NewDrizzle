import { db } from "@/db/drizzle"
import { message } from "@/db/schema"
import { auth } from "@/lib/auth"
import { randomUUID } from "crypto"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
export const runtime = "edge";

// 

export async function POST (request: NextRequest) {
    try {

        const {msgContent, conversationId} = await request.json()

        if(!(msgContent || conversationId)){
             return Response.json({
            success: false,
            message: "Bad request, payload missing data"
        }, {status: 400})
        }

        const currentUserSession = await auth.api.getSession({
            headers: await headers()
        })

        if(!currentUserSession){
            return Response.json({
            success: false,
            message: "Only authenticated users can reply"
        }, {status: 401})
        }

        await db.insert(message).values({
            id: randomUUID(),
            conversationId: conversationId,
            authorId: currentUserSession?.user.id,
            content: msgContent,
            isRead: false
        })


         return Response.json({
            success: true,
            message: "Message sent succesfully"
        }, {status: 201})

        
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Something went wrong while replying back, please try again"
        }, {status: 500})
        
    }
}