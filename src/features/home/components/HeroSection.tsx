'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function HeroSection(): React.ReactNode {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Flexi-Store</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Discover curated products for every lifestyle. Shop from our exclusive collection of trending items, premium brands, and must-have essentials.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button className="px-8 py-3 text-lg font-semibold">
              Shop Now
            </Button>
          </Link>
          <Link href="#featured">
            <Button className="px-8 py-3 text-lg font-semibold border border-gray-900 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
              Explore Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
