import { auth } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";

import { Metadata } from "next";
import prisma from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Flow Landing",
};
export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <>
      {JSON.stringify(allNotes)}
      <div className="flex h-screen">
        <Button className="flex max-h-screen ">
          THis is a pretty Button Man
        </Button>
      </div>
    </>
  );
}
