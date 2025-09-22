import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf"; // Create PDF
import autoTable from "jspdf-autotable"; // Added for table
import toast from "react-hot-toast";
import { FaRegFilePdf } from "react-icons/fa";

export default function AnnouncementReport() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Theme colors
  const colors = {
    accent: [18, 65, 112], // #124170
    primary: [255, 255, 255], // white
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
        setAnnouncements(response.data); // save data
        setIsLoading(false); // stop loading
      } catch (err) {
        console.error("Error fetching announcements:", err);
        toast.error("Failed to fetch announcements");
        setIsLoading(false); // stop loading
      }
    }
    fetchAnnouncements();
  }, []);

  const createPDFReport = () => {
    if (!announcements || announcements.length === 0) {
      //announcement nathnm
      toast.error("No announcements to generate report!");
      return;
    }

    try {
      const doc = new jsPDF(); // new PDF file
      const pageWidth = doc.internal.pageSize.width; // page width

      // --- Logo ---
      const logoUrl = "/logo.jpg"; // Put logo in public/ folder
      doc.addImage(logoUrl, "PNG", 14, 10, 20, 20); // x=14, y=10, size=20x20

      // --- ITGuru Info ---
      doc.setFontSize(18);
      doc.setTextColor(...colors.accent);
      doc.text("ITGuru Tuition Center", 40, 18);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("123 Main Street, Colombo, Sri Lanka", 40, 25);
      doc.text("Phone: +94 77 123 4567 | Email: info@itguru.lk", 40, 30);
      doc.text("Web: www.itguru.lk", 40, 35);

      // --- Title ---
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Announcement Report Summary", 14, 50);

      // --- Table Data ---
      const tableData = announcements.map((ann, index) => [
        //announcements list eka loop karala item tika ganna
        ann.announcementID || `A${index + 1}`, // announcement id thiyenvnm eka ganna nathnm default A1 , A2 vage ganna
        ann.title || "Untitled",
        ann.type || "General",
        ann.expiryDate ? new Date(ann.expiryDate).toLocaleDateString() : "N/A", //expiry date thiyenawanam date format karala ganna
        ann.description || "No description",
      ]);

      autoTable(doc, {
        //jsPDF-autotable library eken table ekak hadannava PDF vidiyt(doc)
        startY: 60, //table ekata start karanna y-axis (height) 60th line eken.
        head: [["ID", "Title", "Type", "Expiry Date", "Description"]],
        body: tableData, // body ekt ganne table data kalin gatta
        theme: "grid", //table ekata grid-style border denna.
        headStyles: { fillColor: colors.accent, textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      // --- Footer ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        //page 1 to last page loop
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...colors.similar);

        doc.text(
          "ITGuru Tuition Center - Confidential Report",
          14,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 40,
          doc.internal.pageSize.height - 10
        );
      }

      // --- Save ---
      const filename = `ITGuru_AnnouncementReport_${
        //"ITGuru_AnnouncementReport_YYYY-MM-DD.pdf" format ekata save wenna.
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(filename);

      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("PDF creation failed:", error);
      toast.error(`PDF creation failed: ${error.message}`);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-primary to-primary py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-primary shadow-2xl rounded-3xl p-10 border border-boardercolor relative overflow-hidden">
          {/* Header */}
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-accent to-boardercolor bg-clip-text text-transparent drop-shadow-sm">
                Announcement Reports
              </h1>
              <p className="text-similar mt-3 text-lg font-medium">
                Generate PDF reports with{" "}
                <span className="font-semibold text-accent">
                  professional ITGuru branding
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
        </div>
      </div>
    </div>
  );
}
