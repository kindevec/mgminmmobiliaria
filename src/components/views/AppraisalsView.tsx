'use client';

import React from 'react';
import type { PageView } from '../Header';
import { AppraisalCalculator } from '../avaluos/AppraisalCalculator';

interface AppraisalsViewProps {
  onNavigate?: (page: PageView) => void;
}

export function AppraisalsView({ onNavigate }: AppraisalsViewProps) {
  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-b from-slate-50 via-emerald-50/15 to-white text-slate-900 pt-16 sm:pt-20 pb-20 md:pb-4 flex flex-col">
      <div className="w-full flex-1 min-h-0 max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 flex flex-col justify-center overflow-hidden">
        <AppraisalCalculator />
      </div>
    </div>
  );
}
