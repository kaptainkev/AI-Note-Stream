import { Pinecone } from "@pinecone-database/pinecone";
import openai from "../openai";
const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("Pinecone API Key is required");
}

const pincecone = new Pinecone({
  apiKey,
});

export const notesIndex = pincecone.Index("note-stream-app");

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) throw Error("Error generating embedding. ");
  console.log(embedding);

  return embedding;
}
