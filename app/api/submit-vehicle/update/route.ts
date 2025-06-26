import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

type SanityImageRef = {
  _type: 'image';
  _key: string;
  asset: {
    _type: 'reference';
    _ref: string;
  };
};

// ... imports remain the same

export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();

    const docId = formData.get('_id')?.toString().trim();
    if (!docId) {
      return NextResponse.json({ error: 'Missing document ID (_id)' }, { status: 400 });
    }

    // Customer Info
    const fullName = formData.get('fullName')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phoneNumber = formData.get('phoneNumber')?.toString().trim();
    const createdBy = formData.get('createdBy')?.toString().trim();

    // Vehicle Info
    const manufacturer = formData.get('manufacturer')?.toString().trim();
    const type = formData.get('type')?.toString().trim();
    const model = formData.get('model')?.toString().trim();
    const yearStr = formData.get('year')?.toString().trim();
    const year = yearStr ? Number(yearStr) : null;
    const vin = formData.get('vin')?.toString().trim();
    const licenceNumber = formData.get('licenceNumber')?.toString().trim();
    const color = formData.get('color')?.toString().trim();

    // Insurance Info
    const insuranceCompany = formData.get('insuranceCompany')?.toString().trim();
    const policyNumber = formData.get('policyNumber')?.toString().trim();
    const policyExpiryDateRaw = formData.get('policyExpiryDate')?.toString().trim();
    const isCoverageValid = ['true', 'on', '1'].includes(formData.get('isCoverageValid')?.toString().toLowerCase() || '');

  // ✅ Spare Parts (with quantity + labourTime)
    const partNames = formData.getAll('partName');
    const partNumbers = formData.getAll('partNumber');
    const partPrices = formData.getAll('price');
    const partQuantities = formData.getAll('quantity');
    const partLabourTimes = formData.getAll('labourTime');

    const sparePartsArray = partNames.map((part, index) => ({
      _key: uuidv4(),
      _type: 'object',
      partNumber: partNumbers[index]?.toString().trim() || `SP-${index + 1}`, // fallback
      partName: part.toString().trim(),
      price: parseFloat(partPrices[index]?.toString().trim() || '0'),
      quantity: parseInt(partQuantities[index]?.toString().trim() || '1', 10),
      labourTime: parseFloat(partLabourTimes[index]?.toString().trim() || '0'),
    }));


    // ✅ Services (with quantity + labourTime)
    const serviceNames = formData.getAll('serviceName');
    const servicePrices = formData.getAll('servicePrice');
    const serviceLabourTimes = formData.getAll('serviceLabourTime');

    const servicesArray = serviceNames.map((name, index) => ({
      _key: uuidv4(),
      _type: 'object',
      serviceName: name.toString().trim(),
      price: parseFloat(servicePrices[index]?.toString().trim() || '0'),
      labourTime: parseFloat(serviceLabourTimes[index]?.toString().trim() || '0'),
    }));

    // Validate Required Fields
    if (
      ![manufacturer, type, model, year, vin, licenceNumber, color, fullName, phoneNumber].every(Boolean) ||
      year === null || isNaN(year)
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    // Validate Insurance Date
    let policyExpiryDate: string | null = null;
    if (policyExpiryDateRaw) {
      const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(policyExpiryDateRaw);
      const parsedDate = new Date(policyExpiryDateRaw);
      if (isValidFormat && !isNaN(parsedDate.getTime())) {
        policyExpiryDate = policyExpiryDateRaw;
      } else {
        return NextResponse.json({ error: 'Invalid policy expiry date' }, { status: 400 });
      }
    }

    // Upload Damage Photos
    const damagePhotos: SanityImageRef[] = [];
    const imageFiles = formData.getAll('damagePhotos');
    for (const file of imageFiles) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await client.assets.upload('image', buffer, {
          filename: file.name,
          contentType: file.type,
        });
        damagePhotos.push({
          _key: uuidv4(),
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        });
      }
    }
   
    // Patch Payload
    const patchData = {
   fullName,
  email,
  phoneNumber,
  createdBy,
  vehicle: {
    manufacturer,
    type,
    model,
    year,
    vin,
    licenceNumber,
    color,
    damagePhotos,
  },
  spareParts: sparePartsArray,
  services: servicesArray,
  insurance: {
    company: insuranceCompany,
    policyNumber,
    expiryDate: policyExpiryDate,
    isCoverageValid,
  },
  estimatedTotalPrice: [
    ...sparePartsArray,
    ...servicesArray
  ].reduce((sum, item) => sum + (item.price ?? 0), 0),

  totalLabourTime: [
    ...sparePartsArray,
    ...servicesArray
  ].reduce((sum, item) => sum + (item.labourTime ?? 0), 0),
};

    const updatedDoc = await client.patch(docId).set(patchData).commit();
    return NextResponse.json({ success: true, data: updatedDoc }, { status: 200 });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

