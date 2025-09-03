import { useState } from "react";
import { CSVLink } from "react-csv";

export const CSVExporter = ({ data = "", file_name = "export" }) => {
  const [exportAsText, setExportAsText] = useState(false);

  // Sanitize and convert semicolon-separated to CSV-style
  const processedData = data.replace(/;/g, ",").replace(/(\$[,\d]+)(?=(,[\d]+))/g, (match, p1) => p1.replace(/,/g, ""));

  // Convert to array of arrays for CSVLink
  const csvArray = processedData.split("\n").map((row) => row.split(",").map((cell) => cell.trim()));
  console.log("%c  csvArray:", "color: #0e93e0;background: #aaefe5;", { processedData, csvArray });

  const downloadTxt = () => {
    const blob = new Blob([processedData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = file_name.endsWith(".txt") ? file_name : `${file_name}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <label
        className={{
          margin: "1rem",
        }}
      >
        <input type="checkbox" checked={exportAsText} onChange={() => setExportAsText((prev) => !prev)} /> Export as .txt
      </label>
      <br />
      {exportAsText ? (
        <button
          style={{
            margin: "1rem",
            borderRadius: "5px",
            background: "orange",
            padding: "5px",
            color: "white",
            cursor: "pointer",
            border: "1pax dashed orange",
          }}
          onClick={downloadTxt}
        >
          Download TXT File
        </button>
      ) : (
        <div
          style={{
            margin: "1rem",
            borderRadius: "5px",
            background: "orange",
            padding: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          <CSVLink filename={`${file_name}.csv`} data={csvArray}>
            Download CSV File
          </CSVLink>
        </div>
      )}
    </>
  );
};
