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
    <div className="flex h-screen min-h-screen items-center justify-center">
      <Card className="relative mx-auto flex h-screen w-full min-w-[60%] flex-col rounded-none bg-black text-white md:h-2/3 md:w-60">
        <CardHeader className="bg-black text-white">
          <CardTitle>{authData?.data?.user.name}</CardTitle>
          <CardDescription>{`@${authData?.data?.user.username}`}</CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent className="h-full flex-1 overflow-hidden px-2 pb-30">
          <ViewMessages
            convoMessages={messages}
            conversationId={conversationId}
          />
        </CardContent>
        <CardFooter className="absolute right-0 bottom-0 left-0 border-none bg-black">
          <ReplyBack conversationId={conversationId} />
        </CardFooter>
      </Card>
    </div>
  );
}

export function MessageBoxSkeleton() {
  return (
    <div className="flex h-screen min-h-screen items-center justify-center">
      <Card className="relative mx-auto flex h-screen w-full min-w-[60%] flex-col rounded-none md:h-2/3 md:w-60">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-10 w-50" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-5 w-50" />
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent className="h-full flex-1 overflow-hidden px-1 pb-30">
          <Skeleton className="h-100 w-full" />
        </CardContent>
        <CardFooter className="absolute right-0 bottom-0 left-0 border-none">
          <Skeleton className="h-20 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
