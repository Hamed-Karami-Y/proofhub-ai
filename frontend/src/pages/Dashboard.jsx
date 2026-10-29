import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet.js';
import AuditCard from '../components/AuditCard.jsx';
import Loading from '../components/Loading.jsx';
import { formatAddress } from '../utils/format.js';
import { Wallet, PlusCircle, ShieldCheck, History, AlertCircle, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { PROOF_REGISTRY_ADDRESS, PROOF_REGISTRY_ABI } from '../config/contract.js';
import { ethers } from 'ethers';
import { getAllAuditsApi, confirmBlockchain } from '../services/api.js';
export default function Dashboard() {
  const { address, isConnected, connectMetaMask, registerProof, isSubmittingTx, isConfirmingTx } = useWallet();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const { sendTransactionAsync, data: txHash } = useSendTransaction();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });
  const [pendingAudit, setPendingAudit] = useState(null);
  const [isAnchoring, setIsAnchoring] = useState(false);

  useEffect(() => {
    if (isConfirmed && txHash && pendingAudit) {
      const confirm = async () => {
        await confirmBlockchain(pendingAudit.auditRecordId, txHash, PROOF_REGISTRY_ADDRESS);
        setPendingAudit(null);
        setIsAnchoring(false);
        await fetchAudits();
        alert('✅ Proof anchored!');
      };
      confirm();
    }
  }, [isConfirmed, txHash, pendingAudit]);

  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAuditsApi();
      if (data && data.audits) {
        setAudits(data.audits);
      }
    } catch (err) {
      console.error('Error fetching dashboard audits:', err);
      setError(err.message || 'Failed to fetch audits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  // قبل از استفاده، این تابع را تعریف کنید
  function formatToBytes32(hash) {
    // اگر 0x در ابتدا نیست، اضافه کن
    let clean = hash.startsWith('0x') ? hash : '0x' + hash;
    // اگر طول کمتر از 66 کاراکتر است (0x + 64)، با 0 پر کن
    while (clean.length < 66) {
      clean = clean.slice(0, 2) + '0' + clean.slice(2);
    }
    // اگر بیشتر است، کوتاه کن
    return clean.slice(0, 66);
  }

  const handleVerifyOnChain = async (audit) => {
    
    if (!address) {
      alert('Please connect wallet first.');
      return;
    }
   setPendingAudit(audit);
   setIsAnchoring(true);
    try {
      const formattedHash = formatToBytes32(audit.proofHash);

      const tx = await sendTransactionAsync({
        to: PROOF_REGISTRY_ADDRESS,
        data: new ethers.Interface(PROOF_REGISTRY_ABI).encodeFunctionData('registerProof', [formattedHash]),
      });
    } catch (err) {
      console.error(err);
      setPendingAudit(null);
      setIsAnchoring(false);
    }
  };

  const totalAudits = audits.length;
  const verifiedCount = audits.filter(a => a.blockchainVerified === true).length;
  const pendingCount = totalAudits - verifiedCount;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>Audit Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit infrastructure overview and proof monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
          disabled={isAnchoring}
            onClick={fetchAudits}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/80 transition-colors cursor-pointer"
            title="Refresh Audits"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/create"
            onClick={(e) => {
    if (isAnchoring) e.preventDefault();
  }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-cyan-950/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Audit</span>
          </Link>
        </div>
      </div>

      {/* Wallet Identity Alert banner if disconnected */}
      {!isConnected ? (
        <div className="mb-8 p-5 bg-cyan-950/30 border border-cyan-800/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-cyan-200">Wallet Disconnected</h3>
              <p className="text-xs text-slate-400">Connect your Web3 wallet (MetaMask) to submit and anchor proofs on-chain.</p>
            </div>
          </div>
          <button
            onClick={connectMetaMask}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        /* Connected Info Stats Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Identity Card */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Connected Wallet</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-sm font-bold text-slate-200">{formatAddress(address)}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Identity Verified via Web3</span>
          </div>

          {/* Total Audits */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Total Audits</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-cyan-400">{totalAudits}</span>
              <span className="text-xs text-slate-500">records</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">AI Execution Proofs</span>
          </div>

          {/* Verified On-Chain */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">On-Chain Anchors</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-400">{verifiedCount}</span>
              <span className="text-xs text-slate-500">confirmed</span>
            </div>
            <span className="text-[10px] text-emerald-500/80 block mt-1">Smart Contract Sealed</span>
          </div>

          {/* Pending On-Chain */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Pending Anchor</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-amber-400">{pendingCount}</span>
              <span className="text-xs text-slate-500">unanchored</span>
            </div>
            <span className="text-[10px] text-amber-500/80 block mt-1">Ready for Blockchain</span>
          </div>
        </div>
      )}

      {/* Action Notification */}
      {actionMessage && (
        <div className="mb-6 p-4 bg-slate-900 border border-cyan-800/60 rounded-xl text-xs text-cyan-300 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-200">
            Dismiss
          </button>
        </div>
      )}

      {/* Recent Audits Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-mono text-slate-200 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Recent AI Audit Logs</span>
          </h2>
          <Link to="/history" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
            View All History →
          </Link>
        </div>

        {loading ? (
          <Loading message="Fetching recent audits from registry..." />
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800/50 p-6 rounded-2xl text-center text-red-300 text-xs">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p>{error}</p>
            <button
              onClick={fetchAudits}
              className="mt-3 px-3 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : audits.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-2xl text-center">
            <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-semibold mb-1">No Audits Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              You haven't generated any AI audit proofs yet. Create your first audit to get started.
            </p>
            <Link
              to="/create"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
            >
              Create New Audit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audits.slice(0, 6).map((audit) => (
              <AuditCard
  key={audit.auditRecordId}
  audit={audit}
  onVerifyOnChain={handleVerifyOnChain}
  isAnchoring={isAnchoring}
  isPending={pendingAudit?.auditRecordId === audit.auditRecordId}
/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
