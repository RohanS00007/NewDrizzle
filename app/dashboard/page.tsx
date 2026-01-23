import SignOutBtn from "@/components/custom/sign-out";
import UserData from "@/components/custom/user-data";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1>DashBoard Page</h1>
      <UserData />
      <SignOutBtn />
    </div>
  );
}
