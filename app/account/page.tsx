'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, User, Users, CreditCard, Shield, Trash2, Plus, ArrowLeft, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [teamSeats, setTeamSeats] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [seatMsg, setSeatMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (session.user.email === 'specscopeai@gmail.com') {
          setProfile({ ...prof, subscription_tier: 'team', scans_remaining: 9999 });
        } else {
          setProfile(prof);
        }
        const { data: seats } = await supabase.from('team_seats').select('*').eq('owner_id', session.user.id);
        if (seats) setTeamSeats(seats);
      }
      setIsLoading(false);
    });
  }, []);

  const handleAddSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeatMsg('');
    if (!inviteEmail) return;

    if (teamSeats.length >= 2) {
      setSeatMsg('Maximum team seats (3 total: 1 Owner + 2 Members) reached.');
      return;
    }

    const { error } = await supabase.from('team_seats').insert({
      owner_id: user.id,
      member_email: inviteEmail.toLowerCase().trim()
    });

    if (error) {
      setSeatMsg(error.message);
    } else {
      setTeamSeats([...teamSeats, { member_email: inviteEmail.toLowerCase().trim() }]);
      setInviteEmail('');
      setSeatMsg('Team member invited successfully!');
    }
  };

  const handleRemoveSeat = async (memberEmail: string) => {
    await supabase.from('team_seats').delete().eq('owner_id', user.id).eq('member_email', memberEmail);
    setTeamSeats(teamSeats.filter(s => s.member_email !== memberEmail));
  };

  const getStripeUrl = (baseUrl: string) => {
    const params = new URLSearchParams();
    if (user?.id) params.set('client_reference_id', user.id);
    if (user?.email) params.set('prefilled_email', user.email);
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">Loading Account Settings...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 py-4 px-6 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Estimator</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-500" />
          <span className="font-bold text-lg">SpecScope<span className="text-blue-500">.AI</span></span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Account & Subscription Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your profile, team seats, and subscription billing.</p>
        </div>

        {/* Profile Card */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center"><User className="h-4 w-4 text-blue-400 mr-2" /> Profile Overview</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-slate-500 font-semibold block">Logged In Email</span>
              <span className="text-white font-medium mt-1 block">{user?.email}</span>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-slate-500 font-semibold block">Subscription Status</span>
              <span className="text-blue-400 font-bold capitalize mt-1 block">{profile?.subscription_tier?.replace('_', ' ') || 'Free Pilot'}</span>
            </div>
          </div>
        </div>

        {/* Team Seats Management - Gated for Team Plan */}
        {profile?.subscription_tier === 'team' ? (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white flex items-center"><Users className="h-4 w-4 text-blue-400 mr-2" /> Team Estimator Seats</h3>
                <p className="text-xs text-slate-400 mt-0.5">Team licenses include 3 total seats (1 Owner + 2 Members). Access revokes automatically upon plan cancellation.</p>
              </div>
              <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full font-semibold text-slate-300">
                {teamSeats.length + 1} / 3 Seats Used
              </span>
            </div>

            <form onSubmit={handleAddSeat} className="flex gap-3 pt-2">
              <input 
                type="email"
                placeholder="colleague@contracting.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Invite Estimator</span>
              </button>
            </form>
            {seatMsg && <p className="text-xs text-blue-400">{seatMsg}</p>}

            <div className="space-y-2 pt-2">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="text-white font-medium">{user?.email}</span>
                  <span className="text-slate-500 ml-2">(Owner)</span>
                </div>
                <span className="text-blue-400 font-semibold text-[11px]">Primary Seat</span>
              </div>

              {teamSeats.map((seat, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-white font-medium">{seat.member_email}</span>
                  <button 
                    onClick={() => handleRemoveSeat(seat.member_email)}
                    className="text-slate-500 hover:text-rose-400 transition"
                    title="Remove Seat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-900/60 border border-slate-800/90 rounded-2xl space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-purple-950/50 border border-purple-800/60 rounded-xl text-purple-400">
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center">Team Estimator Seats</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Team seats (3 total) are included on the Team Plan ($149/mo).
                </p>
              </div>
            </div>
            <div className="pt-2">
              <a 
                href={getStripeUrl("https://buy.stripe.com/aFa7sK6dX6jV2fVgEg28801")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-purple-600/20"
              >
                <span>Upgrade to Team Plan</span>
              </a>
            </div>
          </div>
        )}

        {/* Billing Portal Card */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center"><CreditCard className="h-4 w-4 text-blue-400 mr-2" /> Billing & Invoices</h3>
          <p className="text-xs text-slate-400">Manage your company credit card, download formal PDF tax invoices, or update your subscription plan via Stripe Customer Portal.</p>
          <div className="pt-2 flex gap-4">
            <a 
              href="https://billing.stripe.com/p/login/aFa7sK6dX6jV2fVgEg28801" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Open Stripe Billing Portal
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
