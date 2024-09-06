"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddEditNoteDialog from "@/components/ui/AddEditNoteDialog";
export default function NavBar() {
  const [showAddEditNoteDialog, setshowAddEditNoteDialog] = useState(false);
  return (
    <>
      <div className="p-4 shadow">
        <div className=" max-w-full flex flex-wrap gap-3 items-center justify-between">
          <Link href="/notes" className="flex items-center gap-1">
            <Image alt="" src={logo} width={120} height={120}></Image>
          </Link>

          <span>Element 2</span>
          <span>Element 2</span>
          <span>Element 2</span>
          <span>Element 2</span>
          <span>Element 2</span>

          <div id="FaceAndAddNote" className="flex items-center gap-2">
            {" "}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            ></UserButton>
            <Button onClick={() => setshowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2"></Plus>
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {showAddEditNoteDialog && (
        <AddEditNoteDialog
          open={showAddEditNoteDialog}
          setOpen={setshowAddEditNoteDialog}
        ></AddEditNoteDialog>
      )}
    </>
  );
}
