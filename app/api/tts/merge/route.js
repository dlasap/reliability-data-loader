// app/api/tts/merge/route.js
// npm i @aws-sdk/client-polly fluent-ffmpeg ffmpeg-static tmp-promise
import { NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { file as tmpFile, dir as tmpDir } from "tmp-promise";
import { createWriteStream, promises as fs } from "fs";
import path from "path";

// Important: FFmpeg requires Node runtime (not Edge)
export const runtime = "nodejs";


const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// On some platforms ffmpeg-static can be null; guard it.
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

function writeToFile(input, filePath) {
  return new Promise((resolve, reject) => {
    const writable = createWriteStream(filePath);
    if (input instanceof Buffer || input?.byteLength !== undefined) {
      writable.write(Buffer.from(input), err => {
        if (err) return reject(err);
        writable.end();
      });
    } else if (input && typeof input.pipe === "function") {
      input.pipe(writable);
    } else {
      return reject(new Error("Unknown audio stream type from Polly"));
    }
    writable.on("finish", resolve);
    writable.on("error", reject);
  });
}

const polly = new PollyClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export async function POST(req) {
  try {
    const { texts, voiceId = "Matthew", engine = "neural" } = await req.json();

    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: "Provide non-empty 'texts' array" }, { status: 400 });
    }

    // 1. synthesize each chunk
    const { path: workDirPath, cleanup: cleanupDir } = await tmpDir({ unsafeCleanup: true });
    const partFiles = [];

    for (let i = 0; i < texts.length; i++) {
      const t = texts[i];
      if (typeof t !== "string" || !t.trim()) {
        throw new Error(`texts[${i}] is empty or not a string`);
      }

      const cmd = new SynthesizeSpeechCommand({
        Text: t,
        VoiceId: voiceId,
        Engine: engine,
        OutputFormat: "mp3",
        SampleRate: "22050",
      });

      const res = await polly.send(cmd);
      if (!res.AudioStream) throw new Error(`No audio for chunk ${i + 1}`);

      const partPath = path.join(workDirPath, `part_${i}.mp3`);
      await writeToFile(res.AudioStream, partPath);
      partFiles.push(partPath);
    }

    // 2. concat list for ffmpeg
    const listPath = path.join(workDirPath, "concat.txt");
    const listContent = partFiles.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join("\n");
    await fs.writeFile(listPath, listContent, "utf8");

    // 3. run ffmpeg concat
    const { path: outPath, cleanup: cleanupOut } = await tmpFile({ postfix: ".mp3" });
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(listPath)
        .inputOptions(["-f concat", "-safe 0"])
        .outputOptions(["-c copy"]) // fast; if you hear clicks, re-encode instead
        .on("error", reject)
        .on("end", resolve)
        .save(outPath);
    });

    const finalBuffer = await fs.readFile(outPath);

    await cleanupOut();
    await cleanupDir();

    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="speech_merged.mp3"',
        "Content-Length": String(finalBuffer.length),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Merge failed" }, { status: 500 });
  }
}