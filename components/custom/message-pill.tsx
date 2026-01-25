"use client";

import { cn } from "@/lib/utils";
import { useAuthInfo } from "./auth-query-provider";

interface MessagePillProps {
  authorId: string;
  children: React.ReactNode;
  classname?: string;
}

export default function MessagePill({
  authorId,
  children,
  classname,
}: MessagePillProps) {
  const authInfo = useAuthInfo();
  const isOwnMessage = authorId === authInfo?.data?.user.id;

  return (
    <div className="flex w-full">
      <div
        className={cn(
          classname,
          "mb-1 max-w-2/3 min-w-3/5 py-2 px-3 text-white",
          isOwnMessage
            ? "mr-0 ml-auto rounded-l-xl bg-green-700 pl-2"
            : "mr-auto rounded-r-xl bg-neutral-400 pl-1",
        )}
      >
        {children}
      </div>
    </div>
  );
}
