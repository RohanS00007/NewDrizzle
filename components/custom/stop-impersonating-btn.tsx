"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export default function StopImpersonationBtn() {
  const handleStopImpersonation = async () => {
    await authClient.admin.stopImpersonating();
  };

  return <Button onClick={handleStopImpersonation}>Stop Impersonating</Button>;
}
