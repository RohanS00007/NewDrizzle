import Link from "next/link";
import { Button } from "../ui/button";

export default function SignUpBtn() {
  return (
    <Link href="/sign-up">
      <Button
        className="w-full cursor-pointer bg-slate-100 text-black hover:scale-102 active:scale-98 md:w-auto"
        variant={"outline"}
      >
        Sign Up
      </Button>
    </Link>
  );
}
