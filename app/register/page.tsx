// app/login/page.tsx
import React from "react";

export default function LoginPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Login Page</h1>
      {/* Your login form goes here */}
    </div>
  );
}


// 'use client';
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function RegisterPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     fullName: '',
//     businessName: '',
//     email: '',
//     phoneNumber: '',
//     password: '',
//     shopAddress: '',
//     businessLicense: '',
//     taxId: '',
//     serviceAreaRadius: '',
//     documents: [] as File[],
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, files } = e.target;
//     if (name === 'documents') {
//       setFormData({ ...formData, documents: files ? Array.from(files) : [] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage('');

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === 'documents') {
//         (value as File[]).forEach((file) => data.append('documents', file));
//       } else {
//         data.append(key, value as string);
//       }
//     });

//     try {
//       const res = await axios.post('/api/register-owner', data);
//       localStorage.setItem('accessToken', res.data.accessToken);
//       router.push('/login'); // Redirect to login
//     } catch{
//       setErrorMessage('Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8 space-y-6">
//         <h1 className="text-3xl font-bold text-center text-gray-800">Create Your Body Shop Account</h1>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input name="fullName" placeholder="Full Name" onChange={handleInputChange} required className="input" />
//           <input name="businessName" placeholder="Business Name" onChange={handleInputChange} required className="input" />
//           <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="input" />
//           <input name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} required className="input" />
//           <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required className="input" />
//           <input name="shopAddress" placeholder="Shop Address" onChange={handleInputChange} required className="input" />
//           <input name="businessLicense" placeholder="Business License" onChange={handleInputChange} className="input" />
//           <input name="taxId" placeholder="Tax ID" onChange={handleInputChange} className="input" />
//           <input name="serviceAreaRadius" placeholder="Service Radius (km)" onChange={handleInputChange} className="input" />

//           <div className="col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents</label>
//             <input
//               name="documents"
//               type="file"
//               multiple
//               onChange={handleInputChange}
//               className="block w-full border rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//             />
//           </div>

//           {errorMessage && (
//             <div className="col-span-2 text-red-600 text-sm text-center">{errorMessage}</div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50"
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </form>

//         <div className="text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <button
//             type="button"
//             className="text-indigo-600 hover:underline font-medium"
//             onClick={() => router.push('/login')}
//           >
//             Login here
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
