export default {
  name: 'vehicle',
  type: 'document',
  title: 'Vehicle',
  fields: [
    {
      name: 'manufacturer',
      type: 'string',
      title: 'Manufacturer', // e.g., Honda, Toyota
    },
    {
      name: 'type',
      type: 'string',
      title: 'Type', // e.g., Sedan, SUV
    },
    {
      name: 'model',
      type: 'string',
      title: 'Model', // e.g., Civic, City
    },
    {
      name: 'year',
      type: 'number',
      title: 'Year',
    },
      {
      name: 'licenceNumber',
      type: 'string',
      title: 'Licence Number',
    },
    {
      name: 'color',
      type: 'string',
      title: 'Color',
    },
    {
      name: 'vin',
      type: 'string',
      title: 'VIN Number',
    },
    {
      name: 'insurance',
      type: 'object',
      title: 'Insurance Information',
      fields: [
        {
          name: 'company',
          type: 'string',
          title: 'Insurance Company',
        },
        {
          name: 'policyNumber',
          type: 'string',
          title: 'Policy Number',
        },
        {
          name: 'expiryDate',
          type: 'date',
          title: 'Policy Expiry Date',
        },
        {
          name: 'isCoverageValid',
          type: 'boolean',
          title: 'Coverage is Currently Valid',
        },
      ],
    },
    {
  name: 'damagePhotos',
  type: 'array',
  title: 'Damage Photos',
  of: [{ type: 'image' }], // Change from 'file' to 'image'
}
  ],
}
