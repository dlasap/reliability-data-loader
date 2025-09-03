import { NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const polly = new PollyClient({
  region: process.env.AWS_REGION ?? "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const REGION = process.env.AWS_REGION || "eu-central-1";
// Keep chunks well below Polly's ~3000 char limit for TextType "text".
const MAX_CHARS_PER_CHUNK = 2600;

/* ---------- Polly client (server-only) ---------- */

function getPolly() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS credentials. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env.local");
  }

  return new PollyClient({
    region: REGION,
    credentials: { accessKeyId, secretAccessKey },
  });
}

/* ---------- Helpers ---------- */

/**
 * Split text into polite chunks:
 * 1) paragraphs, 2) sentences, 3) words – keeping each <= MAX_CHARS_PER_CHUNK
 */
function chunkText(input, maxLen = MAX_CHARS_PER_CHUNK) {
  const text = String(input || "").replace(/\s+/g, " ").trim();
  if (!text) return [];

  const chunks = [];
  const paragraphs = text.split(/\n{2,}|(?<=\.)\s*\n/); // blank lines or paragraph-ish breaks

  for (const para of paragraphs) {
    if (para.length <= maxLen) {
      chunks.push(para.trim());
      continue;
    }

    // Try sentence split
    const sentences = para.split(/(?<=[.!?])\s+/);
    let cur = "";
    for (const s of sentences) {
      if ((cur + " " + s).trim().length > maxLen) {
        if (cur) chunks.push(cur.trim());
        if (s.length <= maxLen) {
          cur = s;
        } else {
          // Fallback to word split
          const words = s.split(/\s+/);
          let wcur = "";
          for (const w of words) {
            if ((wcur + " " + w).trim().length > maxLen) {
              if (wcur) chunks.push(wcur.trim());
              wcur = w;
            } else {
              wcur = (wcur ? wcur + " " : "") + w;
            }
          }
          if (wcur) {
            cur = wcur; // may still be large next iteration; handled by length check
          } else {
            cur = "";
          }
        }
      } else {
        cur = (cur ? cur + " " : "") + s;
      }
    }
    if (cur) chunks.push(cur.trim());
  }

  return chunks.filter(Boolean);
}

// Turn AudioStream (Readable or Uint8Array) into Uint8Array
async function audioStreamToUint8Array(stream) {
  if (stream instanceof Uint8Array) return stream;
  // Readable stream path
  const parts = [];
  for await (const chunk of stream) {
    parts.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return new Uint8Array(Buffer.concat(parts));
}

/**
 * Synthesize one chunk; if Engine not supported, retry with "standard".
 */
async function synthesizeChunk(polly, { text, voiceId, engine }) {
  const base = {
    Text: text,
    OutputFormat: "mp3",
    VoiceId: voiceId,
    TextType: "text",
  };

  try {
    const { AudioStream } = await polly.send(
      new SynthesizeSpeechCommand({ ...base, Engine: engine })
    );
    return await audioStreamToUint8Array(AudioStream);
  } catch (err) {
    // Retry fallback for Engine not supported
    const code = err?.name || err?.Code || err?.code;
    if (code && String(code).toLowerCase().includes("enginenotsupported")) {
      const { AudioStream } = await polly.send(
        new SynthesizeSpeechCommand({ ...base, Engine: "standard" })
      );
      return await audioStreamToUint8Array(AudioStream);
    }
    throw err;
  }
}

/* ---------- Route ---------- */

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      text,
      voiceId = "Matthew",
      engine = "neural", // will auto-fallback to "standard" if needed
      filename = "speech.mp3",
    } = body || {};

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' string" }, { status: 400 });
    }

    const polly = getPolly();
    const parts = chunkText(text, MAX_CHARS_PER_CHUNK);
    if (parts.length === 0) {
      return NextResponse.json({ error: "Empty text after normalization" }, { status: 400 });
    }

    // Synthesize all chunks (sequential keeps ordering, avoids Polly TPS limits)
    const buffers = [];
    for (const p of parts) {
      const audio = await synthesizeChunk(polly, { text: p, voiceId, engine });
      buffers.push(Buffer.from(audio));
    }

    // Concatenate MP3 segments (MP3 is frame-based; concatenation is acceptable)
    const merged = Buffer.concat(buffers);

    return new Response(merged, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${sanitizeFilename(filename)}"`,
        "Cache-Control": "no-store",
        "Content-Length": String(merged.length),
      },
    });
  } catch (err) {
    console.error("Polly long-TTS error:", err);
    const message =
      process.env.NODE_ENV === "development" ? String(err?.message || err) : "TTS failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ---------- Small util ---------- */

function sanitizeFilename(name) {
  const base = String(name || "speech.mp3").trim() || "speech.mp3";
  return base.replace(/[\/\\?%*:|"<>]/g, "_");
}
