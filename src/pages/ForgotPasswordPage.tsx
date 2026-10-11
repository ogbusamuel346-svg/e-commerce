import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight, KeyRound, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resetCompleted, setResetCompleted] = useState(false);

  const { resetPassword } = useAuth();

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
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message || 'Unable to find an account with that email address.',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Smartphone className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Password Recovery
          </h1>
          <p className="text-xs text-slate-500">
            Enter your account email to receive a secure password reset link
          </p>
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
                A password reset link was dispatched to <strong className="text-slate-800 font-semibold">{email}</strong>. Open the link to set your new password.
              </p>
              <p className="text-[11px] text-slate-400">
                Please check your junk or spam folder if the email does not appear shortly.
              </p>
            </div>

            <Link
              to="/login"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
                We will dispatch an official password reset authorization link to this email address.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/login"
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors text-center"
              >
                Cancel
              </Link>
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

        <div className="pt-2 text-center text-xs text-slate-500">
          <span>Remember your password? </span>
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
