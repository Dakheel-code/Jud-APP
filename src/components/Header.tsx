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
                src="/logo.gif"
                alt="Jud Marketing & Agency"
                className="h-16 md:h-20 w-auto object-contain"
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
