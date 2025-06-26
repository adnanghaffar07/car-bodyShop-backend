// "use client";
// import { useEffect, useState } from "react";
// import Step1CustomerInfo from "./steps/Step1CustomerInfo";
// import Step2VehicleInfo from "./steps/Step2VehicleInfo";
// import Step3InsuranceInfo from "./steps/Step3InsuranceInfo";
// import Step4PartsAndServices from "./steps/Step4SpareParts";
// import Step5ReviewAndSubmit from "./steps/Step5ReviewAndSubmit";

// // 🧾 Types
// type CustomerInfo = {
//     fullName: string;
//     email: string;
//     phoneNumber: string;
//     createdBy: string;
// };

// type VehicleInfo = {
//     manufacturer: string;
//     type: string;
//     model: string;
//     year: number;
//     vin: string;
//     licenceNumber: string;
//     color: string;
// };

// type InsuranceInfo = {
//     company: string;
//     policyNumber: string;
//     expiryDate: string;
//     isCoverageValid: boolean;
// };

// type SparePart = {
//     partId: string;
//     partName: string;
// };

// type SelectedPart = {
//     partId: string;
//     quantity: number;
//     labourTime: number;
//     price: number;
// };

// type SelectedService = {
//     name: string;
//     labourTime: number;
//     price: number;
// };

// type FormDataType = {
//     customerInfo?: CustomerInfo;
//     vehicleInfo?: VehicleInfo;
//     insuranceInfo?: InsuranceInfo;
// };

// const steps = [
//     "Customer Info",
//     "Vehicle Info",
//     "Insurance Info",
//     "Parts & Services",
//     "Review & Submit"
// ];

// export default function MultiStepForm() {
//     const [currentStep, setCurrentStep] = useState<number>(0);
//     const [formData, setFormData] = useState<FormDataType>({});
//     const [userId, setUserId] = useState<string | null>(null);

//     const [spareParts, setSpareParts] = useState<SparePart[]>([]);
//     const [services, setServices] = useState<string[]>([]);
//     const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
//     const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

//     // ✅ Fetch user profile
//     useEffect(() => {
//         fetch("/api/login-owner/user-profile", {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`
//             }
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 if (data?.user?.id) setUserId(data.user.id);
//             });
//     }, []);

//     // ✅ Fetch spare parts and services
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await fetch('/api/vehicles');
//                 const data = await res.json();
//                 setSpareParts(data.spareParts);
//                 setServices(data.services);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         fetchData();
//     }, []);

//     const next = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//     const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

//     const updateFormData = (newData: Partial<FormDataType>) => {
//         setFormData((prev) => ({ ...prev, ...newData }));
//     };

//     const stepProps = {
//         formData,
//         updateFormData,
//         next,
//         back,
//         userId
//     };

//     const renderStep = () => {
//         switch (currentStep) {
//             case 0:
//                 return <Step1CustomerInfo {...stepProps} />;
//             case 1:
//                 return <Step2VehicleInfo {...stepProps} />;
//             case 2:
//                 return <Step3InsuranceInfo {...stepProps} />;
//             case 3:
//                 return (
//                     <Step4PartsAndServices
//                         spareParts={spareParts}
//                         services={services}
//                         selectedParts={selectedParts}
//                         setSelectedParts={setSelectedParts}
//                         selectedServices={selectedServices}
//                         setSelectedServices={setSelectedServices}
//                     />
//                 );
//             case 4:
//                 return (
//                     <Step5ReviewAndSubmit
//                         formData={formData}
//                         selectedParts={selectedParts}
//                         selectedServices={selectedServices}
//                         spareParts={spareParts}
//                         onSubmit={() => console.log("Submitting...")}
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
//             <div className="mb-6 text-center">
//                 <h2 className="text-3xl font-bold text-gray-800">{steps[currentStep]}</h2>
//                 <div className="flex items-center justify-center mt-4 gap-2">
//                     {steps.map((_, index) => (
//                         <div
//                             key={index}
//                             className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentStep ? "bg-blue-600" : "bg-gray-300"
//                                 }`}
//                         ></div>
//                     ))}
//                 </div>
//             </div>

//             <div className="transition-all duration-300">{renderStep()}</div>

//             <div className="flex justify-between mt-10">
//                 {currentStep > 0 ? (
//                     <button
//                         onClick={back}
//                         className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg"
//                     >
//                         ← Back
//                     </button>
//                 ) : (
//                     <div></div>
//                 )}

//                 {currentStep < steps.length - 1 && (
//                     <button
//                         onClick={next}
//                         className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
//                     >
//                         Next →
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// }
