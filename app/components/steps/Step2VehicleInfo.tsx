// "use client";
// import React, { useEffect, useState } from "react";

// export default function Step2VehicleInfo({ formData, updateFormData }: any) {
//   type VehicleDataType = {
//     [manufacturer: string]: {
//       [type: string]: string[];
//     };
//   };

//   const [vehicleData, setVehicleData] = useState<VehicleDataType>({});
//   const [types, setTypes] = useState<string[]>([]);
//   const [models, setModels] = useState<string[]>([]);

//   useEffect(() => {
//     fetch("/api/vehicles")
//       .then((res) => res.json())
//       .then((data) => setVehicleData(data.vehicleData));
//   }, []);

//   const handleManufacturerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const manufacturer = e.target.value;
//     updateFormData({
//       vehicleInfo: { ...(formData.vehicleInfo || {}), manufacturer, type: "", model: "" },
//     });

//     if (vehicleData[manufacturer]) {
//       setTypes(Object.keys(vehicleData[manufacturer]));
//       setModels([]);
//     }
//   };

//   const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const type = e.target.value;
//     const manufacturer = formData.vehicleInfo?.manufacturer;

//     updateFormData({
//       vehicleInfo: { ...(formData.vehicleInfo || {}), type, model: "" },
//     });

//     if (manufacturer && vehicleData[manufacturer]) {
//       const modelsForType = vehicleData[manufacturer][type] || [];
//       setModels(modelsForType);
//     }
//   };

//   const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     updateFormData({
//       vehicleInfo: { ...(formData.vehicleInfo || {}), model: e.target.value },
//     });
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Information</h2>

//       {/* Manufacturer */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
//         <select
//           value={formData.vehicleInfo?.manufacturer || ""}
//           onChange={handleManufacturerChange}
//           className="input w-full"
//         >
//           <option value="">Select Manufacturer</option>
//           {Object.keys(vehicleData).map((brand) => (
//             <option key={brand} value={brand}>
//               {brand}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Type */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
//         <select
//           value={formData.vehicleInfo?.type || ""}
//           onChange={handleTypeChange}
//           className="input w-full"
//           disabled={!formData.vehicleInfo?.manufacturer}
//         >
//           <option value="">Select Type</option>
//           {types.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Model */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
//         <select
//           value={formData.vehicleInfo?.model || ""}
//           onChange={handleModelChange}
//           className="input w-full"
//           disabled={!formData.vehicleInfo?.type}
//         >
//           <option value="">Select Model</option>
//           {models.map((model) => (
//             <option key={model} value={model}>
//               {model}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Year */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//         <input
//           type="number"
//           value={formData.vehicleInfo?.year || ""}
//           onChange={(e) =>
//             updateFormData({
//               vehicleInfo: { ...(formData.vehicleInfo || {}), year: e.target.value },
//             })
//           }
//           className="input w-full"
//         />
//       </div>

//       {/* VIN */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
//         <input
//           type="text"
//           value={formData.vehicleInfo?.vin || ""}
//           onChange={(e) =>
//             updateFormData({
//               vehicleInfo: { ...(formData.vehicleInfo || {}), vin: e.target.value },
//             })
//           }
//           className="input w-full"
//         />
//       </div>

//       {/* License Number */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
//         <input
//           type="text"
//           value={formData.vehicleInfo?.licenceNumber || ""}
//           onChange={(e) =>
//             updateFormData({
//               vehicleInfo: { ...(formData.vehicleInfo || {}), licenceNumber: e.target.value },
//             })
//           }
//           className="input w-full"
//         />
//       </div>

//       {/* Color */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
//         <input
//           type="text"
//           value={formData.vehicleInfo?.color || ""}
//           onChange={(e) =>
//             updateFormData({
//               vehicleInfo: { ...(formData.vehicleInfo || {}), color: e.target.value },
//             })
//           }
//           className="input w-full"
//         />
//       </div>
//     </div>
//   );
// }
