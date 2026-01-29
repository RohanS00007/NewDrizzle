import { useEffect, useRef } from "react";
import MessagePill from "./message-pill";

export interface ConvoMessagesProps {
  authorId: string;
  content: string;
  createdAt: string;
}

interface ViewMessagesProps {
  convoMessages: ConvoMessagesProps[];
  conversationId: string;
}

export default function ViewMessages({
  convoMessages,
  conversationId,
}: ViewMessagesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [convoMessages]);

  return (
    <div
      ref={scrollContainerRef}
      className="bg-muted borderDebug mx-auto flex h-full w-full flex-col-reverse overflow-y-auto py-1"
    >
      {convoMessages.map((convoMessage) => (
        <MessagePill
          key={convoMessage.createdAt}
          classname={"border-amber-400"}
          authorId={convoMessage.authorId}
        >
          {convoMessage.content}
        </MessagePill>
      ))}
    </div>
  );
}

//convoId MessagesObj[] loop karke Message pill create karenge
