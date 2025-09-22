// npm i xlsx
import * as XLSX from "xlsx";

export function exportToXLSX(data, filename = "report.xlsx") {
  const wb = XLSX.utils.book_new();

  if (data.materials) {
    const ws = XLSX.utils.json_to_sheet(data.materials);
    XLSX.utils.book_append_sheet(wb, ws, "Materials");
  }
  if (data.quizzes) {
    const ws = XLSX.utils.json_to_sheet(data.quizzes);
    XLSX.utils.book_append_sheet(wb, ws, "Quizzes");
  }
  if (data.videos) {
    const ws = XLSX.utils.json_to_sheet(data.videos);
    XLSX.utils.book_append_sheet(wb, ws, "Videos");
  }
  XLSX.writeFile(wb, filename);
}
