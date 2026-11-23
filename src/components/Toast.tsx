import React from 'react';
import { Sparkles } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

export const Toast: React.FC = () => {
  const { toast } = usePlanner();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-brand-900/95 text-white shadow-2xl backdrop-blur-md border border-slate-700/60 dark:border-brand-700/50 text-xs font-semibold">
        <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
        <span>{toast}</span>
      </div>
    </div>
  );
};
