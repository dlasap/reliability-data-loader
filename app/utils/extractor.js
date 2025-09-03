// lib/extractors.js
export async function extractTextFromFile(file) {
  const mime = file.type || "";
  const name = (file.name || "").toLowerCase();

  // PDF
  // PDF
  if (mime.includes("pdf") || name.endsWith(".pdf")) {
    // 1) Load pdfjs
    const pdfjs = await import("pdfjs-dist");

    // 2) Point workerSrc to the ESM worker file
    // Most reliable approach across bundlers:
    try {
      const workerUrl = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url);
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.toString();
    } catch (e) {
      // Fallback for bundlers that return the URL via default export:
      const workerMod = await import("pdfjs-dist/build/pdf.worker.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = workerMod && workerMod.default ? workerMod.default : workerMod;
    }

    // 3) Parse
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it) => it.str).join(" ") + "\n";
    }
    return text;
  }

  // DOCX
  if (mime.includes("word") || mime.includes("officedocument") || name.endsWith(".docx")) {
    const mammoth = await import("mammoth/mammoth.browser");
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  }

  // CSV/TSV
  if (mime.includes("csv") || name.endsWith(".csv") || name.endsWith(".tsv")) {
    const Papa = (await import("papaparse")).default;
    const txt = await file.text();
    const parsed = Papa.parse(txt, { skipEmptyLines: true });
    return parsed.data.map((row) => (Array.isArray(row) ? row.join(" ") : String(row))).join("\n");
  }

  // TXT / MD / fallback
  return await file.text();
}

export function cleanSupport(raw = "") {
  return String(raw)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
