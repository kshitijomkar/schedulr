// client/src/components/Logo.tsx
import React from 'react';
import Image from 'next/image';

const Logo = ({ showText = true }: { showText?: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Scheduler App Logo"
        width={32}
        height={32}
        priority
      />
      {showText && (
        <span className="text-xl font-bold text-foreground">Scheduler</span>
      )}
    </div>
  );
};

export default Logo;