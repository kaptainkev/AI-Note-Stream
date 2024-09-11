import OpenAI from "openai";
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OpenAI API Key is required");
}

const openai = new OpenAI({ apiKey });

export default openai;
