'use client';
import { useState } from 'react';
import { X, Mail, ShieldCheck, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: { isOpen: boolean; onClose: () => void; defaultTab?: 'signin' | 'signup' }) {
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const disposableDomains = ['tempmail.com', 'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'temp-mail.org'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const atIndex = email.indexOf('@');
    const domain = atIndex > -1 ? email.slice(atIndex + 1).toLowerCase() : '';
    if (disposableDomains.includes(domain)) {
      setErrorMsg('Please use a valid email address.');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
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
          {tab === 'signin' ? 'Enter your email to receive a passwordless magic login link.' : 'Sign up to unlock 1 full commercial project extraction and save your takeoff notes.'}
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
            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-600/30"
            >
              {tab === 'signin' ? 'Send Login Link' : 'Create Account & Unlock Free Scan'}
            </button>
            <p className="text-xs text-center text-slate-500 flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-slate-400" />
              Passwordless security. No credit card required.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
