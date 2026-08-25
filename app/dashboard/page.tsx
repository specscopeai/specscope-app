'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Zap, Upload, FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [trade, setTrade] = useState('Division 23 - HVAC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleSimulateExtraction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setExtractedData({
        projectName: "Mercer Medical Pavilion Phase II",
        trade: trade,
        scopeItems: [
          { id: "S-1", section: "23 05 93", title: "Testing, Adjusting, and Balancing (TAB)", detail: "Provide certified NEBB or AABC agency for all air and hydronic systems prior to substantial completion." },
          { id: "S-2", section: "23 07 19", title: "HVAC Piping Insulation", detail: "Insulate all chilled water supply/return piping with 1.5-inch cellular glass insulation." },
          { id: "S-3", section: "23 34 00", title: "Rooftop Air Handling Units", detail: "Furnish and install two 50-ton variable air volume RTUs with factory BACnet communication cards." }
        ],
        exclusions: [
          { item: "Power Wiring & Circuit Breakers", assignedTo: "Division 26 - Electrical Contractor" },
          { item: "Structural Roof Curbs & Openings", assignedTo: "Division 05 - Structural Steel / GC" }
        ],
        riskAlerts: [
          { level: "HIGH", detail: "Liquidated damages of $2,500/day apply if final balancing report is not submitted by Milestone 3." },
          { level: "MED", detail: "2-year full parts and labor warranty required on all compressor components (standard is 1-year)." }
        ]
      });
      setIsProcessing(false);
    }, 1500);
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
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-500" />
          <span className="font-bold text-lg">SpecScope<span className="text-blue-500">.AI</span></span>
        </Link>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Trial: 3 Scans Remaining</span>
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto p-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4">New Project Extraction</h2>
            
            <label className="block text-xs font-semibold text-slate-400 mb-2">Target Trade Division</label>
            <select 
              value={trade} 
              onChange={(e) => setTrade(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-sm mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Division 21 - Fire Suppression</option>
              <option>Division 22 - Plumbing</option>
              <option>Division 23 - HVAC</option>
              <option>Division 26 - Electrical</option>
              <option>Division 07 - Roofing & Waterproofing</option>
              <option>Division 09 - Finishes / Drywall</option>
            </select>

            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition bg-slate-950/40">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">Drop Spec Book (PDF) here</p>
              <p className="text-xs text-slate-500 mt-1">Up to 250 MB supported</p>
            </div>

            <button 
              onClick={handleSimulateExtraction}
              disabled={isProcessing}
              className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-600/20"
            >
              {isProcessing ? "Analyzing Project Manual..." : "Extract Trade Scope"}
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Penalties & Risk Clauses
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
            </div>
          ) : (
            <div className="h-96 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-900/30">
              <FileText className="h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-base font-semibold text-slate-300">No Active Extraction</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">Select your trade division on the left and upload a spec document or click "Extract Trade Scope" to view sample extraction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
