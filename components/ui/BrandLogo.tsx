'use client';

import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  lightText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  lightText = false
}) => {
  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 52
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <div className="flex items-center gap-3">
      {/* Official Image Logo Badge */}
      <div className="relative shrink-0 overflow-hidden rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center">
        <Image
          src="/logo.jpg"
          alt="AD CARE Meds & Pharmacy Logo"
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-contain rounded-lg"
          priority
        />
      </div>

      {/* Styled Brand Text */}
      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight font-sans flex items-center gap-1 ${textSizes[size]}`}>
          <span className={lightText ? 'text-white font-black' : 'text-[#3b558c] font-black'}>AD</span>
          <span className="text-[#61b849] font-black">CARE</span>
        </div>
        {showSubtitle && (
          <div className={`text-[10px] font-semibold tracking-wider uppercase ${lightText ? 'text-slate-300' : 'text-slate-400'}`}>
            Meds & Pharmacy
          </div>
        )}
      </div>
    </div>
  );
};
