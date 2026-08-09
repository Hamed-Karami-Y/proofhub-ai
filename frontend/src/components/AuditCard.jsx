import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatHash, formatDate, copyToClipboard } from '../utils/format.js';
import { ShieldCheck, Copy, Check, ExternalLink, Cpu, Clock, Hash, FileText } from 'lucide-react';

export default function AuditCard({ audit, onVerifyOnChain }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  

  const handleCopyHash = async (e) => {
    e.stopPropagation();
    if (audit?.proofHash) {
      await copyToClipboard(audit.proofHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!audit) return null;

  const isVerified = audit.status === 'verified' || audit.status === 'registered' || audit.txHash;

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-xl hover:shadow-cyan-950/10 flex flex-col justify-between">
      <div>
        {/* Header line: ID & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <span className="font-mono text-xs font-semibold text-slate-200 tracking-tight block">
                {audit.id}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-slate-500" />
                {formatDate(audit.timestamp)}
              </span>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 ${
              isVerified
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isVerified ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            {isVerified ? 'Verified On-Chain' : 'Pending Blockchain'}
          </span>
        </div>

        {/* Model Badge & Hash line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400">Model:</span>
            <span className="font-mono text-slate-200">{audit.model || 'gemini-2.5-flash'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-1.5 font-mono text-slate-300">
              <Hash className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{formatHash(audit.proofHash)}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
              title="Copy Proof Hash"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Prompt Preview */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Prompt:</span>
          </div>
          <p className="text-xs text-slate-200 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40 line-clamp-2 italic font-sans">
            "{audit.prompt}"
          </p>
        </div>

        {/* AI Response Preview (Expandable) */}
        {audit.aiResponse && (
          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
            >
              {expanded ? 'Hide AI Audit Analysis ▲' : 'Show AI Audit Analysis ▼'}
            </button>

            {expanded && (
              <div className="mt-2 text-xs font-mono text-slate-300 bg-slate-950/90 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {audit.aiResponse}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/60">
        <Link
          to={`/verify?auditId=${audit.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700/60"
        >
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          <span>Verify Proof</span>
        </Link>

        {onVerifyOnChain && !isVerified && (
          <button
            onClick={() => onVerifyOnChain(audit)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-md cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Anchor to Web3</span>
          </button>
        )}
      </div>
    </div>
  );
}
