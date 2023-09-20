"use client";

import React, { useEffect, useRef, useState } from "react";
import { apiPostCall } from "../utils/apiCall";
import Papa from "papaparse";
import { CSVExporter } from "./CSVExporter";
import { replaceValuesInString } from "../utils/utils";
import { Progress } from "@nextui-org/react";
const allowedExtensions = ["csv"];

// import { CSVTable } from "./CSVTable";

import dynamic from "next/dynamic";

const static_data = `Functions;Failure Modes;Root Causes;Failure Effects;Recommended Tasks
To provide clean and compressed air to the gas turbine, with a performance standard of maintaining an inlet air temperature below 50°C and a pressure drop across the system below 2% of the total pressure.;Air contamination;Inadequate filtration system;Reduced turbine efficiency, increased wear and tear on turbine components;Regular maintenance and replacement of air filters
To contain Ambient Air in the system.;Air leakage;Damaged seals or gaskets;Reduced turbine efficiency, increased risk of equipment damage;Regular inspection and replacement of seals and gaskets
To indicate dp at the control room with an accuracy of 1%.;Incorrect pressure measurement;Faulty pressure sensor;Inaccurate control of turbine operation;Regular calibration and maintenance of pressure sensors
To indicate ct at the control room with an accuracy of 1%.;Incorrect temperature measurement;Faulty temperature sensor;Inaccurate control of turbine operation;Regular calibration and maintenance of temperature sensors
To indicate cl at the control room with an accuracy of 1%.;Incorrect level measurement;Faulty level sensor;Inaccurate control of turbine operation;Regular calibration and maintenance of level sensors
To indicate dp locally with an accuracy of 2%.;Incorrect pressure measurement;Faulty pressure gauge;Inaccurate monitoring of system performance;Regular calibration and maintenance of pressure gauges
To look acceptable;Visual defects;Worn-out or damaged components;Reduced turbine efficiency, increased risk of equipment damage;Regular inspection and replacement of worn-out or damaged components
To achieve an economy/efficiency of a minimum efficiency of 99.97% for particles as small as 0.3 micrometers for the system.;Inadequate filtration system;Improper maintenance of filtration system;Reduced turbine efficiency, increased wear and tear on turbine components;Regular maintenance and replacement of filtration system
To emit no more than None < 78db(A) for the system.;Excessive noise;Faulty noise reduction measures;Increased risk of hearing damage for personnel;Regular inspection and maintenance of noise reduction measures
To protect personnel from moving parts;Contact with moving parts;Lack of safety guards or barriers;Increased risk of personnel injury;Installation and maintenance of safety guards and barriers`;

const CSVTable = dynamic(() => import("./CSVTable"), { ssr: false });

const CSVReader = () => {
  const [data, setData] = useState([]);
  const [response, setResponse] = useState("");
  const [fileData, setFileData] = useState([]);
  const [availableOutputFileNames, setAvailableOutputFileNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [context, setContext] = useState("");

  const processParsedData = (data) => {
    const mapped_valid_data = data
      .map((d) => {
        if (!d.Filename || !d.Prompt.trim()) return null;
        setFileName(d.fileName);

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

  const handleContextChange = (e) => {
    setContext(e.target.value);
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

    const params = { prompts: generatedPrompts, context };
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
      {context}
      <div
        style={{
          background: "yellow",
          padding: "1rem",
          borderStyle: "dashed",
          width: "fit-content",
          margin: "2rem 0",
        }}
      >
        <div>
          <label htmlFor="csvInput" style={{ display: "block" }}>
            Enter Context
          </label>
          <input
            style={{
              height: "50px",
              width: "200px",
              background: "white",
              color: "black",
            }}
            onChange={handleContextChange}
            value={context}
            id="csvInput"
            name="ctx"
            type="text"
          />
        </div>
      </div>

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
        // response && <CSVTable data={response} />
        <>{response && "Data is ready to be exported"}</>
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
            <CSVExporter data={response} file_name={availableOutputFileNames[0]} />
          </button>
        </div>
      )}
      {/* <div style={{ marginTop: "3rem" }}>{error ? error : data.map((col, idx) => <div key={idx}>{col}</div>)}</div> */}
      {/* <CSVTable /> */}
    </div>
  );
};

export default CSVReader;
