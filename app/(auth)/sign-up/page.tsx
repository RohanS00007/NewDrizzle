import SignUpForm from "@/components/custom/claude-signup-form";

export default function SignUpPage() {
  return (
    <div className="bg-muted flex h-auto items-center justify-center from-blue-200 via-blue-100 to-yellow-100 md:min-h-screen md:bg-linear-to-tr">
      <SignUpForm />
    </div>
  );
}
// export const runtime = "edge";
