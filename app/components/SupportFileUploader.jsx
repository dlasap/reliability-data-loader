// components/SupportFileUploader.jsx
"use client";
import { useState } from "react";
import { extractTextFromFile, cleanSupport } from "../utils/extractor";
import { useSupport } from "../context/supportContext";

const MAX_SUPPORT_CHARS = 120000; // ~safe cap

 const SupportFileUploader = () =>{
  const { setSupportText } = useSupport();
  const [status, setStatus] = useState("");
  const [previewChars, setPreviewChars] = useState(0);
  const [name, setName] = useState("");

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Extracting...");
    setName(file.name);

    try {
      const raw = await extractTextFromFile(file);
      const cleaned = cleanSupport(raw);
      const capped = cleaned.slice(0, MAX_SUPPORT_CHARS);
      setSupportText(capped);
      setPreviewChars(capped.length);
      setStatus("Ready ✓");
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err?.message || "failed to extract"}`);
      setSupportText(null);
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      background: "yellow",
      width: "fit-content",
      padding: "8px 16px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      marginBottom: "1rem",
    }}>
      <label style={{
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333"
      }}>Support context file</label>
      <input
        type="file"
        accept=".pdf,.docx,.txt,.md,.csv"
        onChange={onPick}
      />
      <div className="text-xs text-gray-500" style={{
        color: "green",
        fontSize: "18px",
        fontWeight: "bold",
        background: "white",
        padding: "4px 8px",
      }}>
        {status} {name ? `• ${name}` : ""}{" "}
        {previewChars ? `• ${previewChars.toLocaleString()} chars` : ""}
      </div>
      <p className="text-xs text-gray-500" style={{ fontStyle: "italic", fontWeight: "bold"}}> 
        Tip: capped at {MAX_SUPPORT_CHARS.toLocaleString()} characters to keep
        prompts stable.
      </p>
    </div>
  );
}

export default SupportFileUploader
