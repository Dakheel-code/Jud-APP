'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
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
              <span className="text-2xl font-bold text-primary-600">جود</span>
            )}
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition">
              الرئيسية
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition">
              لوحة التحكم
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
