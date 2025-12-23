'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            {!logoError ? (
              <img
                src="https://jud.sa/wp-content/uploads/2025/02/ChatGPT-Image-12-%D8%B3%D8%A8%D8%AA%D9%85%D8%A8%D8%B1-2025%D8%8C-06_53_56-%D9%85.png"
                alt="Jud Marketing & Agency"
                className="h-12 w-auto"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-2xl font-bold text-white">جود</span>
            )}
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white hover:text-purple-200 font-medium transition">
              الرئيسية
            </Link>
            <Link href="/dashboard" className="text-white hover:text-purple-200 font-medium transition">
              لوحة التحكم
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
