import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";

const router = express.Router();

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    await Thread.deleteOne({ threadId });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { message, threadId } = req.body;

    if (!message || !threadId) {
      return res.status(400).json({ error: "Message and threadId are required" });
    }

    const reply = await getGeminiResponse(message);

    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.slice(0, 30),
        messages: [],
      });
    }

    thread.messages.push({ role: "user", content: message });
    thread.messages.push({ role: "assistant", content: reply });
    thread.updatedAt = Date.now();

    await thread.save();

    res.json({ reply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to chat with Gemini" });
  }
});

export default router;