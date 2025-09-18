import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { FaRegFilePdf } from "react-icons/fa";

export default function AnnouncementReport() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Custom theme colors (hex → RGB)
  const colors = {
    accent: [18, 65, 112], // #124170
    primary: [255, 255, 255], // #ffffff
    secondary: [34, 40, 49], // #222831
    border: [28, 110, 164], // #1c6ea4
    similar: [34, 40, 49], // #222831
  };

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_BASE_URL + "/api/announcements"
        );
        setAnnouncements(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        toast.error("Failed to fetch announcements");
        setIsLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const createPDFReport = () => {
    if (!announcements || announcements.length === 0) {
      toast.error("No announcements to generate report!");
      return;
    }

    try {
      const pdfDoc = new jsPDF();
      const pageWidth = pdfDoc.internal.pageSize.width;
      const pageHeight = pdfDoc.internal.pageSize.height;
      const margin = 20;
      const maxY = pageHeight - 30;

      const addHeader = (isFirstPage = false) => {
        pdfDoc.setFillColor(...colors.accent);
        pdfDoc.rect(0, 0, pageWidth, 45, "F");

        pdfDoc.setFillColor(...colors.primary);
        pdfDoc.circle(30, 22, 10, "F");
        pdfDoc.setTextColor(...colors.accent);
        pdfDoc.setFontSize(12);
        pdfDoc.text("IT", 26, 26);

        pdfDoc.setTextColor(...colors.primary);
        pdfDoc.setFontSize(18);
        pdfDoc.text("ITGuru Tuition Center", 50, 20);

        pdfDoc.setFontSize(9);
        pdfDoc.text(
          "123 Main Street, Colombo, Sri Lanka | Phone: +94 77 123 4567",
          50,
          30
        );
        pdfDoc.text("Email: info@itguru.lk | Web: www.itguru.lk", 50, 37);

        if (isFirstPage) {
          pdfDoc.setTextColor(...colors.accent);
          pdfDoc.setFontSize(16);
          pdfDoc.text("ANNOUNCEMENT REPORT", margin, 65);
          pdfDoc.setFontSize(11);
          pdfDoc.text("Type-wise Classification & Analysis", margin, 75);

          pdfDoc.setFillColor(248, 250, 252);
          pdfDoc.rect(margin, 82, pageWidth - 2 * margin, 20, "F");
          pdfDoc.setDrawColor(...colors.border);
          pdfDoc.rect(margin, 82, pageWidth - 2 * margin, 20, "S");

          pdfDoc.setTextColor(...colors.similar);
          pdfDoc.setFontSize(9);
          const now = new Date();
          pdfDoc.text(
            `Generated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`,
            margin + 5,
            90
          );
          pdfDoc.text(`Total Records: ${announcements.length}`, margin + 5, 97);

          const typeCount = Object.keys(
            announcements.reduce((groups, ann) => {
              const type = ann.type || "General";
              if (!groups[type]) groups[type] = [];
              groups[type].push(ann);
              return groups;
            }, {})
          ).length;
          pdfDoc.text(`Categories: ${typeCount}`, pageWidth - 70, 90);
          pdfDoc.text(`Report By: System Admin`, pageWidth - 70, 97);
        }

        return isFirstPage ? 110 : 55;
      };

      const addFooter = (pageNum, totalPages) => {
        pdfDoc.setDrawColor(...colors.border);
        pdfDoc.line(
          margin,
          pageHeight - 20,
          pageWidth - margin,
          pageHeight - 20
        );

        pdfDoc.setTextColor(...colors.similar);
        pdfDoc.setFontSize(8);
        pdfDoc.text(
          "ITGuru Tuition Center - Confidential Report",
          margin,
          pageHeight - 12
        );
        pdfDoc.text(
          `Page ${pageNum} of ${totalPages}`,
          pageWidth - 40,
          pageHeight - 12
        );
        pdfDoc.text(
          new Date().toLocaleDateString(),
          pageWidth / 2 - 15,
          pageHeight - 12
        );
      };

      const addSectionHeader = (title, count, yPos) => {
        pdfDoc.setFillColor(...colors.accent);
        pdfDoc.rect(margin, yPos, pageWidth - 2 * margin, 12, "F");

        pdfDoc.setTextColor(...colors.primary);
        pdfDoc.setFontSize(11);
        pdfDoc.text(`${title.toUpperCase()} SECTION`, margin + 5, yPos + 8);

        pdfDoc.setFillColor(...colors.primary);
        pdfDoc.rect(pageWidth - 55, yPos + 2, 30, 8, "F");
        pdfDoc.setTextColor(...colors.accent);
        pdfDoc.setFontSize(9);
        pdfDoc.text(`${count} items`, pageWidth - 50, yPos + 8);

        return yPos + 17;
      };

      const addAnnouncementItem = (announcement, index, yPos) => {
        const itemHeight = 28;

        pdfDoc.setFillColor(249, 250, 251);
        pdfDoc.rect(
          margin + 3,
          yPos,
          pageWidth - 2 * margin - 6,
          itemHeight,
          "F"
        );
        pdfDoc.setDrawColor(...colors.border);
        pdfDoc.rect(
          margin + 3,
          yPos,
          pageWidth - 2 * margin - 6,
          itemHeight,
          "S"
        );

        pdfDoc.setFillColor(...colors.accent);
        pdfDoc.rect(margin + 3, yPos, 2, itemHeight, "F");

        const contentX = margin + 10;
        let contentY = yPos + 7;

        pdfDoc.setTextColor(...colors.secondary);
        pdfDoc.setFontSize(10);
        const title = announcement.title || "Untitled Announcement";
        const annId = announcement.announcementID || "N/A";
        pdfDoc.text(`${index + 1}. ${title}`, contentX, contentY);

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(...colors.similar);
        pdfDoc.text(`ID: ${annId}`, pageWidth - 50, contentY);

        contentY += 6;

        pdfDoc.setTextColor(...colors.accent);
        pdfDoc.setFontSize(8);
        const audienceText = Array.isArray(announcement.audience)
          ? announcement.audience.join(", ")
          : announcement.audience || "All Users";
        pdfDoc.text(`Target: ${audienceText}`, contentX, contentY);

        const expiry = announcement.expiryDate
          ? new Date(announcement.expiryDate).toLocaleDateString()
          : "No expiry";
        pdfDoc.text(`Valid Until: ${expiry}`, pageWidth - 70, contentY);

        contentY += 6;

        pdfDoc.setTextColor(...colors.similar);
        pdfDoc.setFontSize(8);
        const desc = announcement.description || "No description provided";
        const maxDescWidth = pageWidth - 2 * margin - 20;
        const descLines = pdfDoc.splitTextToSize(desc, maxDescWidth);
        const displayDesc =
          descLines.length > 1 ? descLines[0] + "..." : descLines[0];
        pdfDoc.text(`Details: ${displayDesc}`, contentX, contentY);

        return yPos + itemHeight + 3;
      };

      const typeGroups = {};
      announcements.forEach((ann) => {
        const type = ann.type || "General";
        if (!typeGroups[type]) {
          typeGroups[type] = [];
        }
        typeGroups[type].push(ann);
      });

      let currentY = addHeader(true);
      let pageCount = 1;
      const totalPages = Math.ceil(announcements.length / 8) + 2;

      Object.entries(typeGroups).forEach(([typeName, typeList]) => {
        if (currentY > maxY - 50) {
          addFooter(pageCount, totalPages);
          pdfDoc.addPage();
          pageCount++;
          currentY = addHeader();
        }

        currentY = addSectionHeader(typeName, typeList.length, currentY);

        typeList.forEach((announcement, idx) => {
          if (currentY > maxY - 35) {
            addFooter(pageCount, totalPages);
            pdfDoc.addPage();
            pageCount++;
            currentY = addHeader();
          }
          currentY = addAnnouncementItem(announcement, idx, currentY);
        });

        currentY += 8;
      });

      addFooter(pageCount, totalPages);

      const filename = `ITGuru_AnnouncementReport_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdfDoc.save(filename);

      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("PDF creation failed:", error);
      toast.error(`PDF creation failed: ${error.message}`);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[--color-primary] to-[--color-similar] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[--color-primary] shadow-2xl rounded-3xl p-10 border border-[--color-boardercolor] relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[--color-accent]/10 via-transparent to-[--color-boardercolor]/10 pointer-events-none"></div>

          {/* Header */}
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[--color-accent] to-[--color-boardercolor] bg-clip-text text-transparent drop-shadow-sm">
                📊 Announcement Reports
              </h1>
              <p className="text-[--color-similar] mt-3 text-lg font-medium">
                Generate comprehensive PDF reports with a{" "}
                <span className="font-semibold text-[--color-accent]">
                  professional design
                </span>
              </p>
            </div>

            {/* Export Button */}
            <button
              onClick={createPDFReport}
              disabled={isLoading || announcements.length === 0}
              className="relative flex items-center gap-3 bg-gradient-to-r from-[--color-accent] to-[--color-boardercolor] text-[--color-primary] px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <FaRegFilePdf className="text-xl" />
                  <span>Export PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Decorative line */}
          <div className="relative mt-6">
            <div className="h-1 w-32 bg-gradient-to-r from-[--color-accent] to-[--color-boardercolor] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
