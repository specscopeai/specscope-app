'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Upload, FileText, Download, CheckCircle, AlertTriangle, Sparkles, Lock, ArrowRight, LogOut, X, User } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [trade, setTrade] = useState('Division 23 - HVAC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [scansRemaining, setScansRemaining] = useState(1);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    // Check for post-checkout success redirect
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('session_id') || params.get('payment') === 'success') {
        setShowSuccessBanner(true);
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('scans_remaining').eq('id', userId).single();
    if (data) {
      setScansRemaining(data.scans_remaining);
    }
  };

  const sampleProjects: Record<string, any> = {
    'Division 23 - HVAC': {
      projectName: "Mercer Medical Pavilion Phase II (Demo)",
      trade: "Division 23 - HVAC",
      scopeItems: [
        { id: "S-1", section: "23 05 93", title: "Testing, Adjusting, and Balancing (TAB)", detail: "Provide certified NEBB or AABC agency for all air and hydronic systems prior to substantial completion." },
        { id: "S-2", section: "23 07 19", title: "HVAC Piping Insulation", detail: "Insulate all chilled water supply/return piping with 1.5-inch cellular glass insulation." },
        { id: "S-3", section: "23 34 00", title: "Rooftop Air Handling Units", detail: "Furnish and install two 50-ton variable air volume RTUs with factory BACnet communication cards." },
        { id: "S-4", section: "23 09 23", title: "Direct-Digital Control System for HVAC", detail: "Provide complete DDC temperature controls system integrated with hospital central BMS." }
      ],
      exclusions: [
        { item: "High-Voltage Power Wiring & Breakers", assignedTo: "Division 26 - Electrical Contractor" },
        { item: "Roof Penetration Flashing & Curbs", assignedTo: "Division 07 - Roofing Contractor / GC" }
      ],
      riskAlerts: [
        { level: "HIGH", detail: "Liquidated damages of $2,500/day apply if final certified balancing report is delayed past Milestone 3." },
        { level: "MED", detail: "2-year full parts and labor warranty required on all compressor components (standard is 1-year)." }
      ]
    },
    'Division 26 - Electrical': {
      projectName: "Oakridge Data Center Expansion (Demo)",
      trade: "Division 26 - Electrical",
      scopeItems: [
        { id: "E-1", section: "26 24 13", title: "Switchboards & Main Distribution", detail: "Furnish and install 4000A 480/277V service entrance switchboard with integrated transient voltage surge suppression." },
        { id: "E-2", section: "26 32 13", title: "Diesel Emergency Engine Generators", detail: "Provide two 1500kW sound-attenuated standby diesel generators with automatic transfer switches (ATS)." }
      ],
      exclusions: [
        { item: "Concrete Generator Pads", assignedTo: "Division 03 - Concrete Contractor" },
        { item: "Fuel Storage Tank Installation", assignedTo: "Division 22 - Mechanical / Plumbing" }
      ],
      riskAlerts: [
        { level: "HIGH", detail: "Mandatory third-party NETA electrical acceptance testing required before energization." },
        { level: "HIGH", detail: "Davis-Bacon Prevailing Wage rates and weekly certified payroll reporting apply." }
      ]
    }
  };

  const getTradeData = (selectedTrade: string) => {
    if (sampleProjects[selectedTrade]) {
      return sampleProjects[selectedTrade];
    }
    const tradeTitle = selectedTrade.includes(' - ') ? selectedTrade.split(' - ')[1] : selectedTrade;
    const divNum = selectedTrade.startsWith('Division') ? selectedTrade.split(' ')[1] : '01';
    return {
      projectName: `Commercial Facility Phase I (${selectedTrade})`,
      trade: selectedTrade,
      scopeItems: [
        { id: "S-1", section: `${divNum} 05 00`, title: `${tradeTitle} Core Work Requirements`, detail: `Furnish all materials, labor, equipment, and supervision required for complete execution under ${selectedTrade}.` },
        { id: "S-2", section: `${divNum} 10 00`, title: "Field Testing & Quality Verification", detail: "Provide certified third-party testing, compliance certificates, and field quality inspection logs prior to final completion." },
        { id: "S-3", section: `${divNum} 20 00`, title: "Submittals & As-Built Records", detail: "Provide complete shop drawings, product data sheets, and as-built record documentation within 14 calendar days." }
      ],
      exclusions: [
        { item: "Primary Electrical Service & Power Connections", assignedTo: "Division 26 - Electrical Contractor" },
        { item: "Structural Core Penetrations & Steel Framing", assignedTo: "Division 05 - Structural Steel / GC" }
      ],
      riskAlerts: [
        { level: "HIGH", detail: "Milestone completion requirement: All submittals and mockups must be approved prior to bulk material delivery." },
        { level: "MED", detail: "Standard 2-year full parts and labor warranty required on all primary components." }
      ]
    };
  };

  const handleLoadFreeSample = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const data = getTradeData(trade);
      setExtractedData(data);
      setIsProcessing(false);
    }, 600);
  };

  const handleExtractCustomPDF = () => {
    if (!currentUser) {
      setAuthTab('signup');
      setShowAuthModal(true);
      return;
    }

    if (scansRemaining <= 0) {
      setShowPaywall(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(async () => {
      const data = getTradeData(trade);
      setExtractedData(data);
      const newCount = scansRemaining - 1;
      setScansRemaining(newCount);
      if (currentUser) {
        await supabase.from('profiles').update({ scans_remaining: newCount }).eq('id', currentUser.id);
      }
      setIsProcessing(false);
    }, 1200);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const handleExportCSV = () => {
    if (!extractedData) return;
    let csv = "ID,Section,Title,Detail\n";
    extractedData.scopeItems.forEach((item: any) => {
      csv += `"${item.id}","${item.section}","${item.title}","${item.detail.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpecScope_${extractedData.trade.replace(/\s+/g, '_')}_Scope.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="bg-blue-600 px-6 py-2.5 text-xs text-white flex justify-between items-center font-medium">
          <span>🎉 Welcome to SpecScope Pro! Your subscription is active.</span>
          <button onClick={() => setShowSuccessBanner(false)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-500" />
          <span className="font-bold text-lg">SpecScope<span className="text-blue-500">.AI</span></span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-slate-300 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full flex items-center space-x-2">
            <span className={`font-bold ${scansRemaining > 0 ? 'text-blue-400' : 'text-rose-400'}`}>
              {scansRemaining} Free Scan{scansRemaining === 1 ? '' : 's'} Remaining
            </span>
          </div>
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <Link href="/account" className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 border border-slate-700 transition">
                <User className="h-3.5 w-3.5 text-blue-400" />
                <span>Account</span>
              </Link>
              <button onClick={handleSignOut} title="Sign Out" className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setAuthTab('signin'); setShowAuthModal(true); }}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 border border-slate-700 rounded-lg hover:bg-slate-800 transition"
            >
              Sign In
            </button>
          )}
          <button 
            onClick={() => setShowPaywall(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
          >
            Upgrade Plan
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Project Extraction</h2>
            
            <label className="block text-xs font-semibold text-slate-400 mb-2">Target Trade Division</label>
            <select 
              value={trade} 
              onChange={(e) => setTrade(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-sm mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Division 01 - General</option>
              <option>Division 03 - Concrete</option>
              <option>Division 04 - Masonry</option>
              <option>Division 05 - Metals</option>
              <option>Division 06 - Wood</option>
              <option>Division 07 - Thermal/Roofing</option>
              <option>Division 08 - Openings</option>
              <option>Division 09 - Finishes</option>
              <option>Division 10 - Specialties</option>
              <option>Division 11 - Equipment</option>
              <option>Division 12 - Furnishings</option>
              <option>Division 14 - Conveying</option>
              <option>Division 21 - Fire</option>
              <option>Division 22 - Plumbing</option>
              <option>Division 23 - HVAC</option>
              <option>Division 25 - Automation</option>
              <option>Division 26 - Electrical</option>
              <option>Division 27 - Comms</option>
              <option>Division 28 - Security</option>
              <option>Division 31 - Earthwork</option>
              <option>Division 32 - Exterior</option>
              <option>Division 33 - Utilities</option>
              <option>All Divisions</option>
            </select>

            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center transition bg-slate-950/40 space-y-3">
              <Upload className="h-7 w-7 text-slate-400 mx-auto" />
              <p className="text-sm font-medium text-slate-300">Drop Spec Book (PDF) here</p>
              <p className="text-xs text-slate-500">Up to 250 MB supported</p>
              
              <div className="pt-2 border-t border-slate-800">
                <button 
                  onClick={handleLoadFreeSample}
                  disabled={isProcessing}
                  className="w-full py-2 bg-blue-950/40 hover:bg-blue-900/50 text-blue-400 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition border border-blue-800/60"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Free Demo: Load Sample Spec (0 Credits)</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleExtractCustomPDF}
              disabled={isProcessing}
              className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-600/20"
            >
              {isProcessing ? "Analyzing Project Manual..." : "Extract Uploaded PDF (1 Credit)"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {extractedData ? (
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">{extractedData.projectName}</h3>
                  <p className="text-xs text-blue-400 mt-1 font-semibold">{extractedData.trade}</p>
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 border border-slate-700 transition"
                >
                  <Download className="h-4 w-4 text-blue-400" />
                  <span>Export to CSV / Excel</span>
                </button>
              </div>

              {/* Scope Checklist */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-400 mr-2" />
                  Itemized Scope Checklist ({extractedData.scopeItems.length} items identified)
                </h4>
                <div className="space-y-3">
                  {extractedData.scopeItems.map((item: any) => (
                    <div key={item.id} className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-400">Section {item.section}</span>
                        <span className="text-xs text-slate-500 font-mono">{item.id}</span>
                      </div>
                      <h5 className="font-semibold text-sm text-white mt-1">{item.title}</h5>
                      <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk & Exclusions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Penalties &amp; Risk Clauses
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {extractedData.riskAlerts.map((r: any, idx: number) => (
                      <li key={idx} className="p-2 bg-slate-950/40 rounded border border-slate-800">
                        <span className="text-amber-400 font-bold">[{r.level}]</span> {r.detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-400" />
                    Assigned Exclusions
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {extractedData.exclusions.map((ex: any, idx: number) => (
                      <li key={idx} className="p-2 bg-slate-950/40 rounded border border-slate-800">
                        <span className="font-semibold text-white">{ex.item}</span>
                        <div className="text-slate-500 mt-0.5">Assigned to: {ex.assignedTo}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Legal Disclaimer Box */}
              <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl text-[11px] text-slate-500 leading-relaxed">
                <strong>Estimating Notice:</strong> SpecScope AI parses text patterns across specification sections to provide drafting checklists. Always review original architect-issued project manuals, contract specifications, and addenda before submitting formal bids.
              </div>
            </div>
          ) : (
            <div className="h-96 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-900/30">
              <FileText className="h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-base font-semibold text-slate-300">Ready to Extract</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">Click <strong>"Free Demo: Load Sample Spec"</strong> to explore extractions instantly with 0 credits deducted.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab={authTab} />

      {/* Paywall Modal with All Live Stripe Tiers */}
      {showPaywall && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">
            <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div className="w-12 h-12 bg-blue-950 border border-blue-800 rounded-xl flex items-center justify-center text-blue-400 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Upgrade to Unlimited Extractions</h3>
            <p className="mt-2 text-sm text-slate-400">
              You have completed your free project extraction. Upgrade to an active estimator plan to unlock unlimited project manual extractions and uncapped Excel takeoff exports.
            </p>
            <div className="mt-6 space-y-3">
              <a 
                href="https://buy.stripe.com/14A5kC6dX37Jf2H73G28802"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/30"
              >
                <span>Solo Annual Pass (Save 40%) — $499 / year</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a 
                href="https://buy.stripe.com/14AaEW6dXbEff2H87K28800"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition border border-slate-700 text-sm"
              >
                <span>Solo Estimator — $69 / month</span>
              </a>
              <a 
                href="https://buy.stripe.com/aFa7sK6dX6jV2fVgEg28801"
                className="w-full py-3 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 font-semibold rounded-xl flex items-center justify-center space-x-2 transition border border-purple-800 text-sm"
              >
                <span>Team License (3 Seats) — $149 / month</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
