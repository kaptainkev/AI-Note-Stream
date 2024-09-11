import { getEmbedding, notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";

/*Code above I want to use when I figure out how - to keep from duplicating the parse logic in the POST and PUT methods */

function parseData(body: JSON) {
  const parseResult = createNoteSchema.safeParse(body);
  if (!parseResult.success) {
    console.error(parseResult.error);
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { title, content } = parseResult.data;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    var dataT = parseData(body);

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

    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(async (tx) => {
      //valid response
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });

      //Pine Cone Transaction insert
      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return note;
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
    return Response.json({ error: "Internal Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    var dataT = parseData(body);

    const parseResult = updateNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const updateNote = await prisma.$transaction(async (tx) => {
      //Transaction DB call update first
      const updateNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      //PineCone Vector DB Update

      await notesIndex.upsert([
        { id, values: embedding, metadata: { userId } },
      ]);

      //
      return updateNote;
    });
    return Response.json({ note: updateNote }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    var dataT = parseData(body);

    const parseResult = deleteNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    /*
    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }
*/
    const { userId } = auth();

    if (!userId || userId !== note?.userId) {
      return Response.json({ error: "Unauthorized" + userId }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id } });
      await notesIndex.deleteOne(id);
    });

    return Response.json({ meessage: "Note deleted" }, { status: 200 });
  } catch (error) {
    alert(JSON.stringify(error));
    return Response.json({ error: "Internal Server error" }, { status: 500 });
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
