import React, { useState, useEffect } from 'react';
import {
  Download,
  Laptop,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  WifiOff,
  Zap,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { showToast } = usePlanner();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [browserType, setBrowserType] = useState<'safari' | 'chrome' | 'other'>('chrome');

  useEffect(() => {
    // Check if running in standalone mode (installed PWA)
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    // Detect browser
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('safari') && !ua.includes('chrome')) {
      setBrowserType('safari');
    } else {
      setBrowserType('chrome');
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('Planner 2027 installed as a native Mac app! 🎉');
        setIsStandalone(true);
        onClose();
      }
      setDeferredPrompt(null);
    } else {
      // In Safari or manual Chrome, instructions are shown in modal
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-lavender-400 p-0.5 shadow-md shadow-brand-500/20">
              <img
                src="/icons/icon.svg"
                alt="2027 Planner App Icon"
                className="w-full h-full rounded-2xl"
              />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Install 2027 Planner on Mac
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  PWA
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Full-screen standalone window, custom blue dock icon & offline access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <Laptop className="w-5 h-5 text-brand-500 mx-auto" />
            <h5 className="font-bold text-[11px] text-slate-900 dark:text-white">Standalone Window</h5>
            <p className="text-[10px] text-slate-500">No browser address bar or tabs clutter</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <WifiOff className="w-5 h-5 text-emerald-500 mx-auto" />
            <h5 className="font-bold text-[11px] text-slate-900 dark:text-white">100% Offline</h5>
            <p className="text-[10px] text-slate-500">Works seamlessly on flights & commutes</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <Zap className="w-5 h-5 text-amber-500 mx-auto" />
            <h5 className="font-bold text-[11px] text-slate-900 dark:text-white">Spotlight & Dock</h5>
            <p className="text-[10px] text-slate-500">Launch via ⌘+Space or click in Dock</p>
          </div>
        </div>

        {/* Status / Instructions */}
        {isStandalone ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Already Running as a Native App!
              </p>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                You are currently enjoying the standalone full-screen window on macOS.
              </p>
            </div>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 space-y-1">
              <p className="text-xs font-bold text-brand-900 dark:text-brand-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-500" />
                One-Click Installation Ready
              </p>
              <p className="text-[11px] text-brand-800 dark:text-brand-300">
                Click the button below to add Planner 2027 directly to your macOS Applications and Launchpad.
              </p>
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install Planner 2027 to Mac Applications
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-brand-500" />
                Mac Installation Steps ({browserType === 'safari' ? 'Apple Safari' : 'Google Chrome / Edge'}):
              </h4>

              {browserType === 'safari' ? (
                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>In Safari menu bar, click <strong>File</strong> at top left.</li>
                  <li>Select <strong>Add to Dock...</strong></li>
                  <li>Click <strong>Add</strong> to pin Planner 2027 with its custom blue icon!</li>
                </ol>
              ) : (
                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Look at the right side of the address/URL bar for the <strong>Install App icon (⊕ or 💻)</strong>.</li>
                  <li>Or open the Chrome menu (⋮) → <strong>Cast, Save & Share</strong> → <strong>Install Planner 2027...</strong></li>
                  <li>Click <strong>Install</strong> to launch it in its dedicated window.</li>
                </ol>
              )}
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Works completely offline. Changes persist automatically via LocalStorage.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
