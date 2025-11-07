import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateUsersPDF = (users) => {
  // Initialize jsPDF
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text("OXY FITNESS - User Details Report", 14, 20);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

  // Prepare table data
  const tableData = users.map((user) => [
    user._id,
    user.fname,
    user.lname,
    user.email,
    user.role,
    user.number || "N/A",
    user.city || "N/A",
  ]);

  // Generate table
  autoTable(doc, {
    head: [["ID", "First Name", "Last Name", "Email", "Role", "Phone", "City"]],
    body: tableData,
    startY: 35,
    theme: "grid", // Optional styling
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
  });

  // Save PDF
  doc.save("oxy_fitness_users_report.pdf");
};