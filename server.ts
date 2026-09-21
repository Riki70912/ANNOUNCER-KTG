import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// API proxy for Gemini TTS with automatic high-reliability Indonesian audio fallback
async function fetchIndonesianTtsAudio(text: string): Promise<Buffer> {
  const sentences = text.match(/[^.!?\n,]+[.!?\n,]*/g) || [text];
  const chunks: string[] = [];
  for (const s of sentences) {
    let clean = s.trim();
    while (clean.length > 150) {
      const sliceIdx = clean.lastIndexOf(' ', 150) || 150;
      chunks.push(clean.substring(0, sliceIdx).trim());
      clean = clean.substring(sliceIdx).trim();
    }
    if (clean) chunks.push(clean);
  }

  const audioBuffers: Buffer[] = [];
  for (const chunk of chunks) {
    if (!chunk) continue;
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      if (res.ok) {
        const arr = await res.arrayBuffer();
        audioBuffers.push(Buffer.from(arr));
      }
    } catch (err) {
      console.warn("Chunk fetch error:", err);
    }
  }
  return Buffer.concat(audioBuffers);
}

app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const payload = {
          contents: [{ parts: [{ text: text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName || "Sulafat" }
              }
            }
          }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          if (result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
            return res.json(result);
          }
        } else {
          console.warn("Gemini TTS API returned status", response.status, "Falling back to neural Indonesian audio...");
        }
      } catch (geminiErr) {
        console.warn("Gemini TTS call failed, falling back:", geminiErr);
      }
    }

    // High-reliability Indonesian audio fallback
    const fallbackBuffer = await fetchIndonesianTtsAudio(text);
    if (fallbackBuffer && fallbackBuffer.length > 0) {
      return res.json({
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: {
                    mimeType: "audio/mp3",
                    data: fallbackBuffer.toString("base64")
                  }
                }
              ]
            }
          }
        ]
      });
    }

    return res.status(500).json({ error: "Gagal menghasilkan audio TTS" });
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
