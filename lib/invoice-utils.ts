import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';


type Vehicle = {
  manufacturer: string;
  model: string;
  year: string;
  licenceNumber: string;
  vin: string;
  color: string;
};

type SparePart = {
  partName: string;
  partNumber: string;
  quantity: number;
  price: number;
  labourTime: number;
};

type Service = {
  serviceName: string;
  price: number;
  labourTime: number;
};


type Insurance = {
  company: string;
  policyNumber: string;
  expiryDate: string;
};

export type InvoiceData = {
  // Owner (Body Shop) Info
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  logoPath?: string;

  // Customer Info
  _id: string; // Sanity document ID
  fullName: string;
  email: string;
  phoneNumber: string;

  // Vehicle Info
  vehicle: Vehicle;

  // Spare Parts & Services
  spareParts?: {
    spareParts: SparePart[];
  };
  services?: Service[];
  laborFee?: number;
  serviceFee?: number;
  salesTax?: number;
  sparePartsTotal?: number;
  totalEstimate?: number;
  totalCost: number;

  // Insurance Info
  insurance: Insurance;
};

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.addPage([595, 842]); // A4
  const { height, width } = page.getSize();
  const margin = 50;
  let y = height - margin;

  // ✅ Default fallback logo path
  const fallbackLogoPath = path.join(process.cwd(), 'public', 'car-logo.jpg');

  // ✅ Use logoPath from data (sent from frontend), or fallback
  let logoPathToUse = data.logoPath;

  if (!logoPathToUse || !fs.existsSync(logoPathToUse)) {
    logoPathToUse = fallbackLogoPath;
  }

  if (fs.existsSync(logoPathToUse)) {
    const imageBytes = fs.readFileSync(logoPathToUse);

    // Auto-detect PNG or JPG based on file extension
    const isPng = logoPathToUse.toLowerCase().endsWith('.png');
    const image = isPng
      ? await pdfDoc.embedPng(imageBytes)
      : await pdfDoc.embedJpg(imageBytes);

    const desiredHeight = 36; // Logo height in PDF
    const scale = desiredHeight / image.height;
    const logoWidth = image.width * scale;

    page.drawImage(image, {
      x: margin,
      y: y - desiredHeight + 26, // Adjust based on your layout
      width: logoWidth,
      height: desiredHeight,
    });
  }
  // Business Info & Invoice title
  page.drawText(data.businessName.toUpperCase(), {
    x: margin + 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.6),
  });

  page.drawText('Invoice', {
    x: width - margin - 42,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.2),
  });

  y -= 25;
  page.drawText(data.businessAddress, {
    x: margin,
    y,
    size: 10,
    font,
  });

  y -= 14;
  page.drawText(data.businessPhone, {
    x: margin,
    y,
    size: 10,
    font,
  });

  y -= 14;
  page.drawText(data.businessEmail, {
    x: margin,
    y,
    size: 10,
    font,
  });

  const rightColumnX = width - margin;
  const invoiceId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateY = y + 28;

  const dateText = `Date: ${new Date().toLocaleDateString()}`;
  const dateWidth = font.widthOfTextAtSize(dateText, 10);

  page.drawText(dateText, {
    x: rightColumnX - dateWidth,
    y: dateY,
    size: 10,
    font,
  });

  const invoiceLines = [
    `Invoice ID: ${invoiceId}`,
    `Customer ID: ${data._id ? data._id : 'N/A'}`,
  ];

  invoiceLines.forEach((text, i) => {
    const textWidth = font.widthOfTextAtSize(text, 10);
    page.drawText(text, {
      x: rightColumnX - textWidth,
      y: dateY - (14 * (i + 1)),
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });


  y -= 20;
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  const labelBgColor = rgb(0.1, 0.2, 0.6);
  const labelTextColor = rgb(1, 1, 1);
  const labelHeight = 14;
  const textSpacing = 14;

  // 3-column layout
  const columnGap = 120;
  const columnWidth = (width - 2 * margin - 2 * columnGap) / 3;
  const col1X = margin;
  const col2X = col1X + columnWidth + columnGap + 60; // 🔁 Add extra offset


  // Reset Y for labels
  y -= 15;

  // ==== BILL TO
  page.drawRectangle({
    x: col1X,
    y: y - labelHeight,
    width: 43,
    height: labelHeight,
    color: labelBgColor,
  });
  page.drawText('Bill To:', {
    x: col1X + 5,
    y: y - 11,
    size: 10,
    font: boldFont,
    color: labelTextColor,
  });

  const billToLines = [data.fullName, data.email, data.phoneNumber];
  billToLines.forEach((text, i) => {
    page.drawText(text, {
      x: col1X,
      y: y - labelHeight - 16 - i * textSpacing,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // ==== VEHICLE INFO
  page.drawRectangle({
    x: col2X,
    y: y - labelHeight,
    width: 80,
    height: labelHeight,
    color: labelBgColor,
  });
  page.drawText('Vehicle Info:', {
    x: col2X + 5,
    y: y - 11,
    size: 10,
    font: boldFont,
    color: labelTextColor,
  });
  const vehicleLines = [
    `VIN# ${data.vehicle.vin}`,
    `${data.vehicle.year} ${data.vehicle.manufacturer} ${data.vehicle.model}`,
    `License# ${data.vehicle.licenceNumber}`,
    `Color: ${data.vehicle.color}`,
  ];

  vehicleLines.forEach((text, i) => {
    page.drawText(text, {
      x: col2X,
      y: y - labelHeight - 16 - i * textSpacing,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // Adjust y after the tallest column (usually vehicle info)
  y -= 40;


  y -= 30;

  const rowHeight = 20; // consistent row height
  y -= rowHeight / 2 + 5; // center the header text vertically
  y -= rowHeight / 2;
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  // Table Body
  // Utility: Start a new page
  const addNewPage = () => {
    const newPage = pdfDoc.addPage([595, 842]);
    y = newPage.getHeight() - margin;
    return newPage;
  };

  let currentPage = page;
  const drawTableHeader = () => {
    const headerHeight = rowHeight + 5;
    y -= headerHeight;

    currentPage.drawRectangle({
      x: margin,
      y,
      width: width - 2 * margin,
      height: headerHeight,
      color: rgb(0.95, 0.95, 0.95),
    });

    const textY = y + (headerHeight - 10) / 2;

    currentPage.drawText('S.No', { x: margin + 5, y: textY, size: 8, font: boldFont });
    currentPage.drawText('DESCRIPTION', { x: margin + 35, y: textY, size: 8, font: boldFont });
    currentPage.drawText('PART No', { x: margin + 200, y: textY, size: 8, font: boldFont });
    currentPage.drawText('QTY', { x: margin + 260, y: textY, size: 8, font: boldFont });
    currentPage.drawText('LABOR (Hrs)', { x: margin + 310, y: textY, size: 8, font: boldFont });
    currentPage.drawText('UNIT PRICE', { x: margin + 380, y: textY, size: 8, font: boldFont });
    currentPage.drawText('AMOUNT', { x: margin + 450, y: textY, size: 8, font: boldFont });
    y -= 1;
    currentPage.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    y -= 10;
  };

  // Draw table
  drawTableHeader();

  let totalSpare = 0;
  let totalService = 0;
  let totalLabourTime = 0;
  let serial = 1;

  // Spare Parts Table
  data.spareParts?.spareParts.forEach((part) => {
    const qty = part.quantity ?? 1;
    const unitPrice = part.price ?? 0;
    const amount = qty * unitPrice;
    const labour = part.labourTime ?? 0;

    totalSpare += amount;
    totalLabourTime += labour;

    if (y < 100) {
      currentPage = addNewPage();
      drawTableHeader();
    }

    y -= rowHeight;
    currentPage.drawText(`${serial}`, { x: margin + 5, y: y + 6, size: 10, font });
    currentPage.drawText(`${part.partName}`, { x: margin + 35, y: y + 6, size: 10, font });
    currentPage.drawText(`${part.partNumber || "-"}`, { x: margin + 200, y: y + 6, size: 10, font });
    currentPage.drawText(`${qty}`, { x: margin + 260, y: y + 6, size: 10, font });
    currentPage.drawText(`${labour}`, { x: margin + 310, y: y + 6, size: 10, font });
    currentPage.drawText(`$${unitPrice.toFixed(2)}`, { x: margin + 380, y: y + 6, size: 10, font });
    currentPage.drawText(`$${amount.toFixed(2)}`, { x: margin + 450, y: y + 6, size: 10, font });

    serial++;
  });
  data.services?.forEach((service) => {
    const qty = 1;
    const unitPrice = service.price ?? 0;
    const amount = qty * unitPrice;
    const labour = service.labourTime ?? 0;

    totalService += amount;
    totalLabourTime += labour;

    if (y < 100) {
      currentPage = addNewPage();
      drawTableHeader();
    }

    y -= rowHeight;

    currentPage.drawText(`${serial}`, { x: margin + 5, y: y + 6, size: 10, font });
    currentPage.drawText(`${service.serviceName}`, { x: margin + 35, y: y + 6, size: 10, font });
    currentPage.drawText(`-`, { x: margin + 200, y: y + 6, size: 10, font }); // Dash for Part ID
    currentPage.drawText(`${qty}`, { x: margin + 260, y: y + 6, size: 10, font });
    currentPage.drawText(`${labour}`, { x: margin + 310, y: y + 6, size: 10, font });
    currentPage.drawText(`$${unitPrice.toFixed(2)}`, { x: margin + 380, y: y + 6, size: 10, font });
    currentPage.drawText(`$${amount.toFixed(2)}`, { x: margin + 450, y: y + 6, size: 10, font });

    serial++;
  });

  if (y < 150) {
    currentPage = addNewPage();
  }

  y -= 20; // instead of y -= 20
  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  const startX = margin + 300;

  const drawSummaryRow = (label: string, value: number) => {
    y -= 15;
    currentPage.drawText(label, { x: startX, y, size: 10, font });
    currentPage.drawText(`$${value.toFixed(2)}`, { x: startX + 120, y, size: 10, font });
  };


  // Draw Totals & Summary
  if (data.spareParts?.spareParts && data.spareParts.spareParts.length > 0 && totalSpare > 0) {
    drawSummaryRow('Spare Parts Subtotal:', totalSpare);
  }

  // Conditionally show service subtotal if any services exist
  if (data.services && data.services.length > 0 && totalService > 0) {
    drawSummaryRow('Service Items Subtotal:', totalService);
  }

  y -= 15;
  currentPage.drawText('Total Labor Time (hrs):', { x: startX, y, size: 10, font });
  currentPage.drawText(`${totalLabourTime}`, { x: startX + 120, y, size: 10, font });


  // Only show fees if they are greater than 0
  if ((data.laborFee || 0) > 0) {
    drawSummaryRow('Labor Fee:', data.laborFee || 0);
  }

  if ((data.salesTax || 0) > 0) {
    drawSummaryRow('Sales Tax (Spare Parts):', data.salesTax || 0);
  }

  // Grand Total
if (data.totalCost || data.totalEstimate) {
  y -= 20;
  currentPage.drawText('TOTAL ESTIMATE:', {
    x: startX,
    y,
    size: 12,
    font: boldFont,
  });

  const total = data.totalCost || data.totalEstimate || 0;
  currentPage.drawText(`$${total.toFixed(2)}`, {
    x: startX + 120,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.3, 0.5),
  });
}


  y -= -40; // Add some spacing

  // Draw signature on the left
  currentPage.drawText('Signature/Stamp:', {
    x: margin,
    y,
    size: 10,
    font: boldFont,
  });

  currentPage.drawLine({
    start: { x: margin + 90, y: y + 2 },
    end: { x: margin + 240, y: y + 2 },
    thickness: 0.5,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Footer
  // Footer
  y -= 60; // More spacing before footer
  if (y < 180) {
    currentPage = addNewPage();
  }

  const footerY = 50;
  // --- Terms & Conditions ---
  // currentPage.drawText('Terms & Conditions:', {
  //   x: margin,
  //   y: footerY,
  //   size: 10,
  //   font: boldFont,
  // });
  // currentPage.drawText(`Payment is due within 15 days. Make checks payable to ${data.businessName}.`, {
  //   x: margin,
  //   y: footerY - 12,
  //   size: 9,
  //   font,
  // });
  currentPage.drawText('Thank you for your business!', {
    x: margin,
    y: footerY - 15,
    size: 10,
    font,
    color: rgb(0.1, 0.4, 0.1),
  });

  // --- Powered by ---
  currentPage.drawText('Powered by CodeAutomation.ai', {
    x: width - margin - 110,
    y: 30,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });


  currentPage.drawLine({
    start: { x: margin, y: footerY + 20 },
    end: { x: width - margin, y: footerY + 20 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // currentPage.drawText('Terms & Conditions:', { x: margin, y: footerY, size: 10, font: boldFont });
  // currentPage.drawText(`Payment is due within 15 days. Make checks payable to ${data.businessName}.`, {
  //   x: margin,
  //   y: footerY - 12,
  //   size: 9,
  //   font,
  // });
  currentPage.drawText('Thank you for your business!', {
    x: margin,
    y: footerY - 15,
    size: 10,
    font,
    color: rgb(0.1, 0.4, 0.1),
  });


  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}


export async function sendInvoiceEmail(toEmail: string, pdfBuffer: Buffer, fullName: string, businessName: string) {
  const timestamp = new Date().toLocaleString(); // Includes date + time
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'ayesha@codeautomation.dev',
      pass: 'eexg jiwa qqki mtyx',
    },
  });

  await transporter.sendMail({
    from: `${businessName} <ayesha@codeautomation.dev>`,
    to: toEmail,
    subject: `Invoice for ${fullName}`,
    text: 'Please find attached your invoice.',
    attachments: [{
      filename: `${fullName}-invoice (${timestamp}).pdf`,
      content: pdfBuffer,
    }],
  });
}
