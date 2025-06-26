import { generateInvoicePDF, sendInvoiceEmail } from '@/lib/quotation-utils';
import { Quotation } from '@/lib/quotation-utils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data: Quotation = await request.json();

    // 1. Generate PDF
    const pdfBuffer = await generateInvoicePDF(data);

    // 2. Email the PDF
    await sendInvoiceEmail(data.email, pdfBuffer, data.fullName, data.businessName);

    // 3. Return success + PDF as base64
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
