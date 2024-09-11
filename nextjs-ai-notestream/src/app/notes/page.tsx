import { auth } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";

import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import Note from "../../components/ui/Notes";
export const metadata: Metadata = {
  title: "Flow Notes ",
};
export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <>
      {/* Notes are being transformed into Note components here !*/}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allNotes.map((note) => (
          <Note note={note} key={note.id}></Note>
        ))}
      </div>

      {allNotes.length === 0 && (
        <div className="col-span-full items-center flex h-screen text-center justify-center">
          <p className="text-2xl font-semibold text-gray-500">
            No Notes Found. Why don't you create one?
          </p>
        </div>
      )}

      <div className=""></div>
    </>
  );
}
