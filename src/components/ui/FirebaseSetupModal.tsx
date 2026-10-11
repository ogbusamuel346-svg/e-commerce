import React, { useState, useEffect } from 'react';
import {
  Database,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Trash2,
  RefreshCw,
  FolderLock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  FirebaseCustomConfig,
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  clearStoredFirebaseConfig,
} from '../../services/firebaseConfigStore';
import { useToast } from '../../context/ToastContext';

interface FirebaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();

  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [firestoreDatabaseId, setFirestoreDatabaseId] = useState('(default)');

  const [rawSnippet, setRawSnippet] = useState('');
  const [inputMode, setInputMode] = useState<'form' | 'snippet'>('form');
  const [currentConfig, setCurrentConfig] = useState<FirebaseCustomConfig | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'instructions'>('config');

  useEffect(() => {
    const existing = getStoredFirebaseConfig();
    setCurrentConfig(existing);
    if (existing) {
      setApiKey(existing.apiKey || '');
      setAuthDomain(existing.authDomain || '');
      setProjectId(existing.projectId || '');
      setMessagingSenderId(existing.messagingSenderId || '');
      setAppId(existing.appId || '');
      setFirestoreDatabaseId(existing.firestoreDatabaseId || '(default)');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Auto-parse snippet when pasted into the snippet box
  const handleParseSnippet = (snippetText: string) => {
    setRawSnippet(snippetText);
    try {
      // Extract values using regex for common Firebase SDK snippet formats
      const extract = (key: string) => {
        const regex = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]([^'"]+)['"]`, 'i');
        const match = snippetText.match(regex);
        return match ? match[1] : '';
      };

      const extractedApiKey = extract('apiKey');
      const extractedAuthDomain = extract('authDomain');
      const extractedProjectId = extract('projectId');
      const extractedMessagingSenderId = extract('messagingSenderId');
      const extractedAppId = extract('appId');

      if (extractedApiKey && extractedProjectId) {
        setApiKey(extractedApiKey);
        setAuthDomain(extractedAuthDomain);
        setProjectId(extractedProjectId);
        if (extractedMessagingSenderId) setMessagingSenderId(extractedMessagingSenderId);
        if (extractedAppId) setAppId(extractedAppId);

        showToast('Successfully parsed Firebase config snippet!', 'success');
        setInputMode('form');
      }
    } catch {
      // not critical
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim() || !projectId.trim() || !appId.trim()) {
      showToast('API Key, Project ID, and App ID are required.', 'warning');
      return;
    }

    const newConfig: FirebaseCustomConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
      firestoreDatabaseId: firestoreDatabaseId.trim() || '(default)',
    };

    saveStoredFirebaseConfig(newConfig);
    setCurrentConfig(newConfig);
    showToast('Firebase credentials saved successfully! Store connected.', 'success');
  };

  const handleReset = () => {
    clearStoredFirebaseConfig();
    setCurrentConfig(null);
    setApiKey('');
    setAuthDomain('');
    setProjectId('');
    setMessagingSenderId('');
    setAppId('');
    setFirestoreDatabaseId('(default)');
    setRawSnippet('');
    showToast('Firebase credentials reset to default environment.', 'info');
  };

  const sampleEnvConfig = `VITE_FIREBASE_API_KEY="${apiKey || 'AIzaSy...'}"
VITE_FIREBASE_AUTH_DOMAIN="${authDomain || (projectId ? `${projectId}.firebaseapp.com` : 'your-app.firebaseapp.com')}"
VITE_FIREBASE_PROJECT_ID="${projectId || 'your-project-id'}"
VITE_FIREBASE_MESSAGING_SENDER_ID="${messagingSenderId || '1234567890'}"
VITE_FIREBASE_APP_ID="${appId || '1:1234567890:web:abcdef123456'}"`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
              <Database className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Firebase Credentials Setup</h2>
                {currentConfig ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Connected
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    Not configured
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Connect your Firestore database & Authentication directly to NovaMobile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Enter Credentials</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'instructions'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Where to Find Credentials</span>
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {activeTab === 'instructions' ? (
            <div className="space-y-4 text-slate-300">
              <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-blue-300 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>How to get your Firebase Credentials</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed text-xs">
                  <li>
                    Go to the{' '}
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline font-semibold hover:text-blue-300 inline-flex items-center gap-1"
                    >
                      Firebase Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Select your Firebase project (or click <strong>&quot;Add project&quot;</strong> to make a free one).</li>
                  <li>
                    Click the <strong>Settings Gear ⚙️</strong> in the top left &gt; <strong>Project settings</strong>.
                  </li>
                  <li>
                    Scroll down to <strong>&quot;Your apps&quot;</strong> and select your <strong>Web app (&lt;/&gt;)</strong>.
                  </li>
                  <li>
                    Under <strong>&quot;SDK setup and configuration&quot;</strong>, choose <strong>Config</strong>.
                  </li>
                  <li>
                    Copy the <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">firebaseConfig</code> object
                    and paste it into the <em>&quot;Quick Snippet Paste&quot;</em> tab here, or fill out the fields manually!
                  </li>
                </ol>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <FolderLock className="w-4 h-4 text-amber-400" />
                  <span>Firestore &amp; Auth Services to Enable in Firebase:</span>
                </h4>
                <ul className="space-y-1.5 text-slate-400 text-[11px]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span><strong>Authentication:</strong> Enable Email/Password or Google provider in Auth &gt; Sign-in method.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span><strong>Cloud Firestore:</strong> Create database (Production or Test mode) under Build &gt; Firestore Database.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Toggle Form / Snippet */}
              <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium px-2">Input Mode:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setInputMode('form')}
                    className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                      inputMode === 'form'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Form Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('snippet')}
                    className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                      inputMode === 'snippet'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Quick Snippet Paste
                  </button>
                </div>
              </div>

              {inputMode === 'snippet' ? (
                <div className="space-y-3">
                  <p className="text-slate-400 text-xs">
                    Paste your entire <code className="text-amber-400">firebaseConfig = &#123; ... &#125;</code> code block directly from the Firebase console:
                  </p>
                  <textarea
                    rows={6}
                    value={rawSnippet}
                    onChange={(e) => handleParseSnippet(e.target.value)}
                    placeholder={`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};`}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleParseSnippet(rawSnippet)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Auto-Extract Fields
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        API Key (apiKey) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Project ID (projectId) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={projectId}
                        onChange={(e) => {
                          setProjectId(e.target.value);
                          if (!authDomain) setAuthDomain(`${e.target.value}.firebaseapp.com`);
                        }}
                        placeholder="my-cool-store-123"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Auth Domain (authDomain)
                      </label>
                      <input
                        type="text"
                        value={authDomain}
                        onChange={(e) => setAuthDomain(e.target.value)}
                        placeholder="my-cool-store-123.firebaseapp.com"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        App ID (appId) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        placeholder="1:700826874787:web:483d..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Messaging Sender ID (messagingSenderId)
                      </label>
                      <input
                        type="text"
                        value={messagingSenderId}
                        onChange={(e) => setMessagingSenderId(e.target.value)}
                        placeholder="700826874787"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Firestore Database ID
                      </label>
                      <input
                        type="text"
                        value={firestoreDatabaseId}
                        onChange={(e) => setFirestoreDatabaseId(e.target.value)}
                        placeholder="(default)"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-[10px] text-slate-500">Usually &apos;(default)&apos; unless specified</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    {currentConfig ? (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear Credentials</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-semibold cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save &amp; Connect Firebase</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Ready-to-copy .env template */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Environment Variables (.env format)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(sampleEnvConfig)}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{isCopied ? 'Copied!' : 'Copy .env'}</span>
                  </button>
                </div>
                <pre className="p-2.5 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre">
                  {sampleEnvConfig}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
