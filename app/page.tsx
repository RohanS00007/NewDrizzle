import GitHubBtn from "@/components/custom/github-client";
import GoogleClientBtn from "@/components/custom/google-client";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-blue-700 text-shadow-blue-300 text-shadow-lg">
        Home Page
      </h1>
      <GitHubBtn />
      <GoogleClientBtn />
       
    </div>
  );
}
