import React from 'react';
import { MarqueeText } from './MarqueeText';

interface LiberationBannerProps {
  className?: string;
}

export function LiberationBanner({ className = '' }: LiberationBannerProps) {
  return (
    <div className={`w-full py-3 px-4 bg-red-600/80 relative overflow-hidden rounded-lg shadow-md ${className}`}>
      {/* Star pattern background */}
      <div className="absolute inset-0 flex flex-wrap justify-between opacity-10">
        {Array(12).fill(0).map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">★</span>
        ))}
      </div>

      {/* Vietnam flag left */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 vietnam-flag w-8 h-5 opacity-80"></div>

      {/* Vietnam flag right */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 vietnam-flag w-8 h-5 opacity-80"></div>

      {/* Content */}
      <div className="text-center relative z-10 px-16">
        <MarqueeText 
          text="★ Chào mừng kỷ niệm 50 năm ngày Giải phóng miền Nam, thống nhất đất nước (30/4/1975 - 30/4/2025) ★ Chúc mừng lễ kỷ niệm 50 năm ngày giải phóng miền Nam ★"
          className="text-white font-bold text-sm md:text-base"
        />
      </div>
    </div>
  );
} 