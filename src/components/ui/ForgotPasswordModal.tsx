import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, KeyRound, AlertCircle, RefreshCw } from 'lucide-react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  onSuccessReset?: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  onSuccessReset,
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resetCompleted, setResetCompleted] = useState(false);

  const { resetPassword } = useAuth();

  // Synchronize defaultEmail if modal opens
  React.useEffect(() => {
    if (defaultEmail && !email) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail, isOpen]);

  const handleResetForm = () => {
    setStatusMessage(null);
    setResetCompleted(false);
    setIsLoading(false);
  };

  const handleModalClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your account email address.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const res = await resetPassword(email);
    setIsLoading(false);

    if (res.success) {
      setResetCompleted(true);
      setStatusMessage({
        type: 'success',
        text: res.message || 'Password reset link sent! Please check your email inbox and spam folder.',
      });
      if (onSuccessReset) {
        onSuccessReset(email);
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message || 'Unable to find an account with that email address.',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Password Recovery" maxWidth="md">
      <div className="p-6 space-y-5">
        {/* Header Icon & Intro */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reset Your NovaMobile Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your account email below to receive a secure password reset link.
            </p>
          </div>
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-semibold block">
                {statusMessage.type === 'success' ? 'Link Dispatched' : 'Notice'}
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed">{statusMessage.text}</p>
            </div>
          </div>
        )}

        {/* Success / Finished Screen */}
        {resetCompleted ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Check Your Inbox</h4>
              <p className="text-xs text-slate-600">
                A password reset link was dispatched to <strong className="text-slate-800 font-semibold">{email}</strong>. Open the link in your email to choose a new password.
              </p>

              <div className="text-left bg-white border border-slate-200/80 rounded-lg p-3 space-y-1.5 text-[11px] text-slate-600 mt-2">
                <span className="font-semibold text-slate-800 block text-xs">Didn&apos;t receive the email?</span>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li>Check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folder (sent from <span className="font-mono text-[10px] text-slate-700">noreply@gen-lang-client-0267437691.firebaseapp.com</span>).</li>
                  <li><strong>Account exists check:</strong> For privacy protection, a success notice is shown even if the email has not yet been registered. Ensure this address was registered on NovaMobile.</li>
                  <li>Delivery can occasionally take 1–3 minutes depending on your email provider.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Email Reset Link Form */
          <form onSubmit={handleSendResetEmail} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Account Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                We will dispatch a secure password reset link to this email address.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
