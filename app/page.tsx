import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, FileSpreadsheet, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center">
      <nav className="w-full max-w-6xl flex justify-between items-center py-6 px-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-xl tracking-tight">SpecScope<span className="text-blue-500">.AI</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition">Sign In</Link>
          <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-lg shadow-blue-500/20">Launch Estimator</Link>
        </div>
      </nav>

      <section className="w-full max-w-5xl py-20 px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-950/60 border border-blue-800/60 rounded-full text-blue-400 text-xs font-semibold mb-6">
          <ShieldCheck className="h-4 w-4" />
          <span>Built for Commercial HVAC, Electrical, Plumbing & Roofing Trades</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Turn 200-Page Spec Books Into <span className="text-blue-500">Biddable Scopes</span> in 60 Seconds
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl">
          Stop losing weekends to PDF manual reviews. Automatically extract trade-specific scope checklists, mandatory exclusions, and liquidated damage penalties ready for Excel takeoff.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/25">
            <span>Try SpecScope Free (3 Scans Included)</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="w-full max-w-6xl py-16 px-6 grid md:grid-cols-3 gap-8">
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

      <section className="w-full max-w-5xl py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Straightforward Pricing for Active Estimators</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-300">Free Pilot</h3>
              <div className="mt-4 text-4xl font-extrabold text-white">$0</div>
              <p className="text-xs text-slate-500 mt-1">No credit card required</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 3 Full Spec Book Scans</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> Scope & Exclusion Tables</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> CSV Data Export</li>
              </ul>
            </div>
            <Link href="/dashboard" className="mt-8 block text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition">Get Started</Link>
          </div>

          <div className="p-8 bg-blue-950/40 border-2 border-blue-500 rounded-2xl flex flex-col justify-between relative shadow-2xl shadow-blue-500/10">
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-blue-500 text-slate-950 text-xs font-bold rounded-full">POPULAR</div>
            <div>
              <h3 className="text-lg font-bold text-blue-300">Solo Estimator</h3>
              <div className="mt-4 text-4xl font-extrabold text-white">$69<span className="text-base font-normal text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-500 mt-1">Billed monthly</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-400 mr-2" /> Unlimited Spec Book Scans</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-400 mr-2" /> All CSI MasterFormat Divisions</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-400 mr-2" /> Liquidated Damages Radar</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-400 mr-2" /> Priority Extraction Speed</li>
              </ul>
            </div>
            <Link href="/dashboard" className="mt-8 block text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-600/30">Start Solo Plan</Link>
          </div>

          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-300">Annual Pass</h3>
              <div className="mt-4 text-4xl font-extrabold text-white">$499<span className="text-base font-normal text-slate-400">/yr</span></div>
              <p className="text-xs text-slate-500 mt-1">Best Value (Save 40%)</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> Full Unlimited Access</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 3 Team Estimator Seats</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> Dedicated Onboarding Support</li>
              </ul>
            </div>
            <Link href="/dashboard" className="mt-8 block text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition">Get Annual Pass</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
