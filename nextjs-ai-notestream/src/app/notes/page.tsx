import { Button } from "../../components/ui/button";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flow Landing",
};
export default function NotesPage() {
  return (
    <div className="flex h-screen">
      <Button className="flex max-h-screen ">
        THis is a pretty Button Man
      </Button>
    </div>
  );
}
