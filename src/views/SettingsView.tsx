import React, { useState, useRef, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  RotateCcw,
  User,
  Sparkles,
  Save,
  CheckCircle,
  AlertTriangle,
  X,
  ShieldAlert,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { PWAInstallModal } from '../components/PWAInstallModal';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    resetData,
    showToast,
  } = usePlanner();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState(settings.userName);
  const [userQuote, setUserQuote] = useState(settings.userQuote);
  const [dailyFocus, setDailyFocus] = useState(settings.dailyFocus);
  const [currency, setCurrency] = useState(settings.currency);
  const [theme, setTheme] = useState(settings.theme);

  // Confirmation modal state for reset
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standaloneCheck =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standaloneCheck);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName: userName.trim() || 'Vishnu',
      userQuote: userQuote.trim(),
      dailyFocus: dailyFocus.trim(),
      currency,
      theme,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmReset = () => {
    resetData();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              Planner Preferences & Data Management
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Personalize your dashboard, manage dark mode, backup or restore your 2027 data.
            </p>
          </div>
        </div>
      </div>

      {/* Profile & Identity Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Personal Profile & Mantras
            </h3>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Vishnu"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="₹">₹ Indian Rupee (INR)</option>
                <option value="$">$ US Dollar (USD)</option>
                <option value="€">€ Euro (EUR)</option>
                <option value="£">£ British Pound (GBP)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Personal 2027 Mantra / Motivational Quote
            </label>
            <input
              type="text"
              value={userQuote}
              onChange={(e) => setUserQuote(e.target.value)}
              placeholder="e.g. Make 2027 your masterpiece of consistency, focus, and joy."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Default Daily North Star Focus
            </label>
            <textarea
              rows={2}
              value={dailyFocus}
              onChange={(e) => setDailyFocus(e.target.value)}
              placeholder="Primary intention or high-leverage work focus..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Appearance & Theme Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Sun className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Interface Theme & Appearance
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Choose your preferred aesthetic style for MacBook desktop and mobile use.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'dark', label: 'Dark Navy Mode', icon: Moon },
            { id: 'system', label: 'System Theme', icon: Laptop },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = settings.theme === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateSettings({ theme: mode.id as any })}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-brand-50/70 dark:bg-navy-800 border-brand-500 text-brand-600 dark:text-brand-300 ring-2 ring-brand-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MacBook PWA Installation & Offline Experience */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              MacBook Native PWA Experience
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
            Offline Enabled
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-brand-50/70 to-pastel-ice dark:from-navy-850 dark:to-navy-800 border border-brand-100 dark:border-slate-700">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-navy-900 p-0.5 shadow-md shadow-brand-500/20 shrink-0">
              <img
                src="/icons/icon.svg"
                alt="2027 Planner App Icon"
                className="w-full h-full rounded-2xl"
              />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isStandalone ? 'Installed as Native Mac App' : 'Install Planner 2027 to Mac'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isStandalone
                  ? 'Active in standalone full-screen window with custom blue Dock icon.'
                  : 'Add to macOS Dock, Applications & Launchpad with full offline access.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPWAInstallOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 shrink-0 flex items-center gap-2"
          >
            {isStandalone ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> App Info & Tips
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Install as Mac App
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Service Worker caching enables full offline usage on flights.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Fast launchable from macOS Spotlight (⌘ + Space).</span>
          </div>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Download className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Backup & Data Portability
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Your data is persistently saved in your browser&apos;s LocalStorage. You can export a JSON backup at any time or restore from an existing file.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Button */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-500" />
              Download JSON Backup
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Exports all your tasks, events, goals, vision board, finance, and journal records.
            </p>
            <button
              type="button"
              onClick={exportData}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Export Planner Backup (.json)
            </button>
          </div>

          {/* Import Button */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-500" />
              Restore from Backup
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Upload a previously exported 2027 planner JSON backup file to restore.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Upload & Restore (.json)
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Planner */}
      <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-red-950/20 border border-rose-200 dark:border-red-900/40 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="font-bold text-base text-red-950 dark:text-red-200">
            Reset Planner
          </h3>
        </div>

        <p className="text-xs text-red-800 dark:text-red-300">
          Restore the digital planner back to the pristine initial state with standard sample goals, habits, and Indian holidays.
        </p>

        <button
          type="button"
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" /> Reset Planner to Default
        </button>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Reset 2027 Planner?
                </h3>
                <p className="text-xs text-slate-500">This action requires confirmation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to reset all planner state? Any custom tasks, journal entries, or transactions you added will be reverted to the initial sample template.
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
      />
    </div>
  );
};
