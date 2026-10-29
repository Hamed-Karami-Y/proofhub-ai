import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAuditsApi } from '../services/api.js';
import { formatHash, formatDate, copyToClipboard } from '../utils/format.js';
import Loading from '../components/Loading.jsx';
import { History, Search, ShieldCheck, Copy, Check, ExternalLink, RefreshCw, Eye, X, AlertCircle } from 'lucide-react';

export default function AuditHistory() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  
  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAuditsApi();
      if (data && data.audits) {
        setAudits(data.audits);
      }
    } catch (err) {
      console.error('Error fetching audit history:', err);
      setError(err.message || 'Failed to load audit history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleCopy = async (hash) => {
    await copyToClipboard(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // const filteredAudits = audits.filter(
  //   (a) =>
  //     a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     a.proofHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     a.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // خط 44
const filteredAudits = audits.filter(
  (a) =>
    (a?.auditRecordId && a.auditRecordId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a?.proofHash && a.proofHash.toLowerCase().includes(searchQuery.toLowerCase()))
);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Audit History & Proof Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical ledger of all generated AI audit proofs and cryptographic hash records.
          </p>
        </div>

        <button
          onClick={fetchAudits}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="mb-6 relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Audit ID, Proof Hash, or Prompt keywords..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-all"
        />
      </div>

      {/* Main Table View */}
      {loading ? (
        <Loading message="Loading audit history records..." />
      ) : error ? (
        <div className="bg-red-950/30 border border-red-800/50 p-8 rounded-2xl text-center text-red-300 text-xs">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p>{error}</p>
          <button
            onClick={fetchAudits}
            className="mt-3 px-4 py-2 bg-red-900/60 hover:bg-red-900 text-red-100 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      ) : filteredAudits.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-2xl text-center">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-300 font-semibold mb-1">No Audit Records Found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            {searchQuery ? 'No audits match your search filter.' : 'Your audit history ledger is currently empty.'}
          </p>
          <Link
            to="/create"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
          >
            Create New Audit
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Audit ID</th>
                  <th className="py-3.5 px-4 font-semibold">Model</th>
                  <th className="py-3.5 px-4 font-semibold">Created Date</th>
                  <th className="py-3.5 px-4 font-semibold">Proof Hash</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredAudits.map((audit) => {
                  const isVerified = audit.blockchainVerified === true;
                  return (
                    <tr key={audit.auditRecordId} className="hover:bg-slate-800/40 transition-colors">
                      {/* Audit ID */}
                      <td className="py-4 px-4 font-mono font-semibold text-slate-200 whitespace-nowrap">
                        {audit.auditRecordId}
                      </td>

                      {/* Model */}
                      <td className="py-4 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {audit.model || 'gemini-2.5-flash'}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                        {formatDate(audit.createdAt)}
                      </td>

                      {/* Proof Hash */}
                      <td className="py-4 px-4 font-mono text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{formatHash(audit.proofHash)}</span>
                          <button
                            onClick={() => handleCopy(audit.proofHash)}
                            className="text-slate-500 hover:text-cyan-400 p-1"
                            title="Copy Proof Hash"
                          >
                            {copiedHash === audit.proofHash ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
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
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAudit(audit)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700/60 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>View</span>
                          </button>

                          <Link
                            to={`/verify?auditId=${audit.proofHash}`}
                            className="px-2.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-medium flex items-center gap-1 border border-cyan-800/60"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Verify</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Detail Modal Drawer */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold font-mono text-slate-100">Audit Proof Details</h3>
              </div>
              <button
                onClick={() => setSelectedAudit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 uppercase tracking-wider block mb-1">Audit ID</span>
                <p className="text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800">{selectedAudit.auditRecordId}</p>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block mb-1">Proof Hash (SHA-256)</span>
                <p className="text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-all">{selectedAudit.proofHash}</p>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block mb-1">Prompt / Input</span>
                <p className="text-slate-300 font-sans italic bg-slate-950 p-3 rounded-lg border border-slate-800">{selectedAudit.prompt}</p>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider block mb-1">AI Audit Analysis Output</span>
                <div className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedAudit.aiResponse}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
              >
                Close
              </button>
              <Link
                to={`/verify?auditId=${selectedAudit.proofHash}`}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
              >
                Go to Verification Page
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
