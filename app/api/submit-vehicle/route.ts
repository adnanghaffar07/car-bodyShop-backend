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

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
        }

        const formData = await request.formData();

        // ✅ Customer Info
        const fullName = formData.get('fullName')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const phoneNumber = formData.get('phoneNumber')?.toString().trim();
         const createdBy = formData.get('createdBy')?.toString().trim();


        // ✅ Vehicle Info
        const manufacturer = formData.get('manufacturer')?.toString().trim();
        const type = formData.get('type')?.toString().trim();
        const model = formData.get('model')?.toString().trim();
        const yearStr = formData.get('year')?.toString().trim();
        const year = yearStr ? Number(yearStr) : null;
        const vin = formData.get('vin')?.toString().trim();
        const licenceNumber = formData.get('licenceNumber')?.toString().trim();
        const color = formData.get('color')?.toString().trim();

        // ✅ Insurance Info
        const insuranceCompany = formData.get('insuranceCompany')?.toString().trim();
        const policyNumber = formData.get('policyNumber')?.toString().trim();
        const policyExpiryDateRaw = formData.get('policyExpiryDate')?.toString().trim();
        const isCoverageValid = ['true', 'on', '1'].includes(
            formData.get('isCoverageValid')?.toString().toLowerCase() || ''
        );

        // ✅ Spare Parts Array (format: partName[] and price[])
        const partNames = formData.getAll('partName');
        const partPrices = formData.getAll('price');

        const sparePartsArray = partNames.map((part, index) => {
            const name = part.toString().trim();
            const price = parseFloat(partPrices[index]?.toString().trim() || '0');
            return {
                _key: uuidv4(),
                _type: 'object',
                partName: name,
                price: price,
            };
        });

        // ✅ Validate required fields
        if (
            ![manufacturer, type, model, year, vin, licenceNumber, color, fullName, phoneNumber].every(Boolean) ||
            year === null ||
            isNaN(year)
        ) {
            return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        // ✅ Format insurance expiry date
        let policyExpiryDate: string | null = null;
        if (policyExpiryDateRaw) {
            const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(policyExpiryDateRaw);
            const parsedDate = new Date(policyExpiryDateRaw);
            const isValidDate = !isNaN(parsedDate.getTime());
            if (isValidFormat && isValidDate) {
                policyExpiryDate = policyExpiryDateRaw;
            } else {
                return NextResponse.json({ error: 'Invalid policy expiry date' }, { status: 400 });
            }
        }

        // ✅ Upload images
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

        // ✅ Construct full document
        const document = {
            _type: 'customerVehicleInfo',
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
                damagePhotos: damagePhotos.length > 0 ? damagePhotos : [],
            },
            spareParts: {
                spareParts: sparePartsArray,
            },
            insurance: {
                company: insuranceCompany,
                policyNumber,
                expiryDate: policyExpiryDate,
                isCoverageValid,
            },
        };

        // ✅ Save to Sanity
        const createdDoc = await client.create(document);
        return NextResponse.json({ success: true, data: createdDoc });
    } catch (error) {
        console.error('Error creating document:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
