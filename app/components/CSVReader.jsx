"use client";

import React, { useEffect, useState } from "react";
import { apiPostCall } from "../utils/apiCall";
import Papa from "papaparse";
import { CSVExporter } from "./CSVExporter";
import { replaceValuesInString } from "../utils/utils";
import { Progress } from "@nextui-org/react";
const allowedExtensions = ["csv"];

// import { CSVTable } from "./CSVTable";

import dynamic from "next/dynamic";

const CSVTable = dynamic(() => import("./CSVTable"), { ssr: false });

const CSVReader = () => {
  const [data, setData] = useState([]);
  const [response, setResponse] = useState("");
  const [fileData, setFileData] = useState([]);
  const [availableOutputFileNames, setAvailableOutputFileNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [file, setFile] = useState("");

  const processParsedData = (data) => {
    const mapped_valid_data = data
      .map((d) => {
        if (!d.Filename || !d.Prompt.trim()) return null;

        const pattern = /\[(.*?)\]/g;

        const variables = d.Prompt.match(pattern);
        const input_variables = variables.map((variable) => variable.slice(1, -1));

        let outputStr = replaceValuesInString(d.Prompt, variables, d, input_variables);

        return {
          ...d,
          Prompt: outputStr,
        };
      })
      .filter(Boolean);

    return mapped_valid_data;
  };

  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };

  const handleParse = () => {
    if (!file) return setError("Enter a valid file");

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const processedData = processParsedData(parsedData);
      setFileData(parsedData);

      const AIPromptResults = await getResponse(processedData);

      const columns = Object.keys(parsedData[0]);
      setData(columns);
    };
    reader.readAsText(file);
  };

  const getResponse = async (processedData) => {
    setIsLoading(true);
    const generatedPrompts = processedData.map((pd) => pd.Prompt);
    console.log("%c  generatedPrompts:", "color: #0e93e0;background: #aaefe5;", generatedPrompts);

    let uniqueFileNames = [];
    processedData?.map((pd) => {
      if (!uniqueFileNames.includes(pd.Filename)) {
        uniqueFileNames.push(pd.Filename);
      }
    });

    setAvailableOutputFileNames(uniqueFileNames);

    const params = { prompts: generatedPrompts };
    // const result = await apiPostCall("https://reliability-management-backend-five.vercel.app/operating_context_prompts", params);
    const result = await apiPostCall("http://localhost:3019/operating_context_prompts", params);
    setIsLoading(false);

    const concat_response = result?.data?.map((d) => d?.response).join(" \n \n");
    console.log("%c  concat_response:", "color: #0e93e0;background: #aaefe5;", concat_response);

    setResponse(concat_response);
  };

  useEffect(() => {
    if (file && !response) getResponse();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("X", availableOutputFileNames);
  }, [availableOutputFileNames]);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          background: "yellow",
          padding: "1rem",
          borderStyle: "dashed",
          width: "fit-content",
        }}
      >
        <div>
          <label htmlFor="csvInput" style={{ display: "block" }}>
            Enter CSV File
          </label>
          <input onChange={handleFileChange} id="csvInput" name="file" type="File" />
          {file && (
            <div
              style={{
                padding: "1rem",
                width: "fit-content",
              }}
            >
              <button
                style={{
                  background: "orange",
                  color: "white",
                  padding: "0.5rem",
                  border: "1px solid black",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={handleParse}
              >
                Start Generating Responses
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            height: "fit-content",
          }}
        >
          LOADING...
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            style={{
              width: "1000px",
            }}
          />
        </div>
      ) : (
        response && <CSVTable data={response} />
      )}

      {file && response && (
        <div style={{}}>
          <button
            style={{
              background: "orange",
              color: "white",
              padding: "0.5rem",
              border: "2px solid white",
              fontWeight: "600",
            }}
          >
            <CSVExporter data={response} file_name="Asset List" />
          </button>
        </div>
      )}
      {/* <div style={{ marginTop: "3rem" }}>{error ? error : data.map((col, idx) => <div key={idx}>{col}</div>)}</div> */}
      {/* <CSVTable /> */}
    </div>
  );
};

export default CSVReader;
