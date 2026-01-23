"use client";

import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import GitHubBtn from "./github-client";
import GoogleClientBtn from "./google-client";
import { useCallback, useEffect, useRef } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Undo2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { APIError } from "better-auth";
import { cn } from "@/lib/utils";
import { PasswordInput } from "../ui/password-input";

const credentialSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must not be longer than 20 characters."),
  username: z
    .string()
    .min(8, { message: "Username must be at least 8 characters long" })
    .max(20, { message: "Username must not be longer than 20 characters." })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must not be longer than 20 characters." }),
});

export default function SignUpForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Holds the controller for the *latest* username check request
  const abortControllerRef = useRef<AbortController | null>(null);

  const form = useForm<z.infer<typeof credentialSchema>>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  // Core username availability check
  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      // Only check if username passes basic validation
      if (
        !username ||
        username.length < 8 ||
        !/^[a-zA-Z0-9_]+$/.test(username)
      ) {
        return;
      }

      // Create a *local* controller for this request
      const controller = new AbortController();

      // Mark any previous request as "stale" by replacing the ref
      abortControllerRef.current = controller;

      try {
        const { data: response, error } = await authClient.isUsernameAvailable({
          username,
          // If your authClient supports it, you can add:
          // signal: controller.signal,
        });

        // If another request has started after this one, ignore this result
        if (abortControllerRef.current !== controller) {
          return;
        }

        if (response?.available) {
          form.clearErrors("username");
        } else {
          form.setError("username", {
            type: "manual",
            message: error?.message || "Username already taken",
          });
        }
      } catch (err) {
        // Ignore errors for stale requests
        if (abortControllerRef.current !== controller) {
          return;
        }

        console.error("Error checking username availability:", err);
      }
    },
    [form],
  );

  // Debounced version to avoid spamming the backend
  const debouncedCheck = useDebounceCallback(checkUsernameAvailability, 1000);

  // Properly subscribe to form changes and clean up
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (data.username !== undefined) {
        debouncedCheck(data.username);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form, debouncedCheck]);

  async function onSubmit(userdata: z.infer<typeof credentialSchema>) {
    // Invalidate any in-flight username requests (mark them as stale)
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    await authClient.signUp.email(
      {
        name: userdata.name,
        username: userdata.username,
        email: userdata.email,
        password: userdata.password,
        isCredentialLogin: true,
        callbackURL: "/",
      },
      {
        onRequest: async () => {
          toast("Creating your account...", {
            description: "Please wait",
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["betterAuth"] });
          router.push("/dashboard");
          toast.success("Account created successfully!", {
            description: "Welcome on board!",
          });
        },
        onError: (error) => {
          if (error instanceof APIError) {
            toast.error(error.message as string, {
              description: "Please try again",
            });
          } else {
            toast.error("Something went wrong during sign up", {
              description: "Please try again later",
            });
          }
        },
      },
    );
  }

  return (
    <Card
      className={cn(
        "mask-t-from-98% mask-r-from-98% mask-b-from-98% mask-l-from-98%",
        "mx-auto mt-4 w-100 sm:h-auto sm:min-w-md md:min-w-3xl",
      )}
    >
      <CardHeader className="mx-auto w-[90%] text-center">
        <CardTitle className="mb-2 text-2xl font-bold text-blue-700">
          Welcome to Anonymous Message
        </CardTitle>
        <CardDescription className="-mt-3 text-sm">
          Sign up using social logins or credentials
        </CardDescription>
      </CardHeader>

      <div className="mx-auto flex w-xs max-w-125 justify-evenly gap-y-3 sm:w-md md:flex-row">
        <GoogleClientBtn />
        <GitHubBtn />
      </div>

      <Separator className="mb-3" />

      <CardContent>
        <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 gap-4 px-15 md:grid-cols-2">
            {/* Full Name Input */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Bruce Wayne"
                    autoComplete="name"
                  />
                  <FieldDescription />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Username Input Field */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="brucewayne_07"
                    autoComplete="username"
                  />
                  <FieldDescription />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email Input Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="brucewayne@gmail.com"
                    type="email"
                    autoComplete="email"
                  />
                  <FieldDescription />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Input Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-password">
                    Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="form-rhf-input-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="iamVengeance"
                    autoComplete="new-password"
                  />
                  <FieldDescription />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="mt-3 flex flex-col">
        <Field
          orientation="horizontal"
          className="mx-auto flex w-[60%] place-content-center place-items-center justify-center gap-1"
        >
          <Button
            className="hover:scale-102 active:scale-102"
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            aria-label="Reset form"
          >
            <Undo2 />
          </Button>
          <Button
            type="submit"
            form="form-rhf-input"
            className="cursor-pointer bg-blue-300 text-blue-700 duration-300 hover:bg-blue-400 hover:text-white hover:transition-all active:scale-95 active:bg-blue-100"
          >
            Submit
          </Button>
        </Field>
        <div className="mt-3 flex place-content-center place-items-center">
          <p className="text-sm text-neutral-400">Already an existing user?</p>
          <Button
            className="-ml hover:scale-102 hover:font-semibold active:scale-98"
            variant="link"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
