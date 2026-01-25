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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import axios, { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { IconArrowNarrowRight } from "@tabler/icons-react";

const formSchema = z.object({
  content: z
    .string()
    .min(10, "Please provide at least 10 characters.")
    .max(200, "Please keep it under 200 characters."),
});

export default function MessageForm({
  className,
  userName,
}: {
  className: string;
  userName: string;
}) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsDisabled(true);
      const response = await axios.post("/api/send-message", {
        msgContent: data.content,
        username: userName[0],
      });

      form.reset();

      if (response.data) {
        toast("Api Message", {
          description: response.data.message,
        });
      }
      setIsDisabled(false);
    } catch (error) {
      console.log(error);

      const axiosError = error as AxiosError;

      if (axiosError) {
        toast("Api Message", {
          description: (
            <pre>
              <p>{axiosError.message}</p>
              <br />
              <p>Maybe user doesn&apos;t exist or is not accepting messages.</p>
            </pre>
          ),
        });
      }
    }
  }

  return (
    <Card className={cn("mx-auto w-full md:w-3/4", className)}>
      <CardHeader>
        <CardTitle>Send messages being anonymous.</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-textarea" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-textarea-content"></FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-textarea-content"
                    aria-invalid={fieldState.invalid}
                    placeholder="Start typing your message here..."
                    className="min-h-40"
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            className={"cursor-pointer hover:scale-102"}
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            disabled={isDisabled}
            type="submit"
            form="form-rhf-textarea"
            className={
              "group cursor-pointer hover:scale-102 disabled:bg-neutral-600 disabled:opacity-30 disabled:transition-colors disabled:duration-200"
            }
          >
            Send
            <IconArrowNarrowRight className="transition-all duration-300 group-hover:translate-x-1" />
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
