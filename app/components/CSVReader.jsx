"use client";

import React, { useEffect, useRef, useState } from "react";
import { apiPostCall, batchApiPostCall } from "../utils/apiCall";
import Papa from "papaparse";
import { CSVExporter } from "./CSVExporter";
import { replaceValuesInString } from "../utils/utils";
import { Progress } from "@nextui-org/react";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { AI_MODELS_OPTIONS } from "../constants/constants";

import Switch from "@mui/material/Switch";

const allowedExtensions = ["csv"];

import aiModels from "../constants/ai-models";

import dynamic from "next/dynamic";
import { FormControlLabel, FormGroup } from "@mui/material";

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
  const { setItem: setContextItem, getItem: getContextItem, removeItem: removeContextItem } = useSessionStorage("contextStorage");
  const { setItem: setIsPersisted, getItem: getIsPersistemItem, removeItem: removePersistedItem } = useSessionStorage("isPersisted");

  const [data, setData] = useState([]);
  const [response, setResponse] = useState("");
  const [fileData, setFileData] = useState([]);
  const [availableOutputFileNames, setAvailableOutputFileNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [supportFile, setSupportFile] = useState("");

  const [fileName, setFileName] = useState("");
  const [context, setContext] = useState("");
  const [aiSettings, setAisettings] = useState({ temperature: 0, model: aiModels.gpt4o, frequency_penalty: 0.5, presence_penalty: 0.5 });

  const [isSessionRetained, setIsSessionRetained] = useState(false); // eslint-disable-line

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

  const handleSupportFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // const fileExtension = inputFile?.type.split("/")[1];
      // if (!allowedExtensions.includes(fileExtension)) {
      //   setError("Please input a csv file");
      //   return;
      // }

      // If input type is correct set the state
      setSupportFile(inputFile);
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

  // const getResponse = async (processedData) => {
  //   setIsLoading(true);
  //   const generatedPrompts = processedData.map((pd) => pd.Prompt);

  //   let uniqueFileNames = [];
  //   processedData?.map((pd) => {
  //     if (!uniqueFileNames.includes(pd.Filename)) {
  //       uniqueFileNames.push(pd.Filename);
  //     }
  //   });

  //   setAvailableOutputFileNames(uniqueFileNames);

  //   const params = { prompts: generatedPrompts, context };
  //   // const result = await apiPostCall("https://reliability-management-backend-five.vercel.app/operating_context_prompts", params);
  //   // const result = await apiPostCall("http://localhost:3019/operating_context_prompts", params);
  //   // setIsLoading(false);

  //   // const result = await batchApiPostCall("http://localhost:3019/operating_context_prompts", params, 10, aiSettings);
  //   const result = await batchApiPostCall("https://reliability-management-backend-five.vercel.app/operating_context_prompts", params, 10, aiSettings);

  //   setIsLoading(false);

  //   const concat_response = result?.data?.map((d) => d?.response).join(" \n \n");
  //   console.log("%c  concat_response:", "color: #0e93e0;background: #aaefe5;", concat_response.length);

  //   // setContextItem(concat_response);

  //   setResponse(concat_response);
  // };

  const getResponse = async (processedData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("context", context);
      formData.append("aiSettings", JSON.stringify(aiSettings));
      formData.append("prompts", JSON.stringify(processedData?.map((pd) => pd.Prompt)));
      formData.append("supportFile", supportFile);
      formData.append("batchSize", 10);

      // const result = await batchApiPostCall("https://reliability-management-backend-five.vercel.app/operating_context_prompts", formData);
      // const result = await batchApiPostCall("http://localhost:3019/operating_context_prompts", params, 10, aiSettings);
      // const result = await batchApiPostCall("http://localhost:3019/operating_context_prompts", formData);
      const result = await batchApiPostCall("https://reliability-management-backend-five.vercel.app/operating_context_prompts", formData);

      setResponse(result?.data?.map((d) => d?.response).join("\n\n"));
    } catch (error) {
      console.log("%c  error:", "color: #0e93e0;background: #aaefe5;", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAISettings = (key, value) => {
    setAisettings((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  useEffect(() => {
    if (file && supportFile && !response) getResponse();
    if (JSON.parse(getIsPersistemItem("isPersisted")) !== null) {
      const isPersisted = JSON.parse(getIsPersistemItem("isPersisted"));
      console.log("%c  isPersisted:", "color: #0e93e0;background: #aaefe5;", isPersisted);
      setIsSessionRetained(isPersisted);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!context) {
      const storageContext = JSON.parse(getContextItem("contextStorage"));
      setContext(storageContext);
    }
    if (!JSON.parse(getIsPersistemItem("isPersisted"))) {
      removeContextItem("contextStorage");
    } else {
      const storageContext = JSON.parse(getContextItem("contextStorage"));
      setContext(storageContext);
      if (context) {
        setContextItem(context);
      }
    }
  }, [isSessionRetained, response]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: "2rem",
        }}
      >
        <div
          style={{
            background: "yellow",
            padding: "1rem",
            borderStyle: "dashed",
            borderColor: "orange",
            width: "fit-content",
            margin: "2rem 0",
          }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isSessionRetained}
                  onChange={() => {
                    setIsSessionRetained((prev) => !prev);
                    setIsPersisted(!isSessionRetained);
                  }}
                />
              }
              label="Retain Session"
            />
          </FormGroup>
        </div>

        <div
          style={{
            background: "yellow",
            padding: "1rem",
            borderStyle: "dashed",
            borderColor: "orange",
            width: "fit-content",
            margin: "2rem",
          }}
        >
          <label
            style={{
              color: "black",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            AI Settings
          </label>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {/* emperature: 0, model: aiModels.gpt4, frequency_penalty: 0.5, presence_penalty: 0.5 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                for="ai-model"
              >
                AI Model
              </label>

              <select
                name="ai-model"
                id="ai-model"
                onChange={(e) => {
                  handleChangeAISettings("model", e.target.value);
                }}
                style={{
                  width: "100px",
                  backgroundColor: "white",
                  color: "black",
                }}
                defaultValue={aiModels.gpt4o}
              >
                {AI_MODELS_OPTIONS.map((AMO) => {
                  return (
                    <option id={AMO.id} value={AMO.model} key={AMO.id}>
                      {AMO.model}
                    </option>
                  );
                })}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Temperature
              </label>

              <input
                style={{
                  width: "50px",
                  backgroundColor: "white",
                  color: "black",
                }}
                type="number"
                value={aiSettings.temperature}
                step={0.1}
                onChange={(e) => handleChangeAISettings("temperature", e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Frequency Penalty
              </label>
              <input
                style={{
                  width: "50px",
                  backgroundColor: "white",
                  color: "black",
                }}
                type="number"
                value={aiSettings.frequency_penalty}
                step={0.1}
                onChange={(e) => handleChangeAISettings("frequency_penalty", e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Presence Penalty
              </label>

              <input
                style={{
                  width: "50px",
                  backgroundColor: "white",
                  color: "black",
                }}
                type="number"
                value={aiSettings.presence_penalty}
                step={0.1}
                onChange={(e) => handleChangeAISettings("presence_penalty", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "yellow",
          padding: "1rem",
          borderStyle: "dashed",
          borderColor: "orange",
          width: "fit-content",
          margin: "2rem 0",
        }}
      >
        <div>
          <label htmlFor="csvInput" style={{ display: "block" }}>
            Enter System Context
          </label>
          <textarea
            style={{
              height: "150px",
              width: "500px",
              background: "white",
              color: "black",
              padding: "2px 1px",
              margin: "0",
            }}
            onChange={handleContextChange}
            value={context}
            id="csvInput"
            name="ctx"
            type="text"
            onBlur={() => {
              if (isSessionRetained) {
                setContextItem(context);
              }
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: "yellow",
          padding: "1rem",
          borderStyle: "dashed",
          borderColor: "orange",
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
                disabled={isLoading}
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

      {/* COMING SOON FILE SUPPORT */}
      {/* <div
        style={{
          background: "yellow",
          padding: "1rem",
          borderStyle: "dashed",
          borderColor: "orange",
          width: "fit-content",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        <label htmlFor="supportFileInput" style={{ display: "block" }}>
          Upload Support file
        </label>

        <input onChange={handleSupportFileChange} id="supportFileInput" name="support_file" type="File" />
      </div> */}

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
        <label
          style={{
            color: "white",
            fontWeight: 600,
          }}
        >
          {response && !isLoading && "Data is ready to be exported"}
        </label>
      )}

      {file && response && !isLoading && (
        <div
          style={{
            marginTop: "3rem",
            maxWidth: "300px",
            backgroundColor: "yellow",
            padding: "4px",
            borderRadius: "5px",
            border: "1px dashed orange",
          }}
        >
          <CSVExporter data={response} file_name={availableOutputFileNames[0]} />
        </div>
      )}
      {/* <div style={{ marginTop: "3rem" }}>{error ? error : data.map((col, idx) => <div key={idx}>{col}</div>)}</div> */}
      {error ?? (
        <div>
          <label>GENERATION ERROR:</label>
          {error}
        </div>
      )}
    </div>
  );
};

export default CSVReader;
