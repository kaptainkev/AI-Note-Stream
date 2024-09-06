import { z } from "zod";
export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});
