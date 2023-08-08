import "../styles/CSVTable.css";
import { CsvToHtmlTable } from "react-csv-to-table";

export const CSVTable = ({ data = "" }) => {
  console.log("%c  data:", "color: #0e93e0;background: #aaefe5;", data);
  return (
    <CsvToHtmlTable
      tableClassName="CSVTable table-striped table-hover"
      tableRowClassName
      tableColumnClassName
      hasHeader={true}
      data={data}
      csvDelimiter=";"
    />
  );
};
