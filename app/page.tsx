'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, FileSpreadsheet, Clock, Lock, Users } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
      }
    });
  }, []);

  const getStripeUrl = (baseUrl: string) => {
    const params = new URLSearchParams();
    if (currentUser?.id) params.set('client_reference_id', currentUser.id);
    if (currentUser?.email) params.set('prefilled_email', currentUser.email);
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="w-full max-w-6xl mx-auto flex justify-between items-center py-6 px-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-xl tracking-tight">SpecScope<span className="text-blue-500">.AI</span></span>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition">Dashboard</Link>
          ) : (
            <button 
              onClick={() => { setAuthTab('signin'); setShowAuth(true); }}
              className="text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
          )}
          <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-lg shadow-blue-500/20">Launch Estimator</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto py-20 px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-950/60 border border-blue-800/60 rounded-full text-blue-400 text-xs font-semibold mb-6">
          <ShieldCheck className="h-4 w-4" />
          <span>Built for Commercial HVAC, Electrical, Plumbing & Roofing Trades</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Turn 200-Page Spec Books Into <span className="text-blue-500">Biddable Scopes</span> in 60 Seconds
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl">
          Stop losing weekends to manual PDF reviews. Automatically extract trade-specific scope checklists, mandatory exclusions, and liquidated damage penalties ready for Excel takeoff.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/25">
            <span>Try Free (Interactive Demo Included)</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Data Privacy & Enterprise Guarantee Badges */}
      <section className="w-full max-w-5xl mx-auto py-6 px-6">
        <div className="grid sm:grid-cols-3 gap-4 p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-center text-xs">
          <div className="flex items-center justify-center space-x-2 text-slate-300">
            <Lock className="h-4 w-4 text-blue-400" />
            <span><strong>Zero Model Training:</strong> Your plans remain 100% private</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-slate-300">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span><strong>Encrypted:</strong> 256-bit TLS in transit and at rest</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-slate-300">
            <FileSpreadsheet className="h-4 w-4 text-blue-400" />
            <span><strong>CSI MasterFormat:</strong> Divisions 01–48 compatible</span>
          </div>
        </div>
      </section>

      {/* ROI Features */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Clock className="h-8 w-8 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white">Save 10+ Hours Per Bid</h3>
          <p className="mt-2 text-slate-400 text-sm">Instantly parse CSI MasterFormat divisions and isolate work items without combing through boilerplate general conditions.</p>
        </div>
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <ShieldCheck className="h-8 w-8 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white">Zero Missed Exclusions</h3>
          <p className="mt-2 text-slate-400 text-sm">Catch hidden contractor obligations, mandatory mockups, and warranty extensions before submitting your lump-sum price.</p>
        </div>
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <FileSpreadsheet className="h-8 w-8 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white">1-Click Excel / CSV Export</h3>
          <p className="mt-2 text-slate-400 text-sm">Export clean, structured line items directly into your existing estimating and bid spreadsheet templates.</p>
        </div>
      </section>

      {/* 4-Tier Pricing Grid */}
      <section className="w-full max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Straightforward Pricing for Active Estimators</h2>
        <p className="text-slate-400 text-center text-sm mb-12 max-w-xl mx-auto">Choose a flexible monthly solo license or scale with your team.</p>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Free Pilot */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-300">Free Pilot</h3>
              <div className="mt-3 text-3xl font-extrabold text-white">$0</div>
              <p className="text-xs text-slate-500 mt-1">No credit card required</p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500 mr-2" /> Unlimited Sample Demos</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500 mr-2" /> 1 Full Project Spec Scan</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500 mr-2" /> Scope & Exclusion Tables</li>
              </ul>
            </div>
            <Link href="/dashboard" className="mt-6 block text-center py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition">Get Started Free</Link>
          </div>

          {/* Solo Estimator Monthly */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-300">Solo Estimator</h3>
              <div className="mt-3 text-3xl font-extrabold text-white">$69<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-500 mt-1">1 Estimator Seat</p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mr-2" /> Unlimited Project Spec Scans</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mr-2" /> All CSI MasterFormat Divisions</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mr-2" /> Liquidated Damages Radar</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mr-2" /> Uncapped Excel Exports</li>
              </ul>
            </div>
            <a href={getStripeUrl("https://buy.stripe.com/14AaEW6dXbEff2H87K28800")} className="mt-6 block text-center py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition border border-slate-700">Start Solo Monthly</a>
          </div>

          {/* Solo Annual Pass */}
          <div className="p-6 bg-blue-950/40 border-2 border-blue-500 rounded-2xl flex flex-col justify-between relative shadow-2xl shadow-blue-500/10">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-blue-500 text-slate-950 text-[10px] font-bold rounded-full">POPULAR</div>
            <div>
              <h3 className="text-base font-bold text-blue-300">Solo Annual</h3>
              <div className="mt-3 text-3xl font-extrabold text-white">$499<span className="text-xs font-normal text-slate-400">/yr</span></div>
              <p className="text-xs text-slate-500 mt-1">1 Seat (Save 40%)</p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mr-2" /> Unlimited Full Year Access</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mr-2" /> All CSI MasterFormat Divisions</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mr-2" /> Liquidated Damages Radar</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mr-2" /> Uncapped Excel / CSV Exports</li>
              </ul>
            </div>
            <a href={getStripeUrl("https://buy.stripe.com/14A5kC6dX37Jf2H73G28802")} className="mt-6 block text-center py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition shadow-lg shadow-blue-600/30">Get Annual Pass</a>
          </div>

          {/* Team License */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-purple-300">Team Plan</h3>
              <div className="mt-3 text-3xl font-extrabold text-white">$149<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-500 mt-1">3 Estimator Seats</p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400 mr-2" /> 3 Multi-User Estimator Seats</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400 mr-2" /> Unlimited Project Spec Scans</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400 mr-2" /> All CSI MasterFormat Divisions</li>
                <li className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400 mr-2" /> Centralized Team Seat Invites</li>
              </ul>
            </div>
            <a href={getStripeUrl("https://buy.stripe.com/aFa7sK6dX6jV2fVgEg28801")} className="mt-6 block text-center py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition shadow-lg shadow-purple-600/30">Start Team Plan</a>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />
    </div>
  );
}
