import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet.js';
import { formatAddress } from '../utils/format.js';
import { Wallet, LogOut, AlertTriangle, ChevronDown, CheckCircle2, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/format.js';

export default function WalletConnect() {
  const {
    address,
    isConnected,
    isConnecting,
    isWrongNetwork,
    targetChainId,
    connectMetaMask,
    disconnect,
    switchNetwork,
    walletError,
    clearWalletError
  } = useWallet();

  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (address) {
      await copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      {walletError && (
        <div className="absolute top-12 right-0 z-50 w-72 bg-red-950/90 text-red-200 border border-red-800 rounded-lg p-3 text-xs shadow-xl backdrop-blur-md flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold mb-1">Wallet Warning</p>
            <p>{walletError}</p>
            <button
              onClick={clearWalletError}
              className="mt-2 text-red-400 hover:text-red-200 underline font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {!isConnected ? (
        <button
          onClick={connectMetaMask}
          disabled={isConnecting}
          className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-cyan-950/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Wallet className="w-4 h-4" />
          <span>{isConnecting ? 'Connecting Wallet...' : 'Connect Wallet'}</span>
        </button>
      ) : isWrongNetwork ? (
        <button
          onClick={switchNetwork}
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium text-xs rounded-lg transition-all cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Switch to Chain #{targetChainId}</span>
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 rounded-lg text-slate-200 text-sm font-mono shadow-sm transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>{formatAddress(address)}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <p className="text-slate-400 font-sans text-[11px] uppercase tracking-wider mb-1">Connected Account</p>
                <p className="font-mono text-slate-200 truncate">{address}</p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-between px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Address</span>
                </span>
                {copied && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-950/40 hover:text-red-300 rounded-md transition-colors mt-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
