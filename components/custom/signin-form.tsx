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
import GitHubBtn from "./github-client";
import GoogleClientBtn from "./google-client";
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
          toast("Requesting...");
        },
        onSuccess: () => {
          form.reset();
          toast.success("User Logged in");
          router.push("/dashboard");
          queryClient.invalidateQueries({ queryKey: ["betterAuth"] });
        },
        onError: (ctx) => {
          toast.error("Invalid credentials, try again", {
            description: ctx.error.message,
          });
          form.reset();
        },
      },
    );
  }

  return (
    <Card
      className={cn(
        "mx-auto w-[90%] border-transparent text-center [box-shadow:rgba(60,64,67,0.3)_0px_1px_2px_0px,rgba(60,64,67,0.15)_0px_1px_3px_1px] sm:w-4/5 md:w-3/5",

        // "mask-t-from-98% mask-r-from-98% mask-b-from-98% mask-l-from-98%",
      )}
    >
      <CardHeader>
        <CardTitle className="mb-2 bg-linear-to-bl from-green-300 to-blue-600 bg-clip-text text-2xl font-bold text-transparent sm:text-4xl md:text-4xl">
          Anonymous Chat
        </CardTitle>
        <CardDescription className="text-md -mt-1 md:text-lg">
          Sign In with Google & Github oAuth
        </CardDescription>
        <div className="mx-auto flex w-60 justify-evenly py-2">
          <GitHubBtn />
          <GoogleClientBtn />
        </div>
      </CardHeader>

      <div className="mx-auto flex w-full items-center justify-center gap-1">
        <div className="h-1 flex-1 bg-linear-to-r from-blue-300 to-blue-500"></div>
        <span className="font-semibold [font-variant:small-caps]">
          Or continue with Email
        </span>
        <div className="h-1 flex-1 bg-linear-to-l from-blue-300 to-blue-500"></div>
      </div>

      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="px-2 sm:px-10">
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
      <CardFooter className="mt-3 flex flex-col items-center justify-center border-t-transparent bg-inherit">
        <Field orientation="horizontal" className="flex justify-center gap-2">
          <Button
            className="group rounded-md border border-none bg-linear-to-br from-green-200 to-blue-300 bg-clip-border hover:scale-102 active:scale-102"
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            <Undo2 className="group-hover:scale-105" />
          </Button>
          <Button
            type="submit"
            form="form-rhf-demo"
            variant={"default"}
            className="cursor-pointer rounded-md bg-linear-to-bl from-green-200 to-blue-300 bg-clip-border text-white duration-300 hover:transition-all hover:text-shadow-2xs hover:text-shadow-blue-600 active:scale-95 active:bg-blue-100"
          >
            Submit
          </Button>
        </Field>
        <div className="mt-2 -mb-2 flex place-content-center place-items-center">
          <p className="text-sm text-neutral-400">
            Don&apos;t have an account?
          </p>
          <Button
            className="-ml bg-linear-to-bl from-green-500 to-blue-600 bg-clip-text text-transparent hover:scale-102 hover:font-semibold active:scale-98"
            variant={"link"}
          >
            <Link href={"/sign-up"}>Sign Up</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
