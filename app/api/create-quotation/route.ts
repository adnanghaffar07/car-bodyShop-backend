import { generateInvoicePDF, sendInvoiceEmail } from '@/lib/quotation-utils';
import { Quotation } from '@/lib/quotation-utils';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // 1. Extract and parse the "data" field (quotation JSON)
    const rawJson = formData.get('data') as string;

    if (!rawJson) {
      return NextResponse.json({ error: 'Missing quotation JSON data' }, { status: 400 });
    }

    let data: Quotation;
    try {
      data = JSON.parse(rawJson);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in data field' }, { status: 400 });
    }

    // 2. Handle optional logo file upload
    const logoFile = formData.get('logo') as File;

    if (logoFile) {
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const tempDir = path.join(process.cwd(), 'public', 'temp-logos');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const logoFilename = `${Date.now()}-${logoFile.name}`;
      const logoPath = path.join(tempDir, logoFilename);
      fs.writeFileSync(logoPath, buffer);

      // Add logo path to data so PDF can use it
      data.logoPath = logoPath;
    }

    // 3. Generate PDF
    const pdfBuffer = await generateInvoicePDF(data);

    // 4. Email the PDF
    await sendInvoiceEmail(data.email, pdfBuffer, data.fullName, data.businessName);

    // 5. Return success + PDF as base64
    const pdfBase64 = pdfBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Quotation sent and generated successfully.',
      pdfBase64,
    });

  } catch (error) {
    console.error('Quotation generation failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate/send Quotation.' },
      { status: 500 }
    );
  }
}
