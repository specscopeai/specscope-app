'use client';
import { useState } from 'react';
import { X, Mail, ShieldCheck, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: { isOpen: boolean; onClose: () => void; defaultTab?: 'signin' | 'signup' }) {
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);

  if (!isOpen) return null;

  const disposableDomains = ['tempmail.com', 'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'temp-mail.org'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (tab === 'signup' && !agreedToTerms) {
      setErrorMsg('You must agree to the Terms of Service and Estimating Disclaimer.');
      return;
    }

    const atIndex = email.indexOf('@');
    const domain = atIndex > -1 ? email.slice(atIndex + 1).toLowerCase() : '';
    if (disposableDomains.includes(domain)) {
      setErrorMsg('Please use a valid company or personal email address.');
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-800 mb-6">
            <button 
              onClick={() => { setTab('signin'); setSubmitted(false); setErrorMsg(''); }}
              className={`pb-3 font-semibold text-sm mr-6 transition ${tab === 'signin' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setTab('signup'); setSubmitted(false); setErrorMsg(''); }}
              className={`pb-3 font-semibold text-sm transition ${tab === 'signup' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <div className="w-10 h-10 bg-blue-950 border border-blue-800 rounded-xl flex items-center justify-center text-blue-400 mb-4">
            <Mail className="h-5 w-5" />
          </div>

          <h3 className="text-xl font-bold text-white">
            {tab === 'signin' ? 'Sign In to SpecScope' : 'Create Estimator Account'}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {tab === 'signin' 
              ? 'Enter your email to receive a passwordless magic login link.' 
              : 'Sign up with your email to unlock 1 full commercial project extraction.'}
          </p>

          {submitted ? (
            <div className="mt-6 p-4 bg-blue-950/50 border border-blue-800 rounded-xl text-center">
              <CheckCircle className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Magic Login Link Sent!</p>
              <p className="text-xs text-slate-400 mt-1">Check your inbox at <span className="text-blue-300">{email}</span> to log in instantly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Clickwrap Agreement Checkbox */}
              {tab === 'signup' && (
                <div className="flex items-start space-x-2 pt-1">
                  <input 
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-400 leading-tight">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                      className="text-blue-400 underline font-semibold hover:text-blue-300 inline-block"
                    >
                      Terms of Service
                    </button>{' '}
                    and acknowledge that SpecScope AI is an estimating productivity aid subject to our{' '}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setShowLiabilityModal(true); }}
                      className="text-blue-400 underline font-semibold hover:text-blue-300 inline-block"
                    >
                      Limitation of Liability Agreement
                    </button>.
                  </label>
                </div>
              )}

              {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-600/30"
              >
                {isLoading ? 'Sending Link...' : (tab === 'signin' ? 'Send Magic Login Link' : 'Create Account & Unlock Free Scan')}
              </button>
              <p className="text-xs text-center text-slate-500 flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-slate-400" />
                Passwordless security. No credit card required.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Terms Viewer Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto relative shadow-2xl text-slate-300 space-y-4">
            <button type="button" onClick={() => setShowTermsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            <h3 className="text-xl font-bold text-white">Terms of Service & Estimating Agreement</h3>
            <p className="text-xs text-slate-400">Effective: August 2026</p>
            <div className="space-y-3 text-xs leading-relaxed">
              <p><strong>1. Scope of Service:</strong> SpecScope AI provides automated parsing of construction specification documents to assist contractors in preparing estimates. The software provides informational checklists and summary tables.</p>
              <p><strong>2. Contractor Responsibility & Limitation of Liability:</strong> Under no circumstances shall SpecScope AI or its operators be liable for missed scope items, bidding errors, liquidated damages, lost profits, or contractual disputes resulting from reliance on the software. The contractor retains 100% legal responsibility for validating all architectural plans, specification manuals, addenda, and final bid submissions.</p>
              <p><strong>3. Subscription & Cancellation:</strong> Subscriptions are billed monthly or annually and may be canceled at any time via the customer billing portal.</p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                type="button" 
                onClick={() => { setShowTermsModal(false); setAgreedToTerms(true); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limitation of Liability Viewer Modal */}
      {showLiabilityModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto relative shadow-2xl text-slate-300 space-y-4">
            <button type="button" onClick={() => setShowLiabilityModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            <h3 className="text-xl font-bold text-white">Limitation of Liability Agreement</h3>
            <p className="text-xs text-slate-400">Effective: August 2026</p>
            <div className="space-y-3 text-xs leading-relaxed">
              <p><strong>1. Estimating Tool Nature:</strong> SpecScope AI is designed solely as an estimating productivity and drafting assistance tool. Output summaries, scope checklists, and exclusion tables are generated automatically to assist contractor review.</p>
              <p><strong>2. Zero Liability for Bid Errors:</strong> Under no circumstances shall SpecScope AI, its developers, or parent company be held liable for missed scope items, pricing inaccuracies, bidding oversights, unassigned contract specifications, liquidated damages, or project cost overruns.</p>
              <p><strong>3. Mandatory Independent Review:</strong> Subcontractors and estimating teams must independently review, verify, and audit all official project manuals, contract specifications, architectural drawings, and addenda before submitting binding bids or lump-sum proposals.</p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                type="button" 
                onClick={() => { setShowLiabilityModal(false); setAgreedToTerms(true); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
