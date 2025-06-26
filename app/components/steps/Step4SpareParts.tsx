// 'use client';

// import React from 'react';

// interface SparePart {
//   partId: string;
//   partName: string;
// }

// interface Props {
//   spareParts: SparePart[];
//   services: string[];
//   selectedParts: {
//     partId: string;
//     quantity: number;
//     labourTime: number;
//     price: number;
//   }[];
//   setSelectedParts: React.Dispatch<React.SetStateAction<any[]>>;
//   selectedServices: {
//     name: string;
//     labourTime: number;
//     price: number;
//   }[];
//   setSelectedServices: React.Dispatch<React.SetStateAction<any[]>>;
// }

// const Step4PartsAndServices: React.FC<Props> = ({
//   spareParts,
//   services,
//   selectedParts,
//   setSelectedParts,
//   selectedServices,
//   setSelectedServices,
// }) => {
//   const handlePartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const partId = e.target.value;
//     const part = spareParts.find(p => p.partId === partId);
//     if (!part || selectedParts.some(p => p.partId === partId)) return;

//     setSelectedParts(prev => [...prev, { partId, quantity: 1, labourTime: 0, price: 0 }]);
//   };

//   const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const name = e.target.value;
//     if (!name || selectedServices.some(s => s.name === name)) return;

//     setSelectedServices(prev => [...prev, { name, labourTime: 0, price: 0 }]);
//   };

//   const updatePartField = (index: number, field: string, value: number) => {
//     setSelectedParts(prev => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   };

//   const updateServiceField = (index: number, field: string, value: number) => {
//     setSelectedServices(prev => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   };

//   const removePart = (partId: string) => {
//     setSelectedParts(prev => prev.filter(p => p.partId !== partId));
//   };

//   const removeService = (name: string) => {
//     setSelectedServices(prev => prev.filter(s => s.name !== name));
//   };

//   return (
//     <div className="p-4 space-y-6">
//       <h2 className="text-xl font-semibold">Step 4: Spare Parts & Services</h2>

//       {/* Spare Parts */}
//       <div>
//         <label className="block mb-1 font-medium">Add Spare Part</label>
//         <select onChange={handlePartChange} className="mb-4 p-2 border rounded w-full">
//           <option value="">Select a spare part</option>
//           {spareParts.map((part) => (
//             <option key={part.partId} value={part.partId}>
//               {part.partName}
//             </option>
//           ))}
//         </select>

//         {selectedParts.map((part, index) => (
//           <div key={part.partId} className="mb-3 p-3 border rounded bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div className="font-medium">
//                 {spareParts.find(p => p.partId === part.partId)?.partName}
//               </div>
//               <button
//                 className="text-red-500 hover:text-red-700"
//                 onClick={() => removePart(part.partId)}
//               >
//                 Remove
//               </button>
//             </div>
//             <div className="grid grid-cols-3 gap-4 mt-2">
//               <div>
//                 <label className="block text-sm font-medium">Quantity</label>
//                 <input
//                   type="number"
//                   className="border p-2 rounded w-full"
//                   value={part.quantity}
//                   onChange={(e) => updatePartField(index, 'quantity', parseInt(e.target.value) || 1)}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Labour Time (hrs)</label>
//                 <input
//                   type="number"
//                   className="border p-2 rounded w-full"
//                   value={part.labourTime}
//                   onChange={(e) => updatePartField(index, 'labourTime', parseFloat(e.target.value) || 0)}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Price</label>
//                 <input
//                   type="number"
//                   className="border p-2 rounded w-full"
//                   value={part.price}
//                   onChange={(e) => updatePartField(index, 'price', parseFloat(e.target.value) || 0)}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Services */}
//       <div>
//         <label className="block mb-1 font-medium">Add Service</label>
//         <select onChange={handleServiceChange} className="mb-4 p-2 border rounded w-full">
//           <option value="">Select a service</option>
//           {services.map((service) => (
//             <option key={service} value={service}>
//               {service}
//             </option>
//           ))}
//         </select>

//         {selectedServices.map((service, index) => (
//           <div key={service.name} className="mb-3 p-3 border rounded bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div className="font-medium">{service.name}</div>
//               <button
//                 className="text-red-500 hover:text-red-700"
//                 onClick={() => removeService(service.name)}
//               >
//                 Remove
//               </button>
//             </div>
//             <div className="grid grid-cols-2 gap-4 mt-2">
//               <div>
//                 <label className="block text-sm font-medium">Labour Time (hrs)</label>
//                 <input
//                   type="number"
//                   className="border p-2 rounded w-full"
//                   value={service.labourTime}
//                   onChange={(e) => updateServiceField(index, 'labourTime', parseFloat(e.target.value) || 0)}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Price</label>
//                 <input
//                   type="number"
//                   className="border p-2 rounded w-full"
//                   value={service.price}
//                   onChange={(e) => updateServiceField(index, 'price', parseFloat(e.target.value) || 0)}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Step4PartsAndServices;
