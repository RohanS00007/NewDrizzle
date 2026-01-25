"use client";
import Image from "next/image";
import { useAuthInfo } from "./auth-query-provider";
// import CancelImpersonationBtn from "./stop-impersonating";
import StopImpersonationBtn from "./stop-impersonating-btn";

export default function UserData() {
  const value = useAuthInfo();

  if (value?.isLoading)
    return (
      <div className="h-10 w-100 animate-pulse text-center">
        <p>Loading User Profile...</p>
      </div>
    );
  if (value?.isError) return <p>{value.error?.message}</p>;

  if (value?.data) {
    return (
      <div className="flex w-150 max-w-80 items-center justify-center px-3 py-5">
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
