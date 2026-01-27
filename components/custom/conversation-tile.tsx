"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

const fetchConversations = async () => {
  const {
    data: { data },
  } = await axios.get("/api/get-conversation");
  // console.log(data[0].id);
  return data;
};

interface FetchConversationsType {
  id: string;
}

export default function ConversationTile() {
  const { data, status, error } = useQuery<FetchConversationsType[]>({
    queryKey: ["get-convo"],
    queryFn: fetchConversations,
    staleTime: Infinity,
    retry: false,
  });

  if (status === "pending") return <SkeletonDemo />;

  if (status === "error")
    return <p>{"No active conversations to fetch or something went wrong"}</p>;

  let counter = 1;
  return (
    <div className="mt-3">
      <ul className="grid w-full grid-cols-1 gap-1 md:w-4/5 md:grid-cols-2">
        {data?.map((convo, index) => (
          <li
            key={index}
            className="mb-2 border-2 border-neutral-500 p-4 hover:shadow-md"
          >
            <Link href={`/dashboard/conversation/${convo.id}`}>
              <div>
                <p>{`Conversation ${counter++}`}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkeletonDemo() {
  return (
    <div className="mt-3">
      <ul className="grid w-full grid-cols-1 gap-2 md:w-4/5 md:grid-cols-2 md:gap-1">
        <Skeleton className="h-15 w-full md:w-100" />
        <Skeleton className="h-15 w-full md:w-100" />
      </ul>
    </div>
  );
}
