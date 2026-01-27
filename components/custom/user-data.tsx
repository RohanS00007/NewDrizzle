"use client";
import Image from "next/image";
import { useAuthInfo } from "./auth-query-provider";
import StopImpersonationBtn from "./stop-impersonating-btn";
// import { LoaderCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserData() {
  const value = useAuthInfo();

  if (value?.isLoading) return <SkeletonDemo />;
  if (value?.isError) return <p>{value.error?.message}</p>;

  if (value?.data) {
    return (
      <div className="mb-3 flex w-60 max-w-80 items-center justify-center px-1 py-2 md:py-5">
        <div>
          {value.data?.user.image ? (
            <Image
              className="size-15 rounded-full"
              src={value.data?.user?.image}
              height={50}
              width={50}
              alt="profile picture"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-black text-2xl text-white">
              {value.data?.user.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="pl-3">
          <p className="text-2xl font-bold text-black [font-variant:small-caps]">
            {value.data?.user.name}
          </p>
          <p className="pl-1 text-sm text-neutral-600">
            {" "}
            {`@${value.data?.user.username}`}
          </p>
          <p>
            {(value.data?.session.impersonatedBy as string) ? (
              <StopImpersonationBtn />
            ) : null}
          </p>
        </div>
      </div>
    );
  }
}

export function SkeletonDemo() {
  return (
    <div className="-ml-9 flex w-90 max-w-100 items-center justify-center gap-3 px-1 py-2 md:py-5">
      <Skeleton className="size-15 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-50" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}
