'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-center items-center">
          <Link href="/" className="flex items-center">
            {!logoError ? (
              <img
                src="https://jud.sa/wp-content/uploads/2025/02/ChatGPT-Image-12-%D8%B3%D8%A8%D8%AA%D9%85%D8%A8%D8%B1-2025%D8%8C-06_53_56-%D9%85.png"
                alt="Jud Marketing & Agency"
                className="h-16 md:h-20 w-auto object-contain rounded-lg"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-3xl md:text-4xl font-bold text-white">جود</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
