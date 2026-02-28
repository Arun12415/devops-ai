import express from "express";
import OpenAI from "openai";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// 👉 Serve index.html automatically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Generate DevOps Code
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: `
You are a senior DevOps engineer.
Generate ONLY production-ready code.
Do NOT explain.
Return code only.

Request: ${prompt}
`
    });

    // ✅ Safe extraction
    const outputText = response.output_text || "No output";

    res.json({ output: outputText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 👉 Open UI on homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("🚀 Full App running at http://localhost:3000");
});