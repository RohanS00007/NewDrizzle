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
import { Skeleton } from "@/components/ui/skeleton";

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

  if (status === "pending") return <MessageBoxSkeleton />;
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

export function MessageBoxSkeleton() {
  return (
    <div className="flex h-screen max-h-screen items-center justify-center">
      <Card className="mx-auto flex w-full min-w-[50%] flex-col md:w-60">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-10 w-50" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-5 w-50" />
          </CardDescription>
          <CardAction>
            <Skeleton className="h-5 w-20" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-50 w-full" />
        </CardContent>
        <CardFooter className="border-t-0 bg-none">
          <Skeleton className="h-20 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
