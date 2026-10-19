'use client';

import React from 'react';
import type { PageView } from '../Header';
import { AppraisalCalculator } from '../avaluos/AppraisalCalculator';

interface AppraisalsViewProps {
  onNavigate?: (page: PageView) => void;
}

export function AppraisalsView({ onNavigate }: AppraisalsViewProps) {
  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-20 sm:pt-24 pb-16 md:pb-6 flex flex-col justify-start">
      <div className="w-full flex-1 px-4 sm:px-8 lg:px-12 flex flex-col justify-start">
        <AppraisalCalculator />
      </div>
    </div>
  );
}
