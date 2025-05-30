import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
      <div className="relative w-16 h-16">
        <div className="absolute w-16 h-16 border-4 border-[#00C68E]/20 rounded-full"></div>
        <div className="absolute w-16 h-16 border-4 border-transparent border-t-[#00C68E] rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
