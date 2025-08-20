"use client";

import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ExcelJS from "exceljs";
import "github-markdown-css/github-markdown-light.css"; // or -dark.css

/* ---------- Preprocessing ---------- */

function preprocessRaw(text) {
  let t = String(text || "").replace(/\r\n/g, "\n");
  t = t.replace(/<br\s*\/?>/gi, "\n").replace(/&lt;br\s*\/?&gt;/gi, "\n");
  return t;
}

/* ---------- Table detection & repair ---------- */

function smartSplitTables(text) {
  const lines = text.split("\n");
  const blocks = [];
  let cur = [];
  let inBlock = false;

  for (const ln of lines) {
    if (ln.includes("|")) {
      cur.push(ln);
      inBlock = true;
    } else {
      if (inBlock && ln.trim() === "") {
        cur.push(ln);
      } else {
        if (cur.length) blocks.push(cur.join("\n").trim());
        cur = [];
        inBlock = false;
      }
    }
  }
  if (cur.length) blocks.push(cur.join("\n").trim());
  return blocks.filter(b => b.split("\n").filter(l => l.includes("|")).length >= 2);
}

function fixBrokenRows(tableText) {
  const out = [];
  let carry = "";

  for (const raw of tableText.split("\n")) {
    let line = raw.replace(/\s+$/g, "");
    if (!line.trim()) {
      if (carry) carry += " ";
      continue;
    }
    const candidate = carry ? carry + " " + line : line;
    const pipeCount = (candidate.match(/\|/g) || []).length;

    if (pipeCount >= 2) {
      out.push(candidate);
      carry = "";
    } else {
      carry = candidate;
    }
  }
  if (carry) out.push(carry);
  return out.join("\n");
}

/* ---------- Parsing ---------- */

function parsePipeRow(row) {
  let cells = row.split("|").map(s => s.trim());
  if (cells.length && cells[0] === "") cells = cells.slice(1);
  if (cells.length && cells[cells.length - 1] === "") cells = cells.slice(0, -1);
  return cells;
}

function cleanCell(s) {
  let v = String(s ?? "").replace(/\t/g, " ").replace(/\s+/g, " ").trim();
  v = v.replace(/^\d+\s*[\.\)]\s+/, ""); // drop "1. ", "10) " prefixes
  return v;
}

function parseTableBlock(block) {
  const fixed = fixBrokenRows(block);
  const lines = fixed.split("\n").filter(l => l.includes("|"));
  if (!lines.length) return null;

  const header = parsePipeRow(lines[0]).map(h => cleanCell(h));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parsePipeRow(lines[i]);
    const looksLikeSep = cells.every(c => /^:?-{2,}:?$/.test(c));
    if (looksLikeSep) continue;

    const cleaned = cells.map(c => cleanCell(c));

    if (cleaned.length < header.length) {
      while (cleaned.length < header.length) cleaned.push("");
    } else if (cleaned.length > header.length) {
      const keep = cleaned.slice(0, header.length - 1);
      const rest = cleaned.slice(header.length - 1);
      keep.push(rest.join(" | "));
      cleaned.splice(0, cleaned.length, ...keep);
    }
    rows.push(cleaned);
  }

  const nonEmpty = rows.filter(r => r.some(c => (c || "").trim() !== ""));
  if (!header.length || !nonEmpty.length) return null;

  return { headers: header, rows: nonEmpty };
}

/* ---------- Excel builder ---------- */

// async function buildWorkbookFromText(raw) {
//   const text = preprocessRaw(raw);
//   const blocks = smartSplitTables(text);

//   const wb = new ExcelJS.Workbook();
//   wb.creator = "GFM Exporter";
//   wb.created = new Date();

//   if (blocks.length === 0) {
//     const ws = wb.addWorksheet("Text");
//     ws.addRow(["Content"]);
//     ws.getRow(1).font = { bold: true };
//     const r = ws.addRow([text]);
//     r.getCell(1).alignment = { wrapText: true, vertical: "top" };
//     ws.columns = [{ width: 100 }];
//     return wb;
//   }

//   blocks.forEach((b, idx) => {
//     const ws = wb.addWorksheet(`Table_${idx + 1}`);
//     const parsed = parseTableBlock(b);

//     if (!parsed) {
//       ws.addRow(["Raw"]);
//       ws.getRow(1).font = { bold: true };
//       const r = ws.addRow([b]);
//       r.getCell(1).alignment = { wrapText: true, vertical: "top" };
//       ws.columns = [{ width: 100 }];
//       return;
//     }

//     ws.addRow(parsed.headers);
//     ws.getRow(1).font = { bold: true };
//     ws.getRow(1).alignment = { vertical: "middle" };
//     ws.views = [{ state: "frozen", ySplit: 1 }];
//     ws.autoFilter = {
//       from: { row: 1, column: 1 },
//       to: { row: 1, column: parsed.headers.length },
//     };

//     parsed.rows.forEach(r => {
//       const row = ws.addRow(r);
//       row.eachCell(cell => {
//         cell.alignment = { wrapText: true, vertical: "top" };
//       });
//     });

//     const maxLen = (col) => {
//       const h = parsed.headers[col] ?? "";
//       const maxRow = parsed.rows.reduce((m, r) => {
//         const val = r[col] ?? "";
//         const longestLine = String(val)
//           .split("\n")
//           .reduce((mm, line) => Math.max(mm, line.length), 0);
//         return Math.max(m, longestLine);
//       }, 0);
//       return Math.max(h.length, maxRow);
//     };

//     ws.columns = parsed.headers.map((_, i) => {
//       const w = Math.min(60, Math.max(14, Math.ceil(maxLen(i) * 0.9)));
//       return { width: w };
//     });

//     ws.eachRow((row, rowNumber) => {
//       row.eachCell((cell) => {
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" },
//         };
//         const a = cell.alignment || {};
//         cell.alignment = { ...a, wrapText: true, vertical: "top" };
//       });
//       if (rowNumber === 1) {
//         row.eachCell(cell => {
//           cell.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "FFF2F2F2" },
//           };
//         });
//       }
//     });
//   });

//   return wb;
// }

/* ---------- Excel builder (single worksheet) ---------- */

async function buildWorkbookFromText(raw) {
  const text = preprocessRaw(raw);
  const blocks = smartSplitTables(text);

  const wb = new ExcelJS.Workbook();
  wb.creator = "GFM Exporter";
  wb.created = new Date();

  const ws = wb.addWorksheet("Data");

  // If no table blocks found, just dump the text into one cell
  if (blocks.length === 0) {
    ws.addRow(["Content"]);
    ws.getRow(1).font = { bold: true };
    const r = ws.addRow([text]);
    r.getCell(1).alignment = { wrapText: true, vertical: "top" };
    ws.columns = [{ width: 100 }];
    return wb;
  }

  let currentRow = 1;
  let globalMaxCols = 0;

  const applyBordersAndWrap = (row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      const a = cell.alignment || {};
      cell.alignment = { ...a, wrapText: true, vertical: "top" };
    });
  };

  blocks.forEach((b, idx) => {
    const parsed = parseTableBlock(b);

    if (!parsed) {
      // Fallback: write raw block as single-cell text
      if (currentRow !== 1) currentRow++; // blank line between sections
      const header = ws.getRow(currentRow++);
      header.values = ["Raw"];
      header.font = { bold: true };
      const rawRow = ws.getRow(currentRow++);
      rawRow.values = [b];
      rawRow.getCell(1).alignment = { wrapText: true, vertical: "top" };
      globalMaxCols = Math.max(globalMaxCols, 1);
      return;
    }

    // Space between tables
    if (currentRow !== 1) currentRow++;

    // Optional mini title (comment out if not wanted)
    // const title = ws.getRow(currentRow++);
    // title.values = [`Table ${idx + 1}`];
    // title.font = { bold: true };

    // Header
    const headerRow = ws.getRow(currentRow++);
    headerRow.values = parsed.headers;
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2F2F2" },
      };
    });
    applyBordersAndWrap(headerRow);

    // Rows
    parsed.rows.forEach((arr) => {
      const r = ws.getRow(currentRow++);
      r.values = arr;
      applyBordersAndWrap(r);
    });

    globalMaxCols = Math.max(globalMaxCols, parsed.headers.length);
  });

  // Freeze the very top row if the first item had a header there.
  // (If you kept a title row, change ySplit to 2.)
  ws.views = [{ state: "frozen", ySplit: 1 }];

  // Auto width across ALL content
  const colCount = Math.max(globalMaxCols, ws.columnCount || 1);
  const getLongestLineLen = (val) => {
    const s = (val == null ? "" : String(val));
    return s.split("\n").reduce((m, line) => Math.max(m, line.length), 0);
  };

  const widthFor = (colIdx) => {
    let maxLen = 0;
    ws.eachRow((row) => {
      const cell = row.getCell(colIdx);
      maxLen = Math.max(maxLen, getLongestLineLen(cell.value));
    });
    // Reasonable min/max; tweak as you like
    return Math.min(60, Math.max(14, Math.ceil(maxLen * 0.9)));
  };

  ws.columns = Array.from({ length: colCount }, (_, i) => ({
    width: widthFor(i + 1),
  }));

  return wb;
}


/* ---------- XLSXExporter ---------- */

export default function XLSXExporter({data}) {
  const [text, setText] = useState(data || "");

  const preprocessed = useMemo(() => preprocessRaw(text), [text]);
  const disabled = useMemo(() => preprocessed.trim().length === 0, [preprocessed]);

  const onDownload = async () => {
    const wb = await buildWorkbookFromText(preprocessed);
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "processed_data.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "grid", gap: 16, padding: 24 }}>
      <h1 style={{ margin: 0, color: "orange", background: "white", width: "fit-content", padding: "2px 8px", borderRadius: "4px"}}>Preview + Export to Excel</h1>

      <textarea
        placeholder="Paste your Markdown / tables (GFM) here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          height: 220,
          fontFamily: "monospace",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      <button
        onClick={onDownload}
        disabled={disabled}
        style={{
          width: "fit-content",
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ddd",
          cursor: disabled ? "not-allowed" : "pointer",
          background: "orange"
        }}
      >
        Download .xlsx
      </button>

      <div className="markdown-body" style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {preprocessed}
        </ReactMarkdown>
      </div>
    </div>
  );
}
