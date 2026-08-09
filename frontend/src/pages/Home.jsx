import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet.js';
import { Shield, ArrowRight, Cpu, Lock, CheckCircle2, FileCheck, Database, Layers } from 'lucide-react';

export default function Home() {
  const { isConnected, connectMetaMask } = useWallet();
  const navigate = useNavigate();

  const handleStartAudit = () => {
    navigate('/create');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono mb-8 shadow-inner">
          <Shield className="w-3.5 h-3.5" />
          <span>Verifiable AI Infrastructure & Protocol</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 font-mono mb-6">
          ProofHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl font-semibold text-slate-300 max-w-3xl mx-auto mb-4 tracking-tight font-sans">
          Don't Trust AI. Verify Every Decision.
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          ProofHub AI creates verifiable audit proofs for AI workflows by combining AI transparency with blockchain verification.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          {!isConnected ? (
            <button
              onClick={connectMetaMask}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Go to Dashboard</span>
            </Link>
          )}

          <button
            onClick={handleStartAudit}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-slate-800 hover:border-cyan-800/80 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Start Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Architecture Workflow Flowchart */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Protocol Architecture</h2>
            <p className="text-2xl font-bold text-slate-100 font-mono">How Verifiable AI Audits Work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4 font-mono font-bold">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">AI Workflow Request</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit raw document inputs, prompts, or smart contract rules to the AI audit pipeline.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-4 font-mono font-bold">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">Audit Proof Generation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The audit engine processes the AI output and calculates a unique cryptographic SHA-256 proof hash.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mb-4 font-mono font-bold">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">On-Chain Registration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anchor the proof hash onto the Ethereum smart contract (<code className="text-cyan-300">ProofRegistry.sol</code>).
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold">
                04
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">Immutable Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anyone can independently query and verify that AI decision integrity remains untampered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Verification Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex items-start gap-4">
            <Cpu className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">Transparent AI Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every AI prompt, decision path, and risk assessment parameter is indexed with complete metadata.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex items-start gap-4">
            <Database className="w-8 h-8 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">Decentralized Proof Anchor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Proof hashes are written to Ethereum smart contracts, making compliance records permanent and tamper-proof.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex items-start gap-4">
            <FileCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">Instant Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verify any audit ID or hash instantly with zero reliance on centralized third-party trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ProofHub AI — Verifiable AI Audit Infrastructure.</p>
      </footer>
    </div>
  );
}
