import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0f172a] border-t border-gray-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} AI Research Assistant. All rights reserved.
        </p>
        <p className="text-[#354F52] font-semibold mt-2 text-base">
          Created By Joy Poddar
        </p>
      </div>
    </footer>
  );
};
