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

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(''); // clear previous error

//     try {
//       const res = await axios.post('/api/login-owner', { email, password });
//       localStorage.setItem('accessToken', res.data.accessToken);
//       router.push('/'); // Redirect after login
//     } catch {
//       setErrorMessage('Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6">
//         <h1 className="text-3xl font-bold text-center text-gray-800">Login to Your Account</h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {errorMessage && (
//             <p className="text-red-600 text-sm text-center">{errorMessage}</p>
//           )}

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div className="text-center text-sm text-gray-600">
//           Don’t have an account?{' '}
//           <button
//             type="button"
//             onClick={() => router.push('/register')}
//             className="text-indigo-600 hover:underline font-medium"
//           >
//             Register here
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
