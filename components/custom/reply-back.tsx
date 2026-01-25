import { Controller } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";

import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  msgContent: z
    .string()
    .min(20, "Message content must be at least 20 characters.")
    .max(200, "Message content must be at most 200 characters."),
});

export default function ReplyBack({
  conversationId,
}: {
  conversationId: string;
}) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      msgContent: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await axios.post("/api/reply-back", {
        msgContent: data.msgContent,
        conversationId: conversationId,
      });

      queryClient.invalidateQueries({
        queryKey: ["get-messages", conversationId],
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Error sending message", { description: error.message });
      }
    } finally {
      form.reset();
    }
  }

  return (
    <div className="w-full">
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="msgContent"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="textarea-message"></FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="textarea-message"
                  rows={1}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                  placeholder="Message"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText>
                    {field.value.length}/200 characters
                  </InputGroupText>
                  <InputGroupButton
                    variant="default"
                    size="sm"
                    className="ml-auto hover:scale-102 hover:cursor-pointer active:scale-98"
                    type="submit"
                    form="form-rhf-demo"
                  >
                    Post
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription></FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
    </div>
  );
}
