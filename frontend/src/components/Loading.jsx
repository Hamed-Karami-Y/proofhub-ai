import React from 'react';
import { Loader2, Shield } from 'lucide-react';

export default function Loading({ message = 'Loading ProofHub AI Engine...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <Shield className="w-5 h-5 text-cyan-400 absolute" />
      </div>
      <p className="mt-4 text-xs font-mono text-slate-400 animate-pulse tracking-wide">{message}</p>
    </div>
  );
}
