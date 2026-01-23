"use client";

// import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  // FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GitHubSignUp from "./github";
import GoogleSignUp from "./google";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Undo2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { PasswordInput } from "../ui/password-input";

const signInSchema = z.object({
  username: z
    .string()
    .min(8, "Username must be atleast 8 characters long")
    .max(20, "Username must not be longer than 20 characters."),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters long")
    .max(20, "Password must not be longer than 20 characters."),
});

export default function SignInForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    await authClient.signIn.username(
      {
        username: values.username,
        password: values.password,
      },
      {
        onRequest: () => {
          toast("Requesting", {
            description: `Please wait`,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["betterAuth"] });

          toast("User Logged in", {
            description: "Enjoy the websurfing",
          });
          router.push("/dashboard");
        },
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            alert("Invalid credentials, try again");
          }
          //you can also show the original error message
          alert(ctx.error.message);
        },
      },
    );
  }

  return (
    <Card
      className={cn(
        "mx-auto w-[90%] text-center sm:w-4/5 md:w-3/5",
        "mask-t-from-98% mask-r-from-98% mask-b-from-98% mask-l-from-98%",
      )}
    >
      <CardHeader>
        <CardTitle className="mb-2 text-2xl font-bold text-blue-700">
          Welcome back to Anonymous Message
        </CardTitle>
        <CardDescription className="-mt-3">
          SignIn with credentials or OAuth
        </CardDescription>
        <div className="mx-auto flex w-60 flex-row justify-evenly py-5">
          <GitHubSignUp />
          <GoogleSignUp />
        </div>
      </CardHeader>
      <Separator className={cn("mx-auto -my-1 sm:my-0.5")} />
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="px-5 sm:px-10">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your Username..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-password">
                    Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="form-rhf-demo-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your Password..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="mt-3 flex flex-col items-center justify-center">
        <Field orientation="horizontal" className="flex justify-center">
          <Button
            className="hover:scale-102 active:scale-102"
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            <Undo2 />
          </Button>
          <Button
            type="submit"
            form="form-rhf-demo"
            variant={"default"}
            className="cursor-pointer bg-blue-300 text-blue-700 duration-300 hover:bg-blue-400 hover:text-white hover:transition-all active:scale-95 active:bg-blue-100"
          >
            Submit
          </Button>
        </Field>
        <div className="mt-2 -mb-2 flex place-content-center place-items-center">
          <p className="text-sm text-neutral-400">
            Don&apos;t have an account?
          </p>
          <Button
            className="-ml hover:scale-102 hover:font-semibold active:scale-98"
            variant={"link"}
          >
            <Link href={"/sign-up"}>Sign Up</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
