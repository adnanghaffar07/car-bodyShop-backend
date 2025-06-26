// "use client";
// import React from "react";

// export default function Step3InsuranceInfo({ formData, updateFormData }: any) {
//   const insurance = formData.insuranceInfo || {};

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800">Insurance Information</h2>

//       {/* Insurance Company */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Insurance Company
//         </label>
//         <input
//           type="text"
//           placeholder="Enter Insurance Company"
//           value={insurance.insuranceCompany || ""}
//           onChange={(e) =>
//             updateFormData({
//               insuranceInfo: { ...insurance, insuranceCompany: e.target.value },
//             })
//           }
//           className="input w-full"
//         />
//       </div>

//       {/* Policy Number */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Policy Number
//         </label>
//         <input
//           type="text"
//           placeholder="Enter Policy Number"
//           value={insurance.policyNumber || ""}
//           onChange={(e) =>
//             updateFormData({
//               insuranceInfo: { ...insurance, policyNumber: e.target.value },
//             })
//           }
//           className="input w-full"
//         />
//       </div>

//       {/* Policy Expiry Date */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Policy Expiry Date
//         </label>
//         <input
//           type="date"
//           value={insurance.policyExpiryDate || ""}
//           onChange={(e) =>
//             updateFormData({
//               insuranceInfo: { ...insurance, policyExpiryDate: e.target.value },
//             })
//           }
//           className="input w-full"
//         />
//       </div>

//       {/* Coverage Valid Checkbox */}
//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           checked={insurance.isCoverageValid || false}
//           onChange={(e) =>
//             updateFormData({
//               insuranceInfo: { ...insurance, isCoverageValid: e.target.checked },
//             })
//           }
//         />
//         <label className="text-sm text-gray-700">Is Coverage Valid?</label>
//       </div>
//     </div>
//   );
// }
