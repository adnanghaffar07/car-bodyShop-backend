'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <div className="w-full bg-white shadow flex justify-between items-center p-4">
      <h1 className="text-lg font-bold">Car Body Shop</h1>
      <div className="relative">
        <button onClick={() => setShowMenu(!showMenu)} className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
          👤 My Profile
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
            <button onClick={() => router.push('/edit-profile')} className="w-full text-left px-4 py-2 hover:bg-gray-100">Edit Profile</button>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
