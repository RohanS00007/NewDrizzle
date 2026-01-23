"use client";
import { useAuthInfo } from "./auth-query-provider";
import CancelImpersonationBtn from "./stop-impersonating";

export default function UserData() {
  const value = useAuthInfo();

  return value ? (
    <div className="mx-auto mb-5 flex h-auto max-w-2xl flex-col p-5 text-2xl font-bold text-black">
      <p>Display Name: {value.data?.user.name || "Does not exist"}</p>
      <p>User Email: {value.data?.user.email}</p>
      <p>Name: {value.data?.user.name}</p>
      <p>UserName: {value.data?.user.username}</p>
      <p>UserID: {value.data?.user.id}</p>
      <p>
        ImpersonatedBy:
        {(value.data?.session.impersonatedBy as string) ?
          <CancelImpersonationBtn /> :"Not Impersonated by anyone"}
      </p>
    </div>
  ) : null;
}
