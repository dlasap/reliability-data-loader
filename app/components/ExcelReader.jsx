"use client"; // if using Next.js App Router

import { useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelReader() {
  const [data, setData] = useState([]);

  function extractTableFromXLSX(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        // 🔍 Find the row that includes "Prompt" and "Inp1"
        const headerIndex = rows.findIndex((row) =>
          row.some((cell) => typeof cell === "string" && /prompt/i.test(cell))
        );

        if (headerIndex === -1) return reject("Header not found");

        const headers = rows[headerIndex];
        const dataRows = rows.slice(headerIndex + 1);

        const tableData = dataRows.map((row) =>
          Object.fromEntries(headers.map((h, i) => [h || `col${i}`, row[i]]))
        );

        resolve(tableData);
      };

      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Get first sheet name
      const sheetName = workbook.SheetNames[0];
      // Get data from first sheet
      const sheet = workbook.Sheets[sheetName];
      // const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // defval prevents undefined values

      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        header: 1, // read raw rows as arrays
        defval: "",
      });
      const headers = jsonData[0]; // pick second row as headers
      const rows = jsonData.slice(1);

      // const data = rows.map((row: any[]) =>
      //   Object.fromEntries(headers.map((h: any, i: number) => [h || `col${i}`, row[i]]))
      // );

      const data = await extractTableFromXLSX(file);
      console.log("[CONSOLE INFO] :  ~ handleFileUpload ~ data:", data);

      // setData(jsonData);
      setData(data);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {data.length > 0 && (
        <div className="mt-4">
          <h2>Preview:</h2>
          <pre className="bg-gray-100 p-4 rounded max-h-80 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
