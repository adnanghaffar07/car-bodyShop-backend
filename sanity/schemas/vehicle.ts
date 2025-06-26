export default {
  name: 'customerVehicleInfo',
  type: 'document',
  title: 'Customer & Vehicle Info',
  fields: [
    // Customer Info
    { name: 'fullName', type: 'string', title: 'Full Name' },
    { name: 'email', type: 'string', title: 'Email Address' },
    { name: 'phoneNumber', type: 'string', title: 'Phone Number' },
    { name: 'createdBy', type: 'string', title: 'Created By (Owner)' },

    // Vehicle Info
    {
      name: 'vehicle',
      type: 'object',
      title: 'Vehicle Information',
      fields: [
        { name: 'manufacturer', type: 'string', title: 'Manufacturer' },
        { name: 'type', type: 'string', title: 'Type' },
        { name: 'model', type: 'string', title: 'Model' },
        { name: 'year', type: 'number', title: 'Year' },
        { name: 'licenceNumber', type: 'string', title: 'Licence Number' },
        { name: 'color', type: 'string', title: 'Color' },
        { name: 'vin', type: 'string', title: 'VIN Number' },
        {
          name: 'damagePhotos',
          type: 'array',
          title: 'Damage Photos',
          of: [{ type: 'image' }],
        },
      ],
    },

    // Spare Parts
    {
      name: 'spareParts',
      type: 'array',
      title: 'Spare Parts',
      of: [
        {
          type: 'object',
          title: 'Spare Part',
          fields: [
            { name: 'partName', type: 'string', title: 'Part Name' },
            { name: 'partNumber', type: 'string', title: 'Part Number' }, // ✅ New field
            { name: 'quantity', type: 'number', title: 'Quantity', initialValue: 1 },
            { name: 'price', type: 'number', title: 'Price' },
            { name: 'labourTime', type: 'number', title: 'Labour Time (in Hours)' },
          ],
        },
      ],
    },

    // Services
    {
      name: 'services',
      type: 'array',
      title: 'Services',
      of: [
        {
          type: 'object',
          title: 'Service',
          fields: [
            { name: 'serviceName', type: 'string', title: 'Service Name' },
            { name: 'price', type: 'number', title: 'Price' },
            { name: 'labourTime', type: 'number', title: 'Labour Time (in Hours)' },
          ],
        },
      ],
    },

    // Insurance Info
    {
      name: 'insurance',
      type: 'object',
      title: 'Insurance Information',
      fields: [
        { name: 'company', type: 'string', title: 'Insurance Company' },
        { name: 'policyNumber', type: 'string', title: 'Policy Number' },
        { name: 'expiryDate', type: 'date', title: 'Policy Expiry Date' },
        { name: 'isCoverageValid', type: 'boolean', title: 'Coverage is Currently Valid' },
      ],
    },

    // Calculated Fields
    { name: 'estimatedTotalPrice', type: 'number', title: 'Estimated Total Price' },
    { name: 'totalLabourTime', type: 'number', title: 'Total Labour Time (Hours)' },
  ],
};
