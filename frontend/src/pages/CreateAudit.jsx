import { useAccount, useConnect } from 'wagmi';
import { useWallet } from '../hooks/useWallet.js';
import { PROOF_REGISTRY_ADDRESS, PROOF_REGISTRY_ABI } from '../config/contract.js';
import { generateAudit, confirmBlockchain } from '../services/api.js';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading.jsx';
import {
  Sparkles,
  Send,
  AlertTriangle,
  ShieldCheck,
  Copy,
  Check,
  FileText,
  CheckCircle2,
  Lock
} from 'lucide-react';


export default function CreateAudit() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditResult, setAuditResult] = useState(null);
  const [anchorSuccess, setAnchorSuccess] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
const {
  registerProof,
  txHash,
  isSubmittingTx: walletSubmittingTx,
  isConfirmingTx: walletConfirmingTx,
  isTxConfirmed,
  walletError,
} = useWallet();
  const [recordId, setRecordId] = useState(null);


  useEffect(() => {
  if (isTxConfirmed && txHash && recordId) {
    const sendToBackend = async () => {
      try {
        console.log('recordId before confirm:', recordId);

        await confirmBlockchain(
          recordId,
          txHash,
          PROOF_REGISTRY_ADDRESS
        );

        setAnchorSuccess(true);

        alert('✅ Proof anchored successfully!');
      } catch (err) {
        console.error('Backend confirm error:', err);
        setError(err.message);
      }
    };

    sendToBackend();
  }
}, [isTxConfirmed, txHash, recordId]);

  const examplePrompts = [
    'Analyze smart contract access control and identify possible reentrancy vulnerabilities.',
    'Verify cross-border transaction compliance against privacy and AML regulations.',
    'Audit AI credit-scoring model features for bias and algorithmic transparency.',
  ];

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!address) {
    connect({ connector: 'metaMask' });
    return;
  }

  const promptText = prompt.trim();

  if (!promptText) {
    return;
  }

  setLoading(true);
  setError(null);

  try {
    console.log('Calling /api/ai/generate...', {
      walletAddress: address,
      prompt: promptText,
    });

    const { recordId, proofHash, output } =
      await generateAudit(promptText, address);

    console.log('AI Generate Response:', {
      recordId,
      proofHash,
      output,
    });

    setRecordId(recordId);

    setAuditResult({
      id: recordId,
      proofHash,
      aiResponse: output,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Generate audit failed:', err);

    setError(
      err.response?.data?.error ||
      err.message ||
      'Failed to generate audit.'
    );
  } finally {
    setLoading(false);
  }
};

const handleAnchorOnChain = async () => {
  console.log('recordId before Anchor:', recordId);

  if (!address) {
    alert('Please connect wallet first.');
    return;
  }

  if (!recordId || !auditResult?.proofHash) {
    alert('No proof hash to anchor. Please generate an audit first.');
    return;
  }

  setError(null);

  try {
    await registerProof(auditResult.proofHash);
  } catch (err) {
    console.error('Anchor proof error:', err);

    setError(
      err.message || 'Failed to anchor proof on blockchain.'
    );
  }
};
  const connectMetaMask = () => connect({ connector: 'metaMask' });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const handleCopyHash = async () => {
    if (auditResult?.proofHash) {
      await navigator.clipboard.writeText(auditResult.proofHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span>Create AI Audit Proof</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Submit an AI workflow or policy prompt. ProofHub AI generates a cryptographic proof hash ready for smart contract anchoring.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              AI Prompt / Workflow Specification
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter document, smart contract code snippet, or AI workflow prompt to analyze..."
              rows={4}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 font-sans transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Quick Examples */}
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2 font-mono">
              Quick Prompt Examples:
            </span>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  className="text-xs text-slate-400 hover:text-cyan-300 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-lg px-3 py-1.5 transition-colors text-left"
                >
                  "{ex.slice(0, 45)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection & Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Generating Audit Proof...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Audit & Generate Proof</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <Loading message="Executing AI workflow & computing SHA-256 proof hash..." />}

      {/* Audit Result Display */}
      {auditResult && !loading && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-fade-in space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-mono text-slate-100">AI Audit Proof Generated</h3>
                <span className="text-xs text-slate-400">Audit ID: {auditResult.id}</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              SHA-256 Sealed
            </span>
          </div>

          {/* Audit Result Grid Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500">Audit ID</span>
              <p className="font-mono text-xs font-semibold text-slate-200 mt-1 truncate">{auditResult.id}</p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500">Timestamp</span>
              <p className="font-mono text-xs text-slate-200 mt-1">{formatDate(auditResult.timestamp)}</p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500">Blockchain Status</span>
              <p className="font-mono text-xs text-slate-200 mt-1 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${anchorSuccess || auditResult.status === 'registered' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {anchorSuccess || auditResult.status === 'registered' ? 'Registered On-Chain' : 'Pending Blockchain'}
              </p>
            </div>
          </div>

          {/* Proof Hash Line */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Proof Hash (SHA-256)</span>
              <button
                onClick={handleCopyHash}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash ? 'Copied' : 'Copy Full Hash'}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-cyan-300 break-all select-all bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
              {auditResult.proofHash}
            </p>
          </div>

          {/* AI Output Result Box */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>AI Audit Response Analysis</span>
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {auditResult.aiResponse}
            </div>
          </div>

          {/* Blockchain Anchor Section */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {!isConnected ? (
                <p>Connect Web3 wallet to store this proof hash on the Ethereum blockchain.</p>
              ) : anchorSuccess ? (
                <p className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Proof registered on Smart Contract ProofRegistry!
                </p>
              ) : (
                <p>Ready to store proof hash permanently on ProofRegistry.sol</p>
              )}
            </div>

            {!isConnected ? (
              <button
                onClick={connectMetaMask}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Connect Wallet to Anchor</span>
              </button>
            ) : (
              <button
  type="button"
  onClick={handleAnchorOnChain}
  disabled={walletSubmittingTx || walletConfirmingTx || anchorSuccess}
  className={`
    w-full
    mt-4
    px-5
    py-3
    rounded-xl
    border
    font-semibold
    transition-all
    duration-200
    flex
    items-center
    justify-center
    gap-2
    ${
      anchorSuccess
        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 cursor-default'
        : walletSubmittingTx || walletConfirmingTx
        ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-wait'
        : 'bg-cyan-500/10 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-300 hover:text-cyan-200 cursor-pointer'
    }
  `}
>
  {anchorSuccess ? (
    <>
      <CheckCircle2 size={18} />
      Anchored On-Chain
    </>
  ) : walletSubmittingTx ? (
    <>
      <span className="animate-spin">⟳</span>
      Confirm in Wallet...
    </>
  ) : walletConfirmingTx ? (
    <>
      <span className="animate-spin">⟳</span>
      Mining Transaction...
    </>
  ) : (
    <>
      <Lock size={18} />
      Anchor Proof to Blockchain
    </>
  )}
</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
