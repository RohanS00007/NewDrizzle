"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

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
  });

  if (status === "pending")
    return <p className="text-green-500">Loading active conversations</p>;

  if (status === "error") return <p>{error.message}</p>;

  return (
    <div>
      <ul>
        {data?.map((convo, index) => (
          <li key={index}>
            <Link
              className="ring ring-fuchsia-400"
              href={`/dashboard/conversation/${convo.id}`}
            >
              {convo.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
