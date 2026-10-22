'use client';

import React from 'react';
import type { PageView } from '../Header';
import { AppraisalCalculator } from '../avaluos/AppraisalCalculator';

interface AppraisalsViewProps {
  onNavigate?: (page: PageView) => void;
}

export function AppraisalsView({ onNavigate }: AppraisalsViewProps) {
  return (
    <div className="w-full h-full max-h-screen overflow-hidden bg-transparent text-slate-900 pt-24 sm:pt-26 lg:pt-28 pb-4 sm:pb-5 flex flex-col justify-between select-none">
      <div className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
        <AppraisalCalculator />
      </div>
    </div>
  );
}
