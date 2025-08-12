import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 min-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center text-2xl font-bold text-blue-600">
            Edora
          </div>

          {/* Menu links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </a>
            <a href="/topics" className="text-gray-700 hover:text-blue-600 transition">
              Topics
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </a>
            <a href="/help" className="text-gray-700 hover:text-blue-600 transition">
              Help
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
