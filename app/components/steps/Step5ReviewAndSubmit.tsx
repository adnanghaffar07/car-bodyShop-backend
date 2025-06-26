// 'use client';

// import React, { useState } from 'react';
// import { Dialog } from "@headlessui/react";


// interface CustomerInfo {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   createdBy: string;
// }

// interface VehicleInfo {
//   manufacturer: string;
//   type: string;
//   model: string;
//   year: number;
//   vin: string;
//   licenceNumber: string;
//   color: string;
// }

// interface InsuranceInfo {
//   company: string;
//   policyNumber: string;
//   expiryDate: string;
//   isCoverageValid: boolean;
// }

// interface SelectedPart {
//   partId: string;
//   quantity: number;
//   labourTime: number;
//   price: number;
// }

// interface SelectedService {
//   name: string;
//   labourTime: number;
//   price: number;
// }

// interface SparePart {
//   partId: string;
//   partName: string;
// }

// interface Props {
//   formData: {
//     customerInfo?: CustomerInfo;
//     vehicleInfo?: VehicleInfo;
//     insuranceInfo?: InsuranceInfo;
//   };
//   selectedParts: SelectedPart[];
//   selectedServices: SelectedService[];
//   spareParts: SparePart[];
//   onSubmit: () => void;
// }


// const Step5ReviewAndSubmit: React.FC<Props> = ({
//   formData,
//   selectedParts,
//   selectedServices,
//   spareParts,
// }) => {
//   const [laborFee, setLaborFee] = useState(0);
//   const [serviceFee, setServiceFee] = useState(0);
//   const [salesTax, setSalesTax] = useState(0);
//   const [showDialog, setShowDialog] = useState(false);
//   const [loading] = useState(false);



//   const getPartName = (id: string) =>
//     spareParts.find((p) => p.partId === id)?.partName || id;

//   const totalSpare = selectedParts.reduce(
//     (sum, part) => sum + part.price * part.quantity,
//     0
//   );

//   const handleFinalSubmit = async () => {
//     try {
//       const formDataObj = new FormData();

//       // Extract info from formData
//       const customerInfo: CustomerInfo = formData.customerInfo ?? {
//         fullName: '',
//         email: '',
//         phoneNumber: '',
//         createdBy: '',
//       };

//       const vehicleInfo: VehicleInfo = formData.vehicleInfo ?? {
//         manufacturer: '',
//         type: '',
//         model: '',
//         year: new Date().getFullYear(),
//         vin: '',
//         licenceNumber: '',
//         color: '',
//       };

//       const insuranceInfo: InsuranceInfo = formData.insuranceInfo ?? {
//         company: '',
//         policyNumber: '',
//         expiryDate: '',
//         isCoverageValid: false,
//       };


//       // ✅ Customer Info
//       formDataObj.append('fullName', customerInfo.fullName || '');
//       formDataObj.append('email', customerInfo.email || '');
//       formDataObj.append('phoneNumber', customerInfo.phoneNumber || '');
//       formDataObj.append('createdBy', customerInfo.createdBy || '');

//       // ✅ Vehicle Info
//       formDataObj.append('manufacturer', vehicleInfo.manufacturer || '');
//       formDataObj.append('type', vehicleInfo.type || '');
//       formDataObj.append('model', vehicleInfo.model || '');
//       formDataObj.append('year', vehicleInfo.year?.toString() || '');
//       formDataObj.append('vin', vehicleInfo.vin || '');
//       formDataObj.append('licenceNumber', vehicleInfo.licenceNumber || '');
//       formDataObj.append('color', vehicleInfo.color || '');

//       // ✅ Insurance Info
//       formDataObj.append('insuranceCompany', insuranceInfo.company || '');
//       formDataObj.append('policyNumber', insuranceInfo.policyNumber || '');
//       formDataObj.append('policyExpiryDate', insuranceInfo.expiryDate || '');
//       formDataObj.append('isCoverageValid', insuranceInfo.isCoverageValid ? 'true' : 'false');

//       // ✅ Spare Parts
//       selectedParts.forEach((part) => {
//         const partName = spareParts.find(p => p.partId === part.partId)?.partName || '';
//         formDataObj.append('partName', partName);
//         formDataObj.append('partNumber', part.partId); // keep this as it is
//         formDataObj.append('price', part.price?.toString() || '0');
//         formDataObj.append('quantity', part.quantity?.toString() || '1');
//         formDataObj.append('labourTime', part.labourTime?.toString() || '0');
//       });


//       // ✅ Services
//       selectedServices.forEach((service) => {
//         formDataObj.append('serviceName', service.name || '');
//         formDataObj.append('servicePrice', service.price?.toString() || '0');
//         formDataObj.append('serviceLabourTime', service.labourTime?.toString() || '0');
//       });

//       // ✅ Damage Photos (optional)
//       // If you have damagePhotos, handle them here. Otherwise, skip or comment out.
//       // damagePhotos.forEach((file) => {
//       //   if (file instanceof File) {
//       //     formDataObj.append('damagePhotos', file);
//       //   }
//       // });

//       // ✅ Submit to /api/submit-vehicle
//       const res = await fetch('/api/submit-vehicle', {
//         method: 'POST',
//         body: formDataObj,
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         console.error('Submit failed:', result.error);
//         alert('Failed to submit: ' + result.error);
//         return;
//       }

//       // ✅ Call your generate/email API (pass result.data for _id)
//       // await generatePDFAndEmail(result.data); // <- Define this separately if needed

//       alert('Quotation submitted and emailed successfully!');
//     } catch (error) {
//       console.error('Error during submission:', error);
//       alert('Something went wrong. Please try again.');
//     }
//   };

//   const totalService = selectedServices.reduce((sum, s) => sum + s.price, 0);
//   const totalLabourTime =
//     selectedParts.reduce((sum, p) => sum + p.labourTime, 0) +
//     selectedServices.reduce((sum, s) => sum + s.labourTime, 0);

//   const grandTotal =
//     totalSpare + totalService + laborFee + serviceFee + salesTax;

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-blue-700">Step 5: Review & Submit</h2>

//       {/* Summary Boxes */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="p-4 border rounded-lg bg-white shadow">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Information</h3>
//           {Object.entries(formData.customerInfo || {}).map(([key, val]) => (
//             <p key={key} className="text-sm text-gray-700">
//               <span className="font-medium capitalize">{key}:</span> {val}
//             </p>
//           ))}
//         </div>

//         <div className="p-4 border rounded-lg bg-white shadow">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Vehicle Information</h3>
//           {Object.entries(formData.vehicleInfo || {}).map(([key, val]) => (
//             <p key={key} className="text-sm text-gray-700">
//               <span className="font-medium capitalize">{key}:</span> {val}
//             </p>
//           ))}
//         </div>

//         <div className="p-4 border rounded-lg bg-white shadow col-span-full">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Insurance Information</h3>
//           {Object.entries(formData.insuranceInfo || {}).map(([key, val]) => (
//             <p key={key} className="text-sm text-gray-700">
//               <span className="font-medium capitalize">{key}:</span> {val?.toString()}
//             </p>
//           ))}
//         </div>
//       </div>

//       {/* Spare Parts */}
//       <div className="p-4 border rounded-lg bg-gray-50">
//         <h3 className="text-lg font-semibold mb-3 text-blue-600">Selected Spare Parts</h3>
//         {selectedParts.length === 0 ? (
//           <p className="text-sm text-gray-500">No spare parts selected.</p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left border-b">
//                 <th className="py-1">Part</th>
//                 <th className="py-1">Quantity</th>
//                 <th className="py-1">Labour Hours</th>
//                 <th className="py-1">Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedParts.map((part, index) => (
//                 <tr key={index} className="border-t">
//                   <td>{getPartName(part.partId)}</td>
//                   <td>{part.quantity}</td>
//                   <td>{part.labourTime}</td>
//                   <td>${part.price.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Services */}
//       <div className="p-4 border rounded-lg bg-gray-50">
//         <h3 className="text-lg font-semibold mb-3 text-blue-600">Selected Services</h3>
//         {selectedServices.length === 0 ? (
//           <p className="text-sm text-gray-500">No services selected.</p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left border-b">
//                 <th className="py-1">Service</th>
//                 <th className="py-1">Labour Hours</th>
//                 <th className="py-1">Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedServices.map((s, index) => (
//                 <tr key={index} className="border-t">
//                   <td>{s.name}</td>
//                   <td>{s.labourTime}</td>
//                   <td>${s.price.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Totals Box */}
//       <div className="p-6 bg-white shadow-lg rounded-lg border">
//         <h3 className="text-xl font-bold text-gray-800 mb-4">Estimation Summary</h3>
//         <div className="space-y-2 text-sm text-gray-700">
//           <p>
//             <strong>Spare Parts Subtotal:</strong> ${totalSpare.toFixed(2)}
//           </p>
//           <p>
//             <strong>Service Items Subtotal:</strong> ${totalService.toFixed(2)}
//           </p>
//           <p>
//             <strong>Total Labour Time (hrs):</strong> {(totalLabourTime / 60).toFixed(2)}
//           </p>
//           <div className="grid md:grid-cols-3 gap-4 mt-4">
//             <label className="block">
//               <span className="text-gray-700 font-medium">Manual Labor Fee</span>
//               <input
//                 type="number"
//                 className="input w-full"
//                 value={laborFee}
//                 onChange={(e) => setLaborFee(parseFloat(e.target.value) || 0)}
//               />
//             </label>
//             <label className="block">
//               <span className="text-gray-700 font-medium">Service Fee</span>
//               <input
//                 type="number"
//                 className="input w-full"
//                 value={serviceFee}
//                 onChange={(e) => setServiceFee(parseFloat(e.target.value) || 0)}
//               />
//             </label>
//             <label className="block">
//               <span className="text-gray-700 font-medium">Sales Tax</span>
//               <input
//                 type="number"
//                 className="input w-full"
//                 value={salesTax}
//                 onChange={(e) => setSalesTax(parseFloat(e.target.value) || 0)}
//               />
//             </label>
//           </div>
//           <hr className="my-4" />
//           <p className="text-lg font-semibold text-gray-900">
//             TOTAL ESTIMATE: <span className="text-blue-700">${grandTotal.toFixed(2)}</span>
//           </p>
//         </div>
//       </div>

//       {/* Submit & Edit */}
//       <div className="flex justify-between items-center pt-6">
//         <button
//           onClick={() => setShowDialog(true)}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
//         >
//           Submit Final Estimate
//         </button>
//       </div>
//       {/* Confirmation Modal */}
//       <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="fixed z-50 inset-0 overflow-y-auto">
//         <div className="flex items-center justify-center min-h-screen px-4">
//           <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <Dialog.Title className="text-lg font-bold mb-4">Send Quotation?</Dialog.Title>
//             <p className="text-sm mb-6">This action will save the data, send the email, and download the PDF quotation.</p>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowDialog(false)}
//                 className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleFinalSubmit}
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//                 disabled={loading}
//               >
//                 {loading ? "Sending..." : "Send Quotation"}
//               </button>
//             </div>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default Step5ReviewAndSubmit;