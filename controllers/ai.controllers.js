import File from "../models/file.models.js"; // ✅ use File model, not Material
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_KEY = process.env.AI_KEY;

// 🧩 Get AI-generated summary of a file
export const getFileSummary = async (req, res) => {
  try {
    const fileId = req.params.fileId.replace(/^:/, "").trim();

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const prompt = `Summarize the following study material:\n\nTitle: ${file.title}\nDescription: ${file.description}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 400,
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content || "No summary generated.";

    res.status(200).json({ success: true, summary });
  } catch (err) {
    console.error("❌ getFileSummary Error:", err.message);
    res.status(500).json({ message: "AI Summary failed", error: err.message });
  }
};

// 🧩 Get AI-generated quiz of a file
export const getFileQuiz = async (req, res) => {
  try {
    const fileId = req.params.fileId.replace(/^:/, "").trim();

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const prompt = `Create a 5-question multiple choice quiz based on:\n\nTitle: ${file.title}\nDescription: ${file.description}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const quiz = data?.choices?.[0]?.message?.content || "No quiz generated.";

    res.status(200).json({ success: true, quiz });
  } catch (err) {
    console.error("❌ getFileQuiz Error:", err.message);
    res.status(500).json({ message: "AI Quiz failed", error: err.message });
  }
};
