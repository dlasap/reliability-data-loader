import CSVReader from "./CSVReader";
import ExcelReader from "./ExcelReader";

export default function DataLoader() {
  return (
    <div style={{ width: "100%" }}>
      <CSVReader />
      {/* <ExcelReader /> */}
    </div>
  );
}
