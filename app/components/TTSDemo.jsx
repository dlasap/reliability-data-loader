"use client";
import { useEffect, useState } from "react";

const voices = [
  // English (US)
  { id: "Joanna", label: "Joanna (US, Female, Neural)" },
  { id: "Matthew", label: "Matthew (US, Male, Neural)" },
  { id: "Ivy", label: "Ivy (US, Female, Child)" },
  { id: "Justin", label: "Justin (US, Male, Child)" },
  { id: "Salli", label: "Salli (US, Female)" },
  { id: "Joey", label: "Joey (US, Male)" },

  // English (UK)
  { id: "Amy", label: "Amy (UK, Female, Neural)" },
  { id: "Brian", label: "Brian (UK, Male, Neural)" },
  { id: "Emma", label: "Emma (UK, Female)" },

  // English (AU)
  { id: "Olivia", label: "Olivia (AU, Female, Neural)" },
  { id: "Russell", label: "Russell (AU, Male)" },
  { id: "Nicole", label: "Nicole (AU, Female)" },

  // German
  { id: "Marlene", label: "Marlene (DE, Female, Neural)" },
  { id: "Vicki", label: "Vicki (DE, Female, Neural)" },
  { id: "Hans", label: "Hans (DE, Male)" },

  // French
  { id: "Lea", label: "Léa (FR, Female, Neural)" },
  { id: "Celine", label: "Céline (FR, Female)" },
  { id: "Mathieu", label: "Mathieu (FR, Male)" },

  // Spanish
  { id: "Lucia", label: "Lucía (ES, Female)" },
  { id: "Enrique", label: "Enrique (ES, Male)" },
  { id: "Lupe", label: "Lupe (US-ES, Female, Neural)" },
  { id: "Miguel", label: "Miguel (US-ES, Male, Neural)" },
  { id: "Penelope", label: "Penélope (US-ES, Female)" },

  // Italian
  { id: "Bianca", label: "Bianca (IT, Female, Neural)" },
  { id: "Giorgio", label: "Giorgio (IT, Male)" },

  // Japanese
  { id: "Takumi", label: "Takumi (JP, Male, Neural)" },
  { id: "Mizuki", label: "Mizuki (JP, Female)" },

  // Korean
  { id: "Seoyeon", label: "Seoyeon (KR, Female, Neural)" },

  // Chinese
  { id: "Zhiyu", label: "Zhiyu (CN, Female)" },
];

// Split text into <=1500-char chunks (sentence/paragraph friendly).
function splitIntoChunks(input, maxLen = 1500) {
  const text = input.trim().replace(/\s+\n/g, "\n").replace(/[ \t]+/g, " ");
  if (text.length <= maxLen) return [text];

  const paras = text.split(/\n{2,}/);
  const chunks = [];
  let buf = "";

  const push = () => { if (buf) { chunks.push(buf.trim()); buf = ""; } };
  const canAdd = s => (buf ? buf.length + 1 + s.length : s.length) <= maxLen;
  const add = s => (buf = buf ? `${buf} ${s}` : s);

  const smartAdd = s => {
    if (canAdd(s)) { add(s); return; }
    // word-split fallback
    let cur = "";
    for (const w of s.split(/\s+/)) {
      const cand = cur ? `${cur} ${w}` : w;
      if (cand.length > maxLen) {
        if (cur) { if (canAdd(cur)) add(cur); else push(), buf = cur, push(); }
        // hard-split ultra-long token
        for (let i = 0; i < w.length; i += maxLen) {
          const slice = w.slice(i, i + maxLen);
          if (canAdd(slice)) add(slice); else push(), buf = slice, push();
        }
        cur = "";
      } else {
        cur = cand;
      }
    }
    if (cur) { if (canAdd(cur)) add(cur); else push(), buf = cur, push(); }
  };

  for (const p of paras) {
    if (!p.trim()) continue;
    const sentences = p.match(/[^.!?]+[.!?]*/g) || [p];
    for (const s of sentences) {
      const piece = s.trim();
      if (!piece) continue;
      if (canAdd(piece)) add(piece);
      else { push(); if (piece.length <= maxLen) add(piece); else smartAdd(piece); }
    }
    if (buf && buf.length + 1 <= maxLen) buf += "\n";
  }
  push();
  return chunks.filter(Boolean);
}

// Promise with timeout (rejects on deadline).
function withTimeout(promise, ms, controller) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      controller?.abort?.();
      reject(new Error(`Timed out after ${ms} ms`));
    }, ms);
    promise.then(v => { clearTimeout(t); resolve(v); })
           .catch(e => { clearTimeout(t); reject(e); });
  });
}

// Triggers a download in browser
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


export default function TTSDemo({ textProp}) {

  const [text, setText] = useState(textProp ?? "Hello from Cebu! This is an MP3 from AWS Polly.");
  const [engine, setEngine] = useState("standard");
  const [voiceName, setVoiceName] = useState("Joanna");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ total: 0, done: 0, mode: "idle" });

  // async function handleDownload(e) {
  //   e.preventDefault();
  //   if (!text.trim()) return;

  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/tts", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         text,
  //         voiceId: voiceName,
  //         engine,
  //         // Optional overrides:
  //         // voiceId: "Matthew",
  //         // engine: "neural",
  //       }),
  //     });

  //     if (!res.ok) {
  //       const err = await res.json().catch(() => ({}));
  //       throw new Error(err.error || "Failed to synthesize");
  //     }

  //     const blob = await res.blob(); // audio/mpeg
  //     const url = URL.createObjectURL(blob);

  //     // Trigger download
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "speech.mp3";
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     URL.revokeObjectURL(url);
  //   } catch (err) {
  //     alert(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // --- helpers ---------------------------------------------------------------


// --- main ---------------------------------------------------------------

/**
 * handleDownload60s
 * - Enforces a 60s budget total (configurable)
 * - Try MERGE first (single MP3)
 * - On timeout/failure, fall back to per-part sequential downloads
 *
 * UI state you may keep in your component:
 *   const [loading, setLoading] = useState(false);
 *   const [progress, setProgress] = useState({ total: 0, done: 0, mode: "idle" });
 *
 * Pass setters into this function, or inline if inside the component.
 */
async function handleDownload(e) {
  e.preventDefault();
  if (!text?.trim()) return;

  const TIME_BUDGET_MS = 60_000;           // 60 seconds hard cap
  const MERGE_TIME_SHARE = 0.9;            // give merge up to 90% of the budget
  const start = Date.now();
  const deadline = () => TIME_BUDGET_MS - (Date.now() - start);

  setLoading(true);
  setProgress({ total: 0, done: 0, mode: "starting" });

  try {
    // 1) Chunk the text
    const chunks = splitIntoChunks(text, 1800);
    setProgress({ total: chunks.length, done: 0, mode: "chunked" });

    // 2) Quick heuristic: if few chunks, merged path is more likely to finish
    const preferMerge = chunks.length <= 20; // tweak as you like

    if (preferMerge) {
      setProgress(p => ({ ...p, mode: "merge-try" }));
      const controller = new AbortController();
      const mergePromise = fetch("/api/tts/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: chunks, voiceId: voiceName, engine }),
        signal: controller.signal,
      });

      // Give merge at most 90% of the remaining time
      const msForMerge = Math.max(1000, Math.floor(deadline() * MERGE_TIME_SHARE));
      try {
        const res = await withTimeout(mergePromise, msForMerge, controller);
        if (!res.ok) {
          // Merge failed quickly -> fallback to parts
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Merge failed");
        }
        const blob = await res.blob();
        downloadBlob(blob, "speech_merged.mp3");
        setProgress(p => ({ ...p, done: chunks.length, mode: "merged" }));
        return; // Done within window 🎉
      } catch (mergeErr) {
        // timeout or server error -> fallback to parts with remaining time
        // console.warn("Merge path failed, falling back to per-part:", mergeErr);
      }
    }

    // 3) Fallback: per-part sequential downloads within remaining time
    setProgress(p => ({ ...p, done: 0, mode: "parts" }));

    for (let i = 0; i < chunks.length; i++) {
      const timeLeft = deadline();
      if (timeLeft <= 750) {
        // Not enough time for a safe call; stop here.
        break;
      }
      const controller = new AbortController();
      const partPromise = fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chunks[i], voiceId: voiceName, engine }),
        signal: controller.signal,
      });

      // Budget each part conservatively (e.g., 60% of remaining, min 2s)
      const perPartBudget = Math.max(2000, Math.floor(timeLeft * 0.6));
      let res;
      try {
        res = await withTimeout(partPromise, perPartBudget, controller);
      } catch (e) {
        // timed out or aborted -> stop; already downloaded earlier parts
        break;
      }
      if (!res.ok) {
        // server error for this part; skip the rest to respect window
        break;
      }
      const blob = await res.blob();
      downloadBlob(blob, `speech_part${i + 1}.mp3`);
      setProgress(p => ({ ...p, done: i + 1, mode: "parts" }));
    }
  } catch (err) {
    alert(err?.message || "TTS failed");
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    setText(textProp);
  }, [textProp]);

  return (
    <main style={{ maxWidth: 680, padding: 16, background: "yellow" }}>
      <h1 style={{ marginBottom: "1rem"}}>MP3 Download powered by Polly</h1>
      <form onSubmit={handleDownload}>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to synthesize…"
          style={{ width: "100%", padding: 12, marginBottom: 12 }}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ marginBottom: 16, height: "100%" }}>
            <label htmlFor="voice" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
              Engine:
            </label>
            <select value={engine} onChange={(e) => setEngine(e.target.value)} style={{ padding: "8px 12px", minWidth: 280 }}>
              <option value="standard">Standard</option>
              <option value="neural">Neural</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="voice" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
              Voice:
            </label>
            <select id="voice" value={voiceName} onChange={(e) => setVoiceName(e.target.value)} style={{ padding: "8px 12px", minWidth: 280 }}>
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ padding: "10px 16px", fontWeight: 600 }}>
          {loading ? "Synthesizing…" : "Download MP3"}
        </button>
      </form>
      <p style={{ marginTop: 12, opacity: 0.7, fontStyle: "italic" }}>Tip: Use a neural voice like “Joanna” or “Matthew” for higher quality.</p>

      {loading && (
  <div className="text-sm">
    Mode: {progress.mode} • {progress.done}/{progress.total}
  </div>
)}

    </main>
  );
}
