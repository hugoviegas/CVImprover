import React, { ReactNode } from 'react';

interface A4PageProps {
  children: ReactNode;
  pageNumber?: number;
  totalPages?: number;
}

export const A4Page: React.FC<A4PageProps> = ({ children, pageNumber, totalPages }) => {
  return (
    <div className="relative w-[210mm] h-[297mm] bg-white shadow-lg mx-auto mb-8 overflow-hidden print:shadow-none print:mb-0 print:break-after-page">
      <div className="h-full p-[15mm] flex flex-col">
        {children}
      </div>
      
      {/* Page Number (optional) */}
      {pageNumber && totalPages && (
        <div className="absolute bottom-4 right-8 text-xs text-gray-400 print:hidden">
          Page {pageNumber} of {totalPages}
        </div>
      )}
    </div>
  );
};
