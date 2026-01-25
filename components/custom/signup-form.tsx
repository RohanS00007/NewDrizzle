// "use client";

// import { authClient } from "@/lib/auth-client";
// import { useQueryClient } from "@tanstack/react-query";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Field,
//   FieldDescription,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";

// import Link from "next/link";
// import GitHubSignUp from "./github";
// import GoogleSignUp from "./google";
// import { useEffect, useState } from "react";
// import { useDebounceCallback } from "usehooks-ts";
// import { Undo2 } from "lucide-react";
// import { Separator } from "../ui/separator";
// import { APIError } from "better-auth";
// import { cn } from "@/lib/utils";

// const credentialSchema = z.object({
//   name: z
//     .string()
//     .min(3, "Name must be atleast 3 characters long")
//     .max(20, "Name must not be longer than 20 characters."),

//   username: z
//     .string()
//     .min(8, { message: "Username must be atleast 8 characters long" })
//     .max(20, { message: "Username must not be longer than 20 characters." })
//     .regex(
//       /^[a-zA-Z0-9_]+$/,
//       "Username can only contain letters, numbers, and underscores.",
//     ),

//   email: z.email({ error: "Make sure email ends with @gmail.com" }),
//   password: z
//     .string()
//     .min(8, { message: "Password must be atleast 8 characters long" })
//     .max(20, { message: "Password must not be longer than 20 characters." }),
// });

// export default function SignUpForm() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const queryClient = useQueryClient();
//   const debounced = useDebounceCallback(setUsername, 2000);

//   const form = useForm<z.infer<typeof credentialSchema>>({
//     resolver: zodResolver(credentialSchema),
//     defaultValues: {
//       username: "",
//       name: "",
//       email: "",
//       password: "",
//     },
//   });

//   const { setError, clearErrors } = form;

//   async function usernameExists() {
//     const { data: response, error } = await authClient.isUsernameAvailable({
//       username,
//     });
//     if (response?.available) {
//       clearErrors("username");
//     } else {
//       // console.log("Username is not available for you, as it is already taken");
//       setError("username", {
//         type: "onBlur",
//         message: error?.message || "Username already taken",
//       });
//     }
//   }

//   useEffect(() => {
//     if (username.trim() === "") return;
//     usernameExists();
//   }, [username]);

//   async function onSubmit(userdata: z.infer<typeof credentialSchema>) {
//     await authClient.signUp.email(
//       {
//         name: userdata.name,
//         username: userdata.username,
//         email: userdata.email,
//         password: userdata.password,
//         isCredentialLogin: true,
//         callbackURL: "/",
//       },
//       {
//         onRequest: async () => {
//           toast("Requesting...", {
//             description: "Wait a little",
//           });
//         },
//         onSuccess: () => {
//           queryClient.invalidateQueries({ queryKey: ["betterAuth"] });
//           toast.success("User registered, but unverifed", {
//             description: `Have a Good day`,
//           });
//           router.push("/dashboard");
//         },
//         onError: (error) => {
//           if (error instanceof APIError) {
//             toast.error(error.message as string, {
//               description: "Try again with @gmail.com",
//             });
//           } else {
//             toast.error("Something went wrong while signup...", {
//               description: "Try again",
//             });
//           }
//         },
//       },
//     );

//     // toast("You submitted the following values:", {
//     //   description: (
//     //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
//     //       <code>{JSON.stringify(data, null, 2)}</code>
//     //     </pre>
//     //   ),
//     //   position: "bottom-right",
//     //   classNames: {
//     //     content: "flex flex-col gap-2",
//     //   },
//     //   style: {
//     //     "--border-radius": "calc(var(--radius)  + 4px)",
//     //   } as React.CSSProperties,
//     // });
//   }

//   return (
//     <Card
//       className={cn(
//         "mask-t-from-98% mask-r-from-98% mask-b-from-98% mask-l-from-98%",
//         "mx-auto mt-4 w-100 sm:h-auto sm:min-w-md md:min-w-3xl",
//       )}
//     >
//       <CardHeader className="mx-auto w-[90%] text-center">
//         <CardTitle className="mb-2 text-2xl font-bold text-blue-700">
//           Welcome to Anonymous Message
//         </CardTitle>
//         <CardDescription className="-mt-3 text-sm">
//           Sign Up using social logins or credentials
//         </CardDescription>
//       </CardHeader>

//       <div className="mx-auto flex w-xs max-w-125 justify-evenly gap-y-3 sm:w-md md:flex-row">
//         <GoogleSignUp />
//         <GitHubSignUp />
//       </div>

//       <Separator className={"mb-3"} />

//       <CardContent>
//         <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
//           <FieldGroup className="grid grid-cols-1 px-15 md:grid-cols-2">
//             {/* Full Name Input */}
//             <Controller
//               name="name"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor="form-rhf-input-name">Name</FieldLabel>
//                   <Input
//                     {...field}
//                     id="form-rhf-input-name"
//                     aria-invalid={fieldState.invalid}
//                     placeholder="Bruce Wayne"
//                     // autoComplete="username"
//                   />
//                   <FieldDescription></FieldDescription>
//                   {fieldState.invalid && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />
//             {/* UserName Input Field */}

//             <Controller
//               name="username"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor="form-rhf-input-username">
//                     Username
//                   </FieldLabel>
//                   <Input
//                     {...field}
//                     id="form-rhf-input-username"
//                     aria-invalid={fieldState.invalid}
//                     placeholder="brucewayne_07"
//                     onChange={(e) => {
//                       field.onChange(e.target.value);
//                       debounced(e.target.value);
//                     }}
//                     // autoComplete="username"
//                   />
//                   <FieldDescription></FieldDescription>
//                   {fieldState.invalid && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />
//             {/* Email Input Field */}

//             <Controller
//               name="email"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor="form-rhf-input-email">Email</FieldLabel>
//                   <Input
//                     {...field}
//                     id="form-rhf-input-email"
//                     aria-invalid={fieldState.invalid}
//                     placeholder="brucewayne@gmail.com"
//                     type="email"
//                     // autoComplete="username"
//                   />
//                   <FieldDescription></FieldDescription>
//                   {fieldState.invalid && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />
//             {/* Password Input Field */}

//             <Controller
//               name="password"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor="form-rhf-input-password">
//                     Password
//                   </FieldLabel>
//                   <Input
//                     {...field}
//                     type="password"
//                     id="form-rhf-input-password"
//                     aria-invalid={fieldState.invalid}
//                     placeholder="iamVengeance"
//                     // autoComplete="username"
//                   />
//                   <FieldDescription></FieldDescription>
//                   {fieldState.invalid && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />
//           </FieldGroup>
//         </form>
//       </CardContent>
//       <CardFooter className="mt-3 flex flex-col">
//         <Field
//           orientation="horizontal"
//           className="mx-auto flex w-[60%] place-content-center place-items-center justify-center gap-1"
//         >
//           <Button
//             className="hover:scale-102 active:scale-102"
//             type="button"
//             variant="outline"
//             onClick={() => form.reset()}
//           >
//             <Undo2 />
//           </Button>
//           <Button
//             type="submit"
//             form="form-rhf-input"
//             className="cursor-pointer bg-blue-300 text-blue-700 duration-300 hover:bg-blue-400 hover:text-white hover:transition-all active:scale-95 active:bg-blue-100"
//           >
//             Submit
//           </Button>
//         </Field>
//         <div className="mt-3 flex place-content-center place-items-center">
//           <p className="text-sm text-neutral-400">Already an existing user?</p>
//           <Button
//             className="-ml hover:scale-102 hover:font-semibold active:scale-98"
//             variant={"link"}
//           >
//             <Link href={"/sign-in"}>Sign In</Link>
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// // export default function SignUpForm() {
// //   const router = useRouter();
// //   const queryClient = useQueryClient();
// //   const abortControllerRef = useRef(null);

// //   const form = useForm({
// //     resolver: zodResolver(credentialSchema),
// //     defaultValues: {
// //       username: "",
// //       name: "",
// //       email: "",
// //       password: "",
// //     },
// //   });

// // //   const checkUsername = useCallback(async (username) => {
// //     if (abortControllerRef.current) {
// //       abortControllerRef.current.abort();
// //     }

// //     if (!username || username.length < 8 || !/^[a-zA-Z0-9_]+$/.test(username)) {
// //       return;
// //     }

// //     abortControllerRef.current = new AbortController();

// //     try {
// //       const { data, error } = await authClient.isUsernameAvailable({ username });

// //       if (abortControllerRef.current.signal.aborted) return;

// //       if (data?.available) {
// //         form.clearErrors("username");
// //       } else {
// //         form.setError("username", {
// //           type: "manual",
// //           message: error?.message || "Username already taken"
// //         });
// //       }
// //     } catch (err) {
// //       if (!abortControllerRef.current?.signal.aborted) {
// //         console.error(err);
// //       }
// //     }
// //   }, [form]);

// //   const debouncedCheck = useDebounceCallback(checkUsername, 500);

// //   // This replaces the entire useEffect!
// //   form.watch((data) => {
// //     debouncedCheck(data.username);
// //   });

// //   // Rest of your component...
// // }
