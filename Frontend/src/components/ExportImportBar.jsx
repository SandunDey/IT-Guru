// src/components/ExportImportBar.jsx
import React, { useState } from "react";
import { FileText, Film, BookOpen, Layers, Upload } from "lucide-react";
import generatePdfReport from "../utils/pdfReport";
import { exportToCSV } from "../utils/csvExport";
import { exportToXLSX } from "../utils/xlsxExport";

/**
 * props:
 *  - data: { overview, materials, quizzes, videos }
 *  - onImport?: (parsedJson) => void
 *  - onPdf?: (payload, filename, options) => Promise<void>   // optional override
 *  - logoUrl?: string                // e.g. "/assets/itguru-logo.png"
 *  - logoDataUrl?: string            // e.g. "data:image/png;base64,...."
 *  - logoHref?: string               // e.g. "https://itguru.lk"
 *  - logoWidth?: number              // default 36
 *  - logoHeight?: number             // default 36
 *  - defaultBatch?: string           // e.g. "2025 A/L" (forwarded to PDF as fallback)
 */
export default function ExportImportBar({
  data,
  onImport,
  onPdf,
  logoUrl = "/public/logo.jpg",
  logoDataUrl,
  logoHref = "https://itguru.lk",
  logoWidth = 36,
  logoHeight = 36,
  defaultBatch,
}) {
  const [format, setFormat] = useState("pdf");

  const handleAll = () => exportByType("all");
  const handleQuizzes = () => exportByType("quizzes");
  const handleVideos = () => exportByType("videos");
  const handleMaterials = () => exportByType("materials");

  const exportByType = async (type) => {
    try {
      const payload = sliceData(data, type);

      // optional global fallback for Batch column in PDF
      if (defaultBatch && !payload.defaultBatch) {
        payload.defaultBatch = defaultBatch;
      }

      // ✅ define filename FIRST (fixes "fname is not defined")
      const fname = filename(type, format);

      // Build PDF options once
      const pdfOptions = {
        ...(logoDataUrl ? { logoDataUrl } : { logoUrl }),
        logoHref,
        logoWidth,
        logoHeight,
        ...(defaultBatch ? { defaultBatch } : {}),
      };

      if (format === "pdf") {
        if (typeof onPdf === "function") {
          await onPdf(payload, fname, pdfOptions);
        } else {
          await generatePdfReport(payload, fname, pdfOptions);
        }
        return;
      }

      if (format === "csv") {
        exportToCSV(payload, fname);
        return;
      }

      if (format === "xlsx") {
        await exportToXLSX(payload, fname);
        return;
      }
    } catch (e) {
      console.error("Export failed:", e);
      alert("Export failed. See console for details.");
    }
  };

  const onFilePicked = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      onImport?.(json);
      alert("Import successful.");
    } catch (err) {
      console.error(err);
      alert("Invalid JSON file.");
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="px-3 py-2 rounded-lg border"
        aria-label="Select export format"
      >
        <option value="pdf">PDF</option>
        <option value="csv">CSV</option>
        <option value="xlsx">XLSX</option>
      </select>

      <button onClick={handleAll} className="px-3 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2" type="button">
        <Layers size={16} /> Export All
      </button>

      <button onClick={handleMaterials} className="px-3 py-2 rounded-lg bg-indigo-600 text-white flex items-center gap-2" type="button">
        <BookOpen size={16} /> Learning Materials
      </button>

      <button onClick={handleQuizzes} className="px-3 py-2 rounded-lg bg-emerald-600 text-white flex items-center gap-2" type="button">
        <FileText size={16} /> Quizzes &amp; Assessments
      </button>

      <button onClick={handleVideos} className="px-3 py-2 rounded-lg bg-violet-600 text-white flex items-center gap-2" type="button">
        <Film size={16} /> Video Portal
      </button>

      <label className="ml-auto px-3 py-2 rounded-lg border cursor-pointer flex items-center gap-2">
        <Upload size={16} /> Import JSON
        <input type="file" accept="application/json" onChange={onFilePicked} className="hidden" />
      </label>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function filename(type, format) {
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(
    2,
    "0"
  )}`;
  const base = type === "all" ? "ITGuru-all-report" : `ITGuru-${type}-report`;
  return `${base}-${stamp}.${format}`;
}

function sliceData(d, type) {
  if (!d) return {};
  if (type === "all") return d;

  // Keep overview in partial exports if available
  if (type === "materials")
    return { ...(d.overview && { overview: d.overview }), materials: d.materials || [] };
  if (type === "quizzes")
    return { ...(d.overview && { overview: d.overview }), quizzes: d.quizzes || [] };
  if (type === "videos")
    return { ...(d.overview && { overview: d.overview }), videos: d.videos || [] };

  return {};
}
