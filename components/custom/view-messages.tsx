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
      className="mx-auto flex h-full w-full flex-col overflow-y-auto bg-green-200 py-1 [scrollbar-color:green_lightgreen]"
    >
      <div>
        <p className="text-md mx-auto py-5 text-center font-bold text-green-800 md:text-xl">
          Someone just started an anonymous conversation
        </p>
      </div>
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
