import { jsPDF } from'jspdf';

export const createPDF = async (membership) => {
  const doc = new jsPDF();
  
  // Logo and Header
  doc.setFontSize(20);
  doc.setTextColor(40, 53, 147);
  doc.text('OXY FITNESS', 105, 20, { align: 'center' });
  
  // Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Membership Details', 105, 30, { align: 'center' });
  
  // Membership Details
  doc.setFontSize(12);
  doc.text(`User ID: ${membership.userId}`, 20, 50);
  doc.text(`User Name: ${membership.userName}`, 20, 60);
  doc.text(`Email: ${membership.email}`, 20, 70);
  doc.text(`Package: ${membership.package}`, 20, 80);
  doc.text(`Price: ${membership.price}`, 20, 90);
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for choosing OXY FITNESS!', 105, 140, { align: 'center' });
  doc.text('© 2024 OXY FITNESS. All rights reserved.', 105, 150, { align: 'center' });
  
  return doc.output();
};