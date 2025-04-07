"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { MessageSquare, LayoutDashboard, Menu, X, Building, ChevronRight } from "lucide-react";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export default function Header({ isLoggedIn = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 backdrop-blur-lg shadow-lg" : "py-4"
      }`}
      style={{ 
        backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
        boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
      }}
    >
      {/* Gradient border bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3b82f6]/30 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Background glow effect */}
      {isScrolled && (
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-24 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10"></div>
          <div className="absolute -top-24 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10"></div>
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative mr-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] group-hover:from-[#2563eb] group-hover:to-[#1e40af] transition-all duration-300">
              reva.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/admin" 
                  className="text-[#f3f4f6] hover:text-[#3b82f6] transition-colors duration-300 flex items-center gap-2 relative group"
                >
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3b82f6] group-hover:w-full transition-all duration-300"></span>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/chat" 
                  className="text-[#f3f4f6] hover:text-[#3b82f6] transition-colors duration-300 flex items-center gap-2 relative group"
                >
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3b82f6] group-hover:w-full transition-all duration-300"></span>
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </Link>
                <button 
                  className="group relative px-4 py-2 rounded-full border border-[#334155] hover:border-[#3b82f6] hover:bg-[#1e293b]/50 transition-all duration-300 text-[#f3f4f6] overflow-hidden"
                >
                  <span className="relative z-10 group-hover:text-[#3b82f6] transition-colors duration-300">Sign Out</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/admin" 
                  className="text-[#f3f4f6] hover:text-[#3b82f6] transition-colors duration-300 relative group"
                >
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3b82f6] group-hover:w-full transition-all duration-300"></span>
                  <span>Admin</span>
                </Link>
                <Link 
                  href="/chat" 
                  className="group relative inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Chat</span>
                  <ChevronRight className="w-4 h-4 relative z-10 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="p-2 rounded-full bg-[#1e293b]/50 border border-[#334155] group-hover:border-[#3b82f6] transition-colors duration-300">
              {isMenuOpen ? 
                <X className="w-5 h-5 text-[#f3f4f6] group-hover:text-[#3b82f6] transition-colors duration-300" /> : 
                <Menu className="w-5 h-5 text-[#f3f4f6] group-hover:text-[#3b82f6] transition-colors duration-300" />
              }
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="relative z-10 md:hidden bg-gradient-to-b from-[#0f172a] to-[#1e293b] border-t border-[#334155]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10"></div>
          </div>
          
          <div className="relative px-4 py-6 space-y-4">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block text-[#f3f4f6] hover:text-[#3b82f6] transition-colors duration-300 flex items-center gap-2 py-2 pl-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/chat" 
                  className="block text-[#f3f4f6] hover:text-[#3b82f6] transition-colors duration-300 flex items-center gap-2 py-2 pl-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </Link>
                <button 
                  className="w-full px-4 py-2 rounded-full border border-[#334155] hover:border-[#3b82f6] hover:bg-[#1e293b]/50 transition-colors duration-300 text-[#f3f4f6] mt-4"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/admin" 
                  className="block text-[#f3f4f6] hover:text-[#3b82f6] transition-colors duration-300 py-2 pl-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
                <Link 
                  href="/chat" 
                  className="group relative inline-flex items-center justify-center w-full px-4 py-2 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-300 text-center mt-4 overflow-hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">Chat</span>
                  <ChevronRight className="w-4 h-4 ml-1 relative z-10 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 