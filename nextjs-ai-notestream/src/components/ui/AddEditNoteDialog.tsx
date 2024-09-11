"use client";
import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./dialog";
import { DialogHeader } from "./dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./form";

import { Input } from "./input";
import { Textarea } from "./textarea";
import LoadingButton from "./LoadingButton";
import { useRouter } from "next/navigation";

import { Note } from "@prisma/client";
import { useState } from "react";
import prisma from "@/lib/db/prisma";
import { title } from "process";
interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}
export default function AddEditNoteDialog({
  open,
  setOpen,
  noteToEdit,
}: AddEditNoteDialogProps) {
  const [deleteInProgress, setdeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),

    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  async function onsubmit(input: CreateNoteSchema) {
    try {
      let response;
      if (noteToEdit) {
        response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({ id: noteToEdit.id, ...input }),
        });
      } else {
        response = await fetch("api/notes/", {
          method: "POST",
          body: JSON.stringify(input),
        });
      }

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

  async function deleteNote() {
    if (!noteToEdit) {
      setdeleteInProgress(true);
    }

    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: noteToEdit?.id }),
      });

      if (!response.ok) throw Error("Status code:" + response.status);
      {
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      alert("Something Went wrong: " + error);
    } finally {
      setdeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {noteToEdit ? "Edit note" : "Add Note"}
          </DialogTitle>
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

            <DialogFooter className="gap-1 sm:gap-0 ">
              {noteToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete Note
                </LoadingButton>
              )}
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
