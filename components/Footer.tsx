'use client';
import { useState } from 'react';
import { ShieldCheck, Lock, FileText, X, MessageSquarePlus, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLiability, setShowLiability] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [feedbackCategory, setFeedbackCategory] = useState('Feature Request');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackMsg('');
      setShowFeedback(false);
    }, 2000);
  };

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-12 px-6 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3 md:col-span-2">
          <span className="font-bold text-base text-white tracking-tight">SpecScope<span className="text-blue-500">.AI</span></span>
          <p className="text-slate-400 max-w-md leading-relaxed">
            Automated specification analysis and scope extraction software built for commercial trade subcontractors and estimating teams.
          </p>
          <p className="text-slate-500 text-[11px] leading-relaxed pt-2 border-t border-slate-900">
            <strong>Estimating Disclaimer:</strong> SpecScope AI is an estimating productivity aid. It does not constitute architectural, engineering, or binding legal advice. Contractors are solely responsible for reviewing complete project manuals, verifying contract documents, confirming addenda, and submitting final bids.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Legal & Compliance</h4>
          <ul className="space-y-2">
            <li><button onClick={() => setShowTerms(true)} className="hover:text-white transition">Terms of Service</button></li>
            <li><button onClick={() => setShowPrivacy(true)} className="hover:text-white transition">Privacy & Data Security</button></li>
            <li><button onClick={() => setShowLiability(true)} className="hover:text-white transition">Limitation of Liability</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Support & Feedback</h4>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setShowFeedback(true)}
                className="inline-flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 transition font-medium"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                <span>Submit Product Feedback</span>
              </button>
            </li>
            <li><a href="mailto:support@getspecscope.com" className="text-slate-400 hover:text-white transition">support@getspecscope.com</a></li>
            <li><span className="text-slate-500">Response time: &lt; 24 hours</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px]">
        <div>© 2026 SpecScope AI. All rights reserved.</div>
        <div className="flex space-x-6 mt-2 sm:mt-0">
          <span>Encrypted with TLS 1.3</span>
          <span>Zero Public AI Model Training</span>
        </div>
      </div>

      {/* Product Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl text-slate-300 space-y-4">
            <button onClick={() => setShowFeedback(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            <div className="flex items-center space-x-2 text-blue-400">
              <MessageSquarePlus className="h-5 w-5" />
              <h3 className="text-lg font-bold text-white">Product Feedback & Feature Requests</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have an idea, trade-specific request, or feedback on an AI extraction? We read every submission directly.
            </p>

            {feedbackSubmitted ? (
              <div className="p-6 bg-blue-950/50 border border-blue-800/60 rounded-xl text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-blue-400 mx-auto" />
                <h4 className="font-bold text-white">Feedback Received!</h4>
                <p className="text-xs text-slate-300">Thank you for helping us improve SpecScope AI.</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Feedback Category</label>
                  <select 
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Feature Request</option>
                    <option>AI Extraction Feedback</option>
                    <option>Trade Specific Need</option>
                    <option>Bug Report</option>
                    <option>General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Your Message or Suggestion</label>
                  <textarea 
                    rows={4}
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    placeholder="Tell us what trade feature or improvement would make your estimating workflow faster..."
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/20"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto relative shadow-2xl text-slate-300 space-y-4">
            <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            <h3 className="text-xl font-bold text-white">Terms of Service & Estimating Agreement</h3>
            <p className="text-xs text-slate-400">Effective: August 2026</p>
            <div className="space-y-3 text-xs leading-relaxed">
              <p><strong>1. Scope of Service:</strong> SpecScope AI provides automated parsing of construction specification documents to assist contractors in preparing estimates. The software provides informational checklists and summary tables.</p>
              <p><strong>2. Contractor Responsibility & Limitation of Liability:</strong> Under no circumstances shall SpecScope AI or its operators be liable for missed scope items, bidding errors, liquidated damages, lost profits, or contractual disputes resulting from reliance on the software. The contractor retains 100% legal responsibility for validating all architectural plans, specification manuals, addenda, and final bid submissions.</p>
              <p><strong>3. Subscription & Cancellation:</strong> Subscriptions are billed monthly or annually and may be canceled at any time via the customer billing portal.</p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto relative shadow-2xl text-slate-300 space-y-4">
            <button onClick={() => setShowPrivacy(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            <h3 className="text-xl font-bold text-white">Privacy & Data Security Policy</h3>
            <div className="space-y-3 text-xs leading-relaxed">
              <p><strong>1. Zero AI Model Training:</strong> All specification documents processed through our enterprise API endpoints are strictly confidential and are <strong>never used to train public AI models</strong>, in compliance with standard Google Enterprise API service terms.</p>
              <p><strong>2. Data Encryption:</strong> All data is encrypted in transit via TLS 1.3 and at rest with AES-256 encryption.</p>
              <p><strong>3. Data Ownership:</strong> Contractors retain 100% ownership of all uploaded project manuals and extracted data. We do not sell or distribute contractor data to any third party.</p>
            </div>
          </div>
        </div>
      )}

      {/* Limitation of Liability Modal */}
      {showLiability && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto relative shadow-2xl text-slate-300 space-y-4">
            <button onClick={() => setShowLiability(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            <h3 className="text-xl font-bold text-white">Limitation of Liability Agreement</h3>
            <p className="text-xs text-slate-400">Effective: August 2026</p>
            <div className="space-y-3 text-xs leading-relaxed">
              <p><strong>1. Estimating Tool Nature:</strong> SpecScope AI is designed solely as an estimating productivity and drafting assistance tool. Output summaries, scope checklists, and exclusion tables are generated automatically to assist contractor review.</p>
              <p><strong>2. Zero Liability for Bid Errors:</strong> Under no circumstances shall SpecScope AI, its developers, or parent company be held liable for missed scope items, pricing inaccuracies, bidding oversights, unassigned contract specifications, liquidated damages, or project cost overruns.</p>
              <p><strong>3. Mandatory Independent Review:</strong> Subcontractors and estimating teams must independently review, verify, and audit all official project manuals, contract specifications, architectural drawings, and addenda before submitting binding bids or lump-sum proposals.</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
