"use client"

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0f172a] border-t border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8]">
                reva.ai
              </span>
            </Link>
          </div>
          
         
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#334155] text-center text-[#94a3b8] text-sm">
          © {currentYear} reva.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 