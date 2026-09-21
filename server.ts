import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// API proxy for Gemini TTS
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const payload = {
      contents: [{ parts: [{ text: text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Sulafat" }
          }
        }
      },
      model: "gemini-2.0-flash"
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText || "TTS API Failed" });
    }

    const result = await response.json();
    res.json(result);
  } catch (error: any) {
    console.error("TTS Proxy Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Serve static files from workspace root
const staticPath = process.cwd();
app.use(express.static(staticPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
