import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyAuditApi } from '../services/api.js';
import { verifyProofOnChain } from '../services/blockchain.js';
import { formatDate, formatHash, copyToClipboard } from '../utils/format.js';
import Loading from '../components/Loading.jsx';
import { Search, ShieldCheck, CheckCircle2, XCircle, FileText, Cpu, Clock, AlertTriangle, ShieldAlert, Copy, Check } from 'lucide-react';

export default function VerifyAudit() {
  const [searchParams] = useSearchParams();
  const initialAuditId = searchParams.get('auditId') || searchParams.get('hash') || '';

  const [inputQuery, setInputQuery] = useState(initialAuditId);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [onChainData, setOnChainData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleVerify = async (queryToUse) => {
    const query = (queryToUse || inputQuery).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setVerificationResult(null);
    setOnChainData(null);

    try {
      // Determine if query is auditId or proofHash
      const payload = query.startsWith('0x') ? { proofHash: query } : { auditId: query };

      // Call Backend Verification API
      const apiResult = await verifyAuditApi(payload);
      setVerificationResult(apiResult);

      // Query Smart Contract On-Chain Proof directly via viem/blockchain service
      const proofHashToQuery = apiResult?.audit?.proofHash || (query.startsWith('0x') ? query : null);
      if (proofHashToQuery) {
        const chainRes = await verifyProofOnChain(proofHashToQuery);
        setOnChainData(chainRes);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Verification failed for the given query.');
      setVerificationResult({
        success: false,
        verified: false,
        details: {
          proofExists: false,
          hashMatches: false,
          noModificationDetected: false,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialAuditId) {
      handleVerify(initialAuditId);
    }
  }, [initialAuditId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  const isSuccess = verificationResult?.verified && (verificationResult?.details?.proofExists || onChainData?.exists);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <span>Verify Audit Proof Integrity</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Query the AI audit pipeline and smart contract proof registry to confirm decision untampered integrity.
        </p>
      </div>

      {/* Query Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Enter Audit ID (e.g. audit_1722...) or 0x Proof Hash..."
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-950/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Verifying...' : 'Verify Proof'}</span>
          </button>
        </form>
      </div>

      {/* Loading */}
      {loading && <Loading message="Querying backend audit store & smart contract ProofRegistry..." />}

      {/* Verification Results Display */}
      {verificationResult && !loading && (
        <div className="space-y-6">
          {/* Main Status Header Box */}
          <div
            className={`p-6 rounded-2xl border ${
              isSuccess
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                : 'bg-red-950/40 border-red-800/80 text-red-300'
            } shadow-2xl flex items-start gap-4`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-1 animate-pulse" />
            ) : (
              <XCircle className="w-8 h-8 text-red-400 shrink-0 mt-1" />
            )}

            <div>
              <h2 className="text-lg font-bold font-mono tracking-tight">
                {isSuccess ? '✓ Audit Verified Successfully' : '✕ Verification Failed'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isSuccess
                  ? 'Cryptographic SHA-256 proof hash matches execution parameters. Zero modification detected.'
                  : error || 'The requested Audit ID or Proof Hash could not be verified in the registry or smart contract.'}
              </p>

              {/* Verification Checklist Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <CheckCircle2 className={`w-4 h-4 ${verificationResult.details?.proofExists ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span>Proof Exists</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <CheckCircle2 className={`w-4 h-4 ${verificationResult.details?.hashMatches ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span>Hash Matches</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <CheckCircle2 className={`w-4 h-4 ${onChainData?.exists || verificationResult.verified ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span>{onChainData?.exists ? 'On-Chain Confirmed' : 'Off-Chain Verified'}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <CheckCircle2 className={`w-4 h-4 ${verificationResult.details?.noModificationDetected ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span>Unmodified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Details Card */}
          {verificationResult.audit && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 font-mono text-xs">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Verified Audit Execution Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Audit ID</span>
                  <p className="text-slate-200 mt-1">{verificationResult.audit.id}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Model</span>
                  <p className="text-slate-200 mt-1">{verificationResult.audit.model || 'gemini-2.5-flash'}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Execution Timestamp</span>
                  <p className="text-slate-200 mt-1">{formatDate(verificationResult.audit.timestamp)}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Proof Hash</span>
                  <p className="text-cyan-300 mt-1 truncate">{verificationResult.audit.proofHash}</p>
                </div>
              </div>

              {/* Prompt */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Original Input Prompt</span>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 font-sans italic">
                  "{verificationResult.audit.prompt}"
                </p>
              </div>

              {/* Response */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">AI Audit Output Analysis</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                  {verificationResult.audit.aiResponse}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
