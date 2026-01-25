import SignInForm from "@/components/custom/signin-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-tr from-blue-200 via-blue-100 to-yellow-100">
      <SignInForm />
    </div>
  );
}
export const runtime = "edge";
// export const preferredRegion = ""
