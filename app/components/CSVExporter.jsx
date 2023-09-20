import { CSVLink, CSVDownload } from "react-csv";

export const CSVExporter = ({ data = [], file_name = "" }) => {
  console.log("%c  data:", "color: #0e93e0;background: #aaefe5;", data);
  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  const new_data = data.replace(/;/g, ",").replace(/(\$[,\d]+)(?=(,[,\d]+))/g, (match, p1) => {
    return p1.replace(/,/g, "");
  });
  console.log("%c  new_data:", "color: #0e93e0;background: #aaefe5;", new_data);
  return (
    <>
      <CSVLink filename={file_name} data={new_data}>
        Download CSV File Responses
      </CSVLink>
    </>
  );
  // or
};
