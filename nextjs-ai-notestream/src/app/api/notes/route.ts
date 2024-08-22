import prisma from "@/lib/db/prisma";
import { createNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    //valid response
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return Response.json({ note }, { status: 201 });
    /*
    const { title, content } = body;
    if (!title || !content) {
      return Response.json(
        { error: "Title and Content is required" },
        { status: 400 }
      );
    }*/

    //   const note = await Note.create({ title, content });
    //return Response.json(note, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server error" }, { status: 300 });
  }
}
