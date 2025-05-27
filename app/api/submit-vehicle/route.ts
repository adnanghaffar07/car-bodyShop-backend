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
            return NextResponse.json(
                { error: 'Content-Type must be multipart/form-data' },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        // Required vehicle fields
        const manufacturer = formData.get('manufacturer')?.toString().trim();
        const type = formData.get('type')?.toString().trim();
        const model = formData.get('model')?.toString().trim();
        const yearStr = formData.get('year')?.toString().trim();
        const year = yearStr ? Number(yearStr) : null;
        const vin = formData.get('vin')?.toString().trim();
        const licenceNumber = formData.get('licenceNumber')?.toString().trim();
        const color = formData.get('color')?.toString().trim();

        // Insurance fields
        const insuranceCompany = formData.get('insuranceCompany')?.toString().trim() || '';
        const policyNumber = formData.get('policyNumber')?.toString().trim() || '';
        const policyExpiryDateRaw = formData.get('policyExpiryDate')?.toString().trim() || '';
        const isCoverageValid = ['true', 'on', '1'].includes(
            formData.get('isCoverageValid')?.toString().toLowerCase() || ''
        );

        // Validate required fields
        if (![manufacturer, type, model, year, vin, licenceNumber, color].every(Boolean) || !year || isNaN(year)) {
            return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        // Convert policyExpiryDate to Sanity date format (YYYY-MM-DD)
        let policyExpiryDate: string | null = null;

        if (policyExpiryDateRaw) {
            const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(policyExpiryDateRaw);

            const parsedDate = new Date(policyExpiryDateRaw);
            const isValidDate = !isNaN(parsedDate.getTime());

            if (isValidFormat && isValidDate) {
                policyExpiryDate = policyExpiryDateRaw; // Already ISO string (YYYY-MM-DD)
            } else {
                return NextResponse.json({ error: 'Invalid policy expiry date' }, { status: 400 });
            }
        }



        // Upload damage photos (images)
        const damagePhotos: SanityImageRef[] = [];
        const imageFiles = formData.getAll('damagePhotos');

        if (imageFiles && imageFiles.length > 0) {
            for (const file of imageFiles) {
                try {
                    if (file instanceof File) {
                        console.log(`Uploading file: ${file.name}, type: ${file.type}, size: ${file.size}`);
                        const arrayBuffer = await file.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

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
                } catch (uploadError) {
                    console.error('Error uploading file:', file instanceof File ? file.name : 'unknown file', uploadError);
                }
            }
        }

        // Construct the vehicle document to create
        const vehicleDoc = {
            _type: 'vehicle',
            manufacturer,
            type,
            model,
            year,
            vin,
            licenceNumber,
            color,
            insurance: {
                company: insuranceCompany,
                policyNumber,
                expiryDate: policyExpiryDate,
                isCoverageValid,
            },
            damagePhotos: damagePhotos.length > 0 ? damagePhotos : undefined,
        };

        // Save document in Sanity
        await client.create(vehicleDoc);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}