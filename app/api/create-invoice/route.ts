import { generateInvoicePDF, sendInvoiceEmail } from '@/lib/invoice-utils';
import { NextResponse } from 'next/server';
import type { InvoiceData } from '@/lib/invoice-utils';

export async function POST(request: Request) {
  try {
    const data: InvoiceData = await request.json();

    // 1. Generate PDF
    const pdfBuffer = await generateInvoicePDF(data);

    // 2. Email the PDF
    await sendInvoiceEmail(data.email, pdfBuffer, data.fullName);

    // 3. Return success + PDF as base64
    const pdfBase64 = pdfBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Invoice sent and generated successfully.',
      pdfBase64,
    });
  } catch (error) {
    console.error('Invoice generation failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate/send invoice.' },
      { status: 500 }
    );
  }
}
