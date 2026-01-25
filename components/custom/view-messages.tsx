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
      className="bg-muted mx-auto flex max-h-50 w-full flex-col overflow-y-scroll border-t-2 border-b-2 border-l-2 border-green-600 px-2 py-1 [scrollbar-color:lightgreen_green]"
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
