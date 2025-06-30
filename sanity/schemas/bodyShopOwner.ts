export default {
  name: 'bodyShopOwner',
  title: 'Body Shop Owner',
  type: 'document',
  fields: [
    {
      name: 'fullName',
      title: 'Owner’s Full Name',
      type: 'string',
    },
    {
      name: 'businessName',
      title: 'Business/Shop Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
    },
    {
      name: 'shopAddress',
      title: 'Shop Address',
      type: 'string',
    },
    {
      name: 'state',
      title: 'State (USA)',
      type: 'string',
    },

    { name: 'salesTaxPercent', type: 'number', title: 'Sales Tax (%)' },
    {
      name: 'businessLicense',
      title: 'Business License Number / Registration ID',
      type: 'string',
    },
    {
      name: 'taxId',
      title: 'Tax Identification Number (TIN) / VAT Number',
      type: 'string',
    },
    {
      name: 'serviceAreaRadius',
      title: 'Service Area or Coverage Radius (in km or miles)',
      type: 'number',
    },
    {
      name: 'logo',
      title: 'Shop Logo',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'documents',
      title: 'Uploaded Documents',
      type: 'array',
      of: [{ type: 'file' }],
      description: 'Business license, tax documents, insurance, etc.',
    },
  ],
};
