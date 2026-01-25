"use client";
import ViewMessages from "@/components/custom/view-messages";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthInfo } from "@/components/custom/auth-query-provider";
import ReplyBack from "@/components/custom/reply-back";

export default function Conversation() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const authData = useAuthInfo();

  const getMessagesByConvoId = async () => {
    const response = await axios.post("/api/get-messages", {
      conversationId: conversationId,
    });
    // console.log("Response is here", response);
    return response?.data.convoMessages;
  };
  const {
    data: messages,
    status,
    error,
  } = useQuery({
    queryKey: ["get-messages", conversationId],
    queryFn: getMessagesByConvoId,
    staleTime: Infinity,
    retry: 1,
  });

  if (status === "pending") return <p>Loading messages</p>;
  if (status === "error") return <p>{error.message}</p>;

  return (
    <div className="flex h-screen max-h-screen items-center justify-center">
      <Card className="mx-auto flex w-full min-w-[50%] flex-col md:w-60">
        <CardHeader>
          <CardTitle>{authData?.data?.user.name}</CardTitle>
          <CardDescription>{`@${authData?.data?.user.username}`}</CardDescription>
          <CardAction>Refetch</CardAction>
        </CardHeader>
        <CardContent>
          <ViewMessages
            convoMessages={messages}
            conversationId={conversationId}
          />
        </CardContent>
        <CardFooter>
          <ReplyBack conversationId={conversationId} />
        </CardFooter>
      </Card>
    </div>
  );
}