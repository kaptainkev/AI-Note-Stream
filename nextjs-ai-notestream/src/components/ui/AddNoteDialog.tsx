import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "./dialog";
interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function AddNoteDialog({ open, setOpen }: AddNoteDialogProps) {
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
  });

  async function onsubmit(input: CreateNoteSchema) {
    alert(input);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add</DialogTitle>Note{" "}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
