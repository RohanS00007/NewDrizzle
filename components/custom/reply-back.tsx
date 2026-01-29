import { Controller } from "react-hook-form";
import { Field, FieldDescription, FieldError } from "../ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";

import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  msgContent: z
    .string()
    .min(1, "Message cannot be empty.")
    .max(500, "Message content must be at most 500 characters."),
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
    <div className="absolute right-0 bottom-0 left-0 w-full border-t border-gray-800 bg-black px-4 py-3">
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="msgContent"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <div className="flex items-center justify-center gap-1">
                <InputGroupTextarea
                  {...field}
                  id="textarea-message"
                  className="h-1 max-h-3 flex-1 resize-none scroll-py-3 rounded-md border border-gray-700 bg-gray-900 px-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  aria-invalid={fieldState.invalid}
                  placeholder="Type a message..."
                  rows={1}
                />
                <button
                  type="submit"
                  form="form-rhf-demo"
                  disabled={!field.value.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                >
                  ➤
                </button>
              </div>
              <FieldDescription></FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
    </div>
  );
}
