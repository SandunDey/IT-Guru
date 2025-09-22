export function exportToCSV(data, filename = "report.csv") {
  const rows = [];
  if (data.materials) {
    rows.push(["# Learning Materials"]);
    rows.push(["Title","Subject","Grade","Views","Created"]);
    data.materials.forEach(m=>rows.push([m.title,m.subject,m.grade,m.views,m.createdAt]));
    rows.push([]);
  }
  if (data.quizzes) {
    rows.push(["# Quizzes & Assessments"]);
    rows.push(["Title","Questions","AvgScore","Attempts","Created"]);
    data.quizzes.forEach(q=>rows.push([q.title,q.questions,q.avgScore,q.attempts,q.createdAt]));
    rows.push([]);
  }
  if (data.videos) {
    rows.push(["# Video Portal"]);
    rows.push(["Title","Duration","Views","Likes","Created"]);
    data.videos.forEach(v=>rows.push([v.title,v.duration,v.views,v.likes,v.createdAt]));
  }
  const csv = rows.map(r => r.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
}
function escapeCSV(val) {
  const s = val == null ? "" : String(val);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
