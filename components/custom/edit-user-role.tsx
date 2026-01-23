"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const roles = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
] as const;

const formSchema = z.object({
  role: z.enum(["user", "admin"]),
  userId: z.string().min(1, "User ID is required"),
});

export default function UserRoleEdit({
  userID,
  classname,
}: {
  userID: string;
  classname: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "user",
      userId: userID,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await authClient.admin.setRole(
      {
        userId: userID,
        role: data.role,
      },
      {
        onRequest: () => {
          setIsSubmitting(true);
          toast("Requesting...", {
            description: "Wait a little",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
        },
        onSuccess: () => {
          toast("New Role setted by Admin", {
            description: "Have blast with role features.",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
          // router.refresh();
          // setInterval(() => {
          //   window.location.reload();
          // }, 1500);
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setIsSubmitting(false);
        },
        onError: (ctx) => {
          console.log("error", ctx);
          toast("Something went wrong while setting up new role...", {
            description: "Try again",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
        },
      },
    );
  }

  return (
    <div className={cn("border-transparent", classname)}>
      <Popover>
        <PopoverTrigger>
          <Edit className={`size-4 text-neutral-600 hover:text-blue-600 ${isSubmitting}? "opacity-5" : "opacity-1"`} />
        </PopoverTrigger>
        <PopoverContent>
          <Card className="w-full border-transparent sm:max-w-lg">
            <CardHeader>
              <CardTitle>Change User Role</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <form id="form-rhf-select" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        orientation="responsive"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel htmlFor="form-rhf-select-role"></FieldLabel>
                          <FieldDescription></FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="form-rhf-select-role"
                            aria-invalid={fieldState.invalid}
                            className="min-w-30"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {/* <SelectItem value="auto">Auto</SelectItem> */}
                            <SelectSeparator />
                            {roles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter>
              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit" form="form-rhf-select">
                  Save
                </Button>
              </Field>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
