import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Trash2,
  RefreshCw,
  Sparkles,
  Info,
  FolderOpen,
  ArrowRight,
  Zap,
} from 'lucide-react';
import {
  CloudinaryConfig,
  getStoredCloudinaryConfig,
  saveStoredCloudinaryConfig,
  clearStoredCloudinaryConfig,
  uploadToCloudinary,
} from '../../services/cloudinaryService';
import { useToast } from '../../context/ToastContext';

interface CloudinarySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const CloudinarySetupModal: React.FC<CloudinarySetupModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const { showToast } = useToast();

  const [cloudName, setCloudName] = useState('');
  const [uploadPreset, setUploadPreset] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [folder, setFolder] = useState('novamobile_products');

  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    url?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'form' | 'guide' | 'env'>('form');

  useEffect(() => {
    if (isOpen) {
      const cfg = getStoredCloudinaryConfig();
      setCloudName(cfg.cloudName || '');
      setUploadPreset(cfg.uploadPreset || '');
      setApiKey(cfg.apiKey || '');
      setFolder(cfg.folder || 'novamobile_products');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudName.trim()) {
      showToast('Please enter your Cloudinary Cloud Name', 'error');
      return;
    }
    if (!uploadPreset.trim()) {
      showToast('Please enter your Cloudinary Upload Preset (Unsigned)', 'error');
      return;
    }

    const config: CloudinaryConfig = {
      cloudName: cloudName.trim(),
      uploadPreset: uploadPreset.trim(),
      apiKey: apiKey.trim() || undefined,
      folder: folder.trim() || 'novamobile_products',
    };

    saveStoredCloudinaryConfig(config);
    showToast('Cloudinary storage credentials saved successfully!', 'success');
    onSaved?.();
    onClose();
  };

  const handleTestConnection = async () => {
    if (!cloudName.trim() || !uploadPreset.trim()) {
      showToast('Please fill in both Cloud Name and Upload Preset before testing', 'error');
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    // Save temporarily to test
    saveStoredCloudinaryConfig({
      cloudName: cloudName.trim(),
      uploadPreset: uploadPreset.trim(),
      apiKey: apiKey.trim() || undefined,
      folder: folder.trim() || 'novamobile_products',
    });

    try {
      // Create a tiny 1x1 transparent PNG in base64 to test unsigned upload
      const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAAElFTkSuQmCC';
      const result = await uploadToCloudinary(testPixel, {
        folder: `${folder.trim() || 'novamobile'}/connection_test`,
        tags: 'test_connection,novamobile',
      });

      setTestResult({
        success: true,
        message: `Connected successfully! Storage asset created at ${result.secureUrl}`,
        url: result.secureUrl,
      });
      showToast('Cloudinary connection test passed!', 'success');
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed. Verify that your Upload Preset is set to "Unsigned" in Cloudinary settings.',
      });
      showToast('Cloudinary test failed', 'error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleClear = () => {
    clearStoredCloudinaryConfig();
    setCloudName('');
    setUploadPreset('');
    setApiKey('');
    setFolder('novamobile_products');
    setTestResult(null);
    showToast('Cloudinary credentials reset', 'info');
    onSaved?.();
  };

  const envSnippet = `# Cloudinary Storage Configuration
VITE_CLOUDINARY_CLOUD_NAME="${cloudName || 'your_cloud_name'}"
VITE_CLOUDINARY_UPLOAD_PRESET="${uploadPreset || 'your_unsigned_preset'}"
VITE_CLOUDINARY_API_KEY="${apiKey || 'your_api_key'}"
VITE_CLOUDINARY_FOLDER="${folder || 'novamobile_products'}"`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSnippet);
    showToast('Copied .env format to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shadow-inner">
              <Cloud className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Cloudinary Cloud Storage Setup
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  CDN &amp; Storage
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload, optimize, and serve smartphone images directly via Cloudinary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'bg-slate-800 text-white border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Credentials Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-white border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Setup Guide (3 Steps)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('env')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'env'
                ? 'bg-slate-800 text-white border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            .env Format
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {activeTab === 'form' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3.5 bg-blue-950/30 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-relaxed text-[11px]">
                  <strong>Unsigned Upload Preset Required:</strong> For secure client-side uploads directly from the browser without exposing private API secrets, Cloudinary requires an <em>Unsigned</em> upload preset.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-200">
                    Cloud Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cloudName}
                    onChange={(e) => setCloudName(e.target.value)}
                    placeholder="e.g. dxyz1234 or your-company"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Found on your Cloudinary Dashboard under "Cloud name".
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-200">
                    Upload Preset (Unsigned) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadPreset}
                    onChange={(e) => setUploadPreset(e.target.value)}
                    placeholder="e.g. novamobile_uploads"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Settings → Upload → Upload Presets → Add preset (Signing mode: Unsigned).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-200">
                    Target Folder <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    placeholder="novamobile_products"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Directory inside Cloudinary Media Library for storing smartphone images.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-200">
                    API Key <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="e.g. 192837465019283"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Optional reference for admin management.
                  </p>
                </div>
              </div>

              {/* Test Connection Banner */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                    testResult.success
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs">
                    <p className="font-bold">
                      {testResult.success ? 'Connection Verified!' : 'Connection Error'}
                    </p>
                    <p className="text-[11px] leading-relaxed opacity-90">{testResult.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection || !cloudName.trim() || !uploadPreset.trim()}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    {testingConnection ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{testingConnection ? 'Testing Upload...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                    title="Clear saved Cloudinary credentials"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-slate-400 hover:text-white font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
                  >
                    Save Cloudinary Storage
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-slate-300">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>How to configure Cloudinary in 3 easy steps</span>
                </h4>

                <ol className="space-y-3 list-decimal list-inside text-xs leading-relaxed text-slate-300">
                  <li className="pl-1">
                    <strong className="text-white">Create a free Cloudinary account</strong> at{' '}
                    <a
                      href="https://cloudinary.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      cloudinary.com <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    (includes 25GB free monthly bandwidth and generous media storage).
                  </li>
                  <li className="pl-1">
                    <strong className="text-white">Copy your Cloud Name:</strong> In your Cloudinary Console dashboard, your Cloud name is displayed in the Product Environment block at top left.
                  </li>
                  <li className="pl-1">
                    <strong className="text-white">Create an Unsigned Upload Preset:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1.5 space-y-1 text-slate-400">
                      <li>Go to <strong>Settings (Gear Icon) → Upload</strong></li>
                      <li>Scroll down to <strong>Upload presets</strong> and click <strong>Add upload preset</strong></li>
                      <li>Change <strong>Signing Mode</strong> from <em>Signed</em> to <strong className="text-emerald-400">Unsigned</strong></li>
                      <li>(Optional) Set folder name to <code className="text-blue-300">novamobile_products</code></li>
                      <li>Click <strong>Save</strong> and copy the generated Preset Name (e.g. <code className="text-amber-300">ml_default</code> or <code className="text-amber-300">novamobile_preset</code>)</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div className="p-3.5 bg-blue-950/30 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-xs">Ready to enter your credentials?</p>
                  <p className="text-[11px] text-slate-400">Switch to the Credentials Form tab to paste your details.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Go to Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  You can also configure these in your <code className="text-blue-400">.env</code> file:
                </p>
                <button
                  type="button"
                  onClick={copyEnv}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
                {envSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Credentials stored locally in browser session &amp; client storage</span>
          </div>
          <a
            href="https://console.cloudinary.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
          >
            <span>Cloudinary Console</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
