// lib/invoice-utils.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import { join } from 'path';
import nodemailer from 'nodemailer';

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
  price: number;
};

type Insurance = {
  company: string;
  policyNumber: string;
  expiryDate: string;
};

export type InvoiceData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  vehicle: Vehicle;
  spareParts?: {
    spareParts: SparePart[];
  };
  insurance: Insurance;
  totalCost: number;
  sparePartsTotal?: number;
  laborFee?: number;
  serviceFee?: number;
  salesTax?: number;
  totalEstimate?: number;
};


export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const publicDir = join(process.cwd(), 'public');

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // improvements inside generateInvoicePDF function

  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { height, width } = page.getSize();
  const margin = 50;
  let y = height - margin;

  // Header Section with Logo and Invoice Title
  page.drawText('AXELRA BODY SHOP', {
    x: margin,
    y,
    size: 22,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.6),
  });

  page.drawText('INVOICE', {
    x: width - margin - 80,
    y,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.2),
  });

  y -= 25;
  page.drawText('1234 Auto Lane, City, State ZIP', {
    x: margin,
    y,
    size: 10,
    font,
  });
  y -= 12;
  page.drawText('Phone: (555) 123-4567 | Email: info@axelra.com', {
    x: margin,
    y,
    size: 10,
    font,
  });

  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: width - margin - 150,
    y: y + 12,
    size: 10,
    font,
  });

  y -= 30;
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 25;

  // BILL TO Section
  page.drawText('BILL TO', { x: margin, y, size: 12, font: boldFont, color: rgb(0.2, 0.2, 0.2) });
  y -= 15;
  page.drawText(`${data.fullName}\n${data.email}\n${data.phoneNumber}`, {
    x: margin,
    y,
    size: 10,
    font,
    lineHeight: 12,
  });

  // VEHICLE INFO Section
  y -= 60;
  page.drawText('VEHICLE INFORMATION', {
    x: margin,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 15;
  page.drawText(
    `Make/Model: ${data.vehicle.manufacturer} ${data.vehicle.model} (${data.vehicle.year})\nLicense #: ${data.vehicle.licenceNumber}\nVIN: ${data.vehicle.vin}\nColor: ${data.vehicle.color}`,
    {
      x: margin,
      y,
      size: 10,
      font,
      lineHeight: 12,
    }
  );

  // TABLE Header
  y -= 70;
  page.drawLine({
    start: { x: margin, y: y + 5 },
    end: { x: width - margin, y: y + 5 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  page.drawText('QTY', { x: margin, y, size: 10, font: boldFont });
  page.drawText('DESCRIPTION', { x: margin + 50, y, size: 10, font: boldFont });
  page.drawText('UNIT PRICE', { x: margin + 300, y, size: 10, font: boldFont });
  page.drawText('AMOUNT', { x: margin + 420, y, size: 10, font: boldFont });

  y -= 15;
  page.drawLine({
    start: { x: margin, y: y + 5 },
    end: { x: width - margin, y: y + 5 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  // TABLE Body
  let total = 0;
  data.spareParts?.spareParts.forEach((part) => {
    const qty = 1;
    const amount = qty * part.price;
    total += amount;

    page.drawText(`${qty}`, { x: margin, y, size: 10, font });
    page.drawText(part.partName, { x: margin + 50, y, size: 10, font });
    page.drawText(`$${part.price.toFixed(2)}`, { x: margin + 300, y, size: 10, font });
    page.drawText(`$${amount.toFixed(2)}`, { x: margin + 420, y, size: 10, font });
    y -= 15;
  });

  // Totals Section
  y -= 20;
  page.drawLine({
    start: { x: margin, y: y + 5 },
    end: { x: width - margin, y: y + 5 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  const { laborFee, serviceFee, salesTax, totalEstimate } = data;
  let currentY = y;

    page.drawText(`Spare Parts Total:`, { x: margin + 300, y: currentY, size: 10, font });
    page.drawText(`$${total.toFixed(2)}`, { x: margin + 420, y: currentY, size: 10, font });
    currentY -= 15;


  if (laborFee !== undefined) {
    page.drawText(`Labor Fee:`, { x: margin + 300, y: currentY, size: 10, font });
    page.drawText(`$${laborFee.toFixed(2)}`, { x: margin + 420, y: currentY, size: 10, font });
    currentY -= 15;
  }

  if (serviceFee !== undefined) {
    page.drawText(`Service Fee:`, { x: margin + 300, y: currentY, size: 10, font });
    page.drawText(`$${serviceFee.toFixed(2)}`, { x: margin + 420, y: currentY, size: 10, font });
    currentY -= 15;
  }

  if (salesTax !== undefined) {
    page.drawText(`Sales Tax:`, { x: margin + 300, y: currentY, size: 10, font });
    page.drawText(`$${salesTax.toFixed(2)}`, { x: margin + 420, y: currentY, size: 10, font });
    currentY -= 15;
  }

  if (totalEstimate !== undefined) {
    page.drawText(`TOTAL ESTIMATE:`, {
      x: margin + 300,
      y: currentY,
      size: 12,
      font: boldFont,
    });
    page.drawText(`$${totalEstimate.toFixed(2)}`, {
      x: margin + 420,
      y: currentY,
      size: 12,
      font: boldFont,
      color: rgb(0, 0.3, 0.5),
    });
    currentY -= 20;
  }


  // INSURANCE Section (optional)
if (data.insurance) {
  y -= 40;
  page.drawText('INSURANCE INFORMATION', {
    x: margin,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 15;
  page.drawText(
    `${data.insurance.company}\nPolicy #: ${data.insurance.policyNumber}\nExpires: ${data.insurance.expiryDate}`,
    {
      x: margin,
      y,
      size: 10,
      font,
      lineHeight: 12,
    }
  );
}


  // FOOTER
  y = 70;
  page.drawLine({
    start: { x: margin, y: y + 20 },
    end: { x: width - margin, y: y + 20 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText('Terms & Conditions:', {
    x: margin,
    y,
    size: 10,
    font: boldFont,
  });
  y -= 12;
  page.drawText('Payment is due within 15 days. Make checks payable to Axelra Body Shop.', {
    x: margin,
    y,
    size: 9,
    font,
  });

  y -= 20;
  page.drawText('Thank you for your business!', {
    x: margin,
    y,
    size: 10,
    font,
    color: rgb(0.1, 0.4, 0.1),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);

}


export async function sendInvoiceEmail(toEmail: string, pdfBuffer: Buffer, fullName: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'adnan@codeautomation.dev',
      pass: 'hueq dwkd zknz apuq',
    },
  });


  const mailOptions = {
    from: 'adnan@codeautomation.dev',
    to: toEmail,
    subject: 'Your Vehicle Repair Invoice',
    text: 'Please find the attached invoice for your vehicle repair.',
   attachments: [
      { filename: `${fullName}_invoice.pdf`, content: pdfBuffer }
    ],  };

  await transporter.sendMail(mailOptions);
}
