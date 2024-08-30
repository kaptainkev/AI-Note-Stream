import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { DialogHeader } from "../ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../ui/form";

import { Input } from "../ui/input";
import { Textarea } from "./textarea";
import LoadingButton from "./LoadingButton";
import { useRouter } from "next/navigation";
interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function AddNoteDialog({ open, setOpen }: AddNoteDialogProps) {
  const router = useRouter();
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),

    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onsubmit(input: CreateNoteSchema) {
    alert(JSON.stringify(input));

    try {
      const response = await fetch("api/notes/", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!response.ok) throw Error("Status code:" + response.status);
      {
        form.reset();
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      alert("Something Went wrong: " + error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Addition</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                  {/* Use the imported FormContent component */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                  {/* Use the imported FormContent component */}
                </FormItem>
              )}
            />

            <DialogFooter>
              <LoadingButton
                className="w-full"
                type="submit"
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
