// src/utils/pdfReport.js
// npm i jspdf jspdf-autotable dayjs
import jsPDF from "jspdf";
import dayjs from "dayjs";

export default async function generatePdfReport(
  data,
  filename = "report.pdf",
  options = {}
) {
  // 0) Browser-only guard
  if (typeof window === "undefined") {
    const err = new Error("PDF generation must run in the browser (window is undefined).");
    console.error(err);
    throw err;
  }

  // 1) Validate payload
  const issues = [];
  if (!data || typeof data !== "object") issues.push("data is missing or not an object");
  if (
    data &&
    !Array.isArray(data.materials) &&
    !Array.isArray(data.quizzes) &&
    !Array.isArray(data.videos) &&
    !data.overview
  ) {
    issues.push("no sections present (overview/materials/quizzes/videos are all missing)");
  }
  if (issues.length) {
    const err = new Error("Invalid report payload: " + issues.join("; "));
    console.error("[PDF] Payload problem:", data);
    throw err;
  }

  // 2) Load autotable
  let autoTable;
  try {
    const mod = await import("jspdf-autotable");
    autoTable = mod.default || mod;
    if (typeof autoTable !== "function") throw new Error("jspdf-autotable import did not return a function");
  } catch (e) {
    console.error("[PDF] Failed to load jspdf-autotable:", e);
    throw e;
  }

  // 2.5) Logo options
  const {
    logoDataUrl,
    logoUrl = "/public/logo.jpg",
    logoWidth = 36,
    logoHeight = 36,
    logoHref,
  } = options || {};

  let logoData = null;
  try {
    if (logoDataUrl) {
      logoData = logoDataUrl;
    } else if (logoUrl) {
      logoData = await urlToDataUrl(logoUrl);
    }
  } catch (e) {
    console.warn("[PDF] Failed to load logo, continuing without it:", e);
  }

  // ---------- Global batch/grade fallback (IMPORTANT) ----------
  const globalBatch = resolveGlobalBatch(data, options);     // e.g., "2025 A/L" or "Batch 1"
  const globalYear  = extractYear(globalBatch) ??           // 2025 from "2025 A/L"
                      (data?.overview?.year ?? null);

  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 36;

    // ---------- Header ----------
    const brand = "ITGuru Teacher Dashboard";
    const createdAt = dayjs().format("YYYY-MM-DD HH:mm");

    const imgX = margin;
    const imgY = margin;
    if (logoData) {
      const imgFormat =
        logoData.startsWith("data:image/jpeg") || logoData.startsWith("data:image/jpg")
          ? "JPEG"
          : logoData.startsWith("data:image/webp")
          ? "WEBP"
          : logoData.startsWith("data:image/svg")
          ? "SVG"
          : "PNG";
      doc.addImage(logoData, imgFormat, imgX, imgY, logoWidth, logoHeight);
      if (logoHref) doc.link(imgX, imgY, logoWidth, logoHeight, { url: logoHref });
    }

    const brandX = logoData ? imgX + logoWidth + 10 : margin;
    const brandY = margin + 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(brand, brandX, brandY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${createdAt}`, pageWidth - margin, brandY, { align: "right" });

    // content start BELOW the logo block
    let y = Math.max(imgY + (logoData ? logoHeight : 0), margin) + 20;

    // ---------- Overview ----------
    if (data.overview) {
      const { teacherName, courseCount, studentCount, lastSync } = data.overview;
      const kpis = [
        ["Teacher", teacherName ?? "-"],
        ["Courses", safeNum(courseCount)],
        ["Students", safeNum(studentCount)],
        ["Last Sync", lastSync ? fmt(lastSync) : "-"],
      ];
      y += 8;
      autoTwoCol(doc, kpis, margin, y);
      y += 70;
    }

    const BLUE = [25, 103, 210];

    // ---------- Materials ----------
    if (Array.isArray(data.materials) && data.materials.length) {
      y = sectionTitle(doc, y, margin, "Learning Materials");
      autoTable(doc, {
        startY: y,
        head: [["Title", "Type", "Topic", "Week", "Batch", "Year", "Created"]],
        body: data.materials.map((m) => {
          const itemBatch = orBatch(batchOf(m), globalBatch);
          const itemYear  = orYear(yearOf(m), extractYear(itemBatch) ?? globalYear);
          return [
            textOf(m?.title ?? "-"),
            textOf(m?.type ?? "-"),
            textOf(m?.topic ?? "-"),
            safeNum(m?.week),
            itemBatch,
            itemYear ?? "-",
            m?.createdAt ? fmt(m.createdAt) : "-",
          ];
        }),
        margin: { left: margin, right: margin },
        tableWidth: "wrap",
        styles: { fontSize: 9, cellPadding: 5, overflow: "linebreak", cellWidth: "wrap" },
        headStyles: { fillColor: BLUE, textColor: 255 },
        columnStyles: {
          0: { cellWidth: 150 }, // Title
          1: { cellWidth: 60 },  // Type
          2: { cellWidth: 100 }, // Topic
          3: { cellWidth: 40 },  // Week
          4: { cellWidth: 70 },  // Batch
          5: { cellWidth: 40 },  // Year
          6: { cellWidth: 60 },  // Created
        },
      });
      y = (doc.lastAutoTable?.finalY ?? y) + 12;
    }

    // ---------- Quizzes ----------
    if (Array.isArray(data.quizzes) && data.quizzes.length) {
      y = sectionTitle(doc, y, margin, "Quizzes & Assessments");
      autoTable(doc, {
        startY: y,
        head: [["Title", "Questions", "Avg. Score", "Attempts", "Batch", "Created"]],
        body: data.quizzes.map((q) => {
          const itemBatch = orBatch(batchOf(q), globalBatch);
          const itemYear  = orYear(yearOf(q), extractYear(itemBatch) ?? globalYear);
          return [
            textOf(q?.title ?? "-"),
            safeNum(q?.questions),
            percent(q?.avgScore),
            safeNum(q?.attempts),
            itemBatch,
            q?.createdAt ? fmt(q?.createdAt) : "-",
          ];
        }),
        margin: { left: margin, right: margin },
        tableWidth: "wrap",
        styles: { fontSize: 9, cellPadding: 5, overflow: "linebreak", cellWidth: "wrap" },
        headStyles: { fillColor: BLUE, textColor: 255 },
        columnStyles: {
          0: { cellWidth: 150 }, // Title
          1: { cellWidth: 60 },  // Questions
          2: { cellWidth: 60 },  // Avg. Score
          3: { cellWidth: 60 },  // Attempts
          4: { cellWidth: 70 },  // Batch
          5: { cellWidth: 60 },  // Created
        },
      });
      y = (doc.lastAutoTable?.finalY ?? y) + 12;
    }

    // ---------- Videos ----------
    if (Array.isArray(data.videos) && data.videos.length) {
      y = sectionTitle(doc, y, margin, "Video Portal");
      autoTable(doc, {
        startY: y,
        head: [["Title", "Duration", "Views", "Likes", "Batch", "Created"]],
        body: data.videos.map((v) => {
          const itemBatch = orBatch(batchOf(v), globalBatch);
          const itemYear  = orYear(yearOf(v), extractYear(itemBatch) ?? globalYear);
          return [
            textOf(v?.title ?? "-"),
            textOf(v?.duration ?? "-"),
            safeNum(v?.views),
            safeNum(v?.likes),
            itemBatch,
            v?.createdAt ? fmt(v?.createdAt) : "-",
          ];
        }),
        margin: { left: margin, right: margin },
        tableWidth: "wrap",
        styles: { fontSize: 9, cellPadding: 5, overflow: "linebreak", cellWidth: "wrap" },
        headStyles: { fillColor: BLUE, textColor: 255 },
        columnStyles: {
          0: { cellWidth: 150 }, // Title
          1: { cellWidth: 70 },  // Duration
          2: { cellWidth: 60 },  // Views
          3: { cellWidth: 60 },  // Likes
          4: { cellWidth: 70 },  // Batch
          5: { cellWidth: 60 },  // Created
        },
      });
      y = (doc.lastAutoTable?.finalY ?? y) + 12;
    }

    // ---------- Footer ----------
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 820, { align: "center" });
    }

    const safeName = (filename && String(filename).trim()) || "report.pdf";
    doc.save(safeName);
  } catch (err) {
    console.error("[PDF] Generation failed with data:", data);
    console.error(err);
    alert("PDF export failed. Check the console for details.");
    throw err;
  }
}

/* ---------- Helpers ---------- */
function sectionTitle(doc, y, margin, title) {
  if (y > 760) { doc.addPage(); y = 48; }
  y += 8;
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text(title, margin, y);
  doc.setFont("helvetica", "normal");
  return y + 10;
}

// (optional) console hook
if (typeof window !== "undefined") {
  window.__batchOf = (o) => batchOf(o);
}

function fmt(dt) { return dayjs(dt).format("YYYY-MM-DD"); }
function percent(x) { return (x ?? 0).toFixed(1) + "%"; }
function safeNum(n) { return n == null || Number.isNaN(Number(n)) ? 0 : Number(n); }

function textOf(v) {
  if (v == null) return "-";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") {
    for (const k of ["name", "title", "label", "code", "id"]) {
      if (v[k] != null && String(v[k]).trim() !== "") return String(v[k]);
    }
    try { return JSON.stringify(v); } catch { return "-"; }
  }
  return "-";
}
function pickFirst(obj, keys) {
  for (const k of keys) {
    const val = obj?.[k];
    if (val !== undefined && val !== null) {
      const str = typeof val === "string" ? val : textOf(val);
      if (String(str).trim() !== "") return str;
    }
  }
  return null;
}
function extractYear(text) {
  const m = /(?<!\d)(20\d{2}|19\d{2})(?!\d)/.exec(String(text || ""));
  return m ? Number(m[1]) : null;
}

/** Robust per-item batch */
function batchOf(o) {
  const batchRaw = pickFirst(o, [
    "batch","Batch","batchName","batch_label","batchLabel",
    "cohort","group","section","class","className","batch_id","batchId","courseBatch",
  ]);
  const gradeRaw = pickFirst(o, ["grade","Grade","stream","level"]);
  const b = textOf(batchRaw);
  const g = textOf(gradeRaw);
  const y = (o?.year != null && String(o.year).trim() !== "")
    ? String(o.year)
    : (extractYear(b) ?? extractYear(g) ?? null);

  if (/^\d{4}$/.test(String(b)) && g !== "-") return `${b} ${g}`.trim();
  if (g !== "-" && /\d{4}/.test(g)) return g;
  if (g !== "-" && /A\/?L|O\/?L/i.test(g) && y) return `${y} ${g}`.trim();

  const pick = [b, g].filter(x => x && x !== "-").sort((a, b) => b.length - a.length)[0];
  return pick || (y ? String(y) : "-");
}
/** Per-item year */
function yearOf(o) {
  if (o?.year != null && String(o.year).trim() !== "") return o.year;
  const fromText =
    extractYear(
      pickFirst(o, ["batch","Batch","batchName","batch_label","batchLabel","cohort","group","section","class","className","courseBatch"])
      ?? pickFirst(o, ["grade","Grade","stream","level"])
    );
  if (fromText) return fromText;
  if (o?.createdAt) return dayjs(o.createdAt).year();
  return "-";
}

/** Compute a good global batch fallback from options/data */
function resolveGlobalBatch(data, options) {
  // 1) explicit overrides
  const direct =
    options?.defaultBatch ||
    data?.defaultBatch ||
    data?.overview?.batch ||
    data?.overview?.grade ||
    data?.overview?.activeBatch;
  if (direct && String(direct).trim() !== "") return String(direct);

  // 2) search arrays for first non-dash batch
  const arrays = [data?.materials || [], data?.quizzes || [], data?.videos || []];
  for (const arr of arrays) {
    for (const it of arr) {
      const b = batchOf(it);
      if (b && b !== "-") return b;
    }
  }
  // 3) nothing found
  return "-";
}

/** use item batch if present else global */
function orBatch(itemBatch, globalBatch) {
  const ib = (itemBatch && itemBatch !== "-") ? itemBatch : null;
  const gb = (globalBatch && globalBatch !== "-") ? globalBatch : null;
  return ib || gb || "-";
}
function orYear(itemYear, globalYear) {
  if (itemYear && itemYear !== "-") return itemYear;
  if (globalYear != null) return globalYear;
  return "-";
}

function autoTwoCol(doc, rows, x, y) {
  doc.setFontSize(11);
  rows.forEach(([k, v], i) => {
    const yy = y + i * 16;
    doc.setFont("helvetica", "bold");
    doc.text(String(k), x, yy);
    doc.setFont("helvetica", "normal");
    doc.text(String(v), x + 150, yy);
  });
}

/** Convert a URL to a data URL so jsPDF can embed it reliably (handles CORS if same-origin). */
async function urlToDataUrl(url) {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error(`Failed to fetch logo: ${res.status}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
