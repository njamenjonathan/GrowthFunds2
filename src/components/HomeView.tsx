import React, { useState } from 'react';
import { motion } from 'motion/react';
import { InvestmentPlan } from '../types';
import { GrowthFundLogo } from './GrowthFundLogo';

interface HomeViewProps {
  plans: InvestmentPlan[];
  onSelectPlan: (plan: InvestmentPlan) => void;
  onExplorePlans: () => void;
  onOpenDeposit: () => void;
  onOpenKyc: () => void;
  onOpenLegal: (topic: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  plans,
  onSelectPlan,
  onExplorePlans,
  onOpenDeposit,
  onOpenLegal,
}) => {
  // Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(250000);
  const [calcMonths, setCalcMonths] = useState<number>(12);
  const [selectedCalcPlanId, setSelectedCalcPlanId] = useState<string>('real-estate-fund');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const activeCalcPlan = plans.find((p) => p.id === selectedCalcPlanId) || plans[0];
  const projectedGain = Math.round(
    calcAmount * ((activeCalcPlan.projectedReturn / 100) * (calcMonths / 12))
  );
  const estimatedTotal = calcAmount + projectedGain;
  const monthlyPayout = Math.round(projectedGain / calcMonths);

  const tickerItems = [
    { label: 'BVMAC Composite', value: '1,482.30', change: '+1.45%', positive: true },
    { label: 'BEAC Policy Rate', value: '5.00%', change: 'Stable', positive: true },
    { label: 'Cocoa & Agri Yield', value: '+14.2% YTD', change: '+2.1%', positive: true },
    { label: 'Douala Prime RE Fund', value: '+11.8% YTD', change: '+0.8%', positive: true },
    { label: 'CEMAC Sovereign 5Y', value: '7.60%', change: '+0.4%', positive: true },
    { label: 'EUR / XAF', value: '655.957', change: 'Fixed Peg', positive: true },
    { label: 'Total AUM Cleared', value: '45.25M XAF', change: '+19.2%', positive: true },
    { label: 'Active Retained Capital', value: '98.4%', change: 'Zero Default', positive: true },
  ];

  const institutionalPartners = [
    { name: 'COSUMAF', role: 'Regulator', icon: 'verified' },
    { name: 'BEAC Interbank', role: 'Clearing', icon: 'account_balance' },
    { name: 'Ecobank', role: 'Custodian Bank', icon: 'security' },
    { name: 'Afriland First', role: 'Asset Depository', icon: 'account_balance_wallet' },
    { name: 'MTN MoMo', role: 'Direct Settlement', icon: 'smartphone' },
    { name: 'Orange Money', role: 'Instant Funding', icon: 'payments' },
    { name: 'Express Union', role: 'Regional Cash Points', icon: 'storefront' },
  ];

  const testimonials = [
    {
      name: 'Dr. Martin Mbarga',
      role: 'Chief Medical Officer',
      location: 'Douala, Cameroon',
      amount: '3,500,000 XAF',
      plan: 'Real Estate Development Fund',
      yieldEarned: '+420,000 XAF Return',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment: 'As a busy medical professional, GrowthFund gave me the peace of mind of COSUMAF-supervised institutional asset backing. Withdrawals to my MTN MoMo wallet happen strictly within 60 seconds.',
    },
    {
      name: 'Jeanne-Marie Nguesso',
      role: 'Managing Director, Logistics',
      location: 'Libreville, Gabon',
      amount: '5,000,000 XAF',
      plan: 'Central African Cocoa Export Plan',
      yieldEarned: '+710,000 XAF Return',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      comment: 'The transparency is unmatched in CEMAC. Every portfolio asset is physically audited, and the quarterly returns match the exact prospectus figures without hidden charges.',
    },
    {
      name: 'Christian Kouassi',
      role: 'Senior Software Engineer',
      location: 'Yaoundé & Diaspora',
      amount: '1,800,000 XAF',
      plan: 'CEMAC Sovereign Bond Basket',
      yieldEarned: '+136,800 XAF Return',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'Investing in local infrastructure from abroad used to be filled with uncertainty. GrowthFund makes regional wealth building modern, secure, and fully compliant with banking regulations.',
    },
  ];

  const faqs = [
    {
      q: 'How are investor funds protected and custodied?',
      a: 'Client capital is held in segregated trust accounts at premier CEMAC commercial banks and regional depositories. GrowthFund cannot co-mingle investor capital with operational expenses, ensuring full segregation and legal ring-fencing under COSUMAF oversight.',
    },
    {
      q: 'How do deposits and withdrawals work via Mobile Money & Banks?',
      a: 'You can fund your portfolio instantly in XAF (FCFA) using MTN Mobile Money, Orange Money, Express Union, or direct bank transfer (Ecobank, UBA, Afriland). Withdrawals at maturity are processed within 5-15 minutes directly back to your verified mobile number or bank account.',
    },
    {
      q: 'What is the minimum amount required to start investing?',
      a: 'You can begin with as little as 25,000 XAF in the CEMAC Sovereign Bond Basket, or allocate larger amounts across high-yield Agricultural and Real Estate portfolios with zero entry penalties.',
    },
    {
      q: 'Are returns guaranteed or subject to market risk?',
      a: 'In accordance with COSUMAF market regulations, returns are projected based on vetted regional economic assets (real estate leases, export contracts, treasury bills) and verified quarterly audits. We maintain strict risk management and emergency liquidity reserves.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Live Financial Ticker Bar */}
      <div className="bg-[#002410] text-[#fed65b] py-2 border-b border-[#fed65b]/20 overflow-hidden relative text-xs">
        <div className="flex items-center gap-8 whitespace-nowrap animate-in fade-in duration-500 overflow-x-auto hide-scrollbar px-4">
          <div className="flex items-center gap-2 text-white font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#48c774] animate-pulse"></span>
            <span className="uppercase tracking-widest text-[10px] text-[#fed65b]">LIVE CEMAC INDEX</span>
          </div>
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
              <span className="text-white/70">{item.label}:</span>
              <span className="text-white font-bold">{item.value}</span>
              <span className="text-[#97d5a5] font-semibold bg-[#014421] px-1.5 py-0.5 rounded text-[10px]">
                {item.change}
              </span>
              <span className="text-white/20 ml-2">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-14 md:py-24 border-b border-[#c0c9be]/30 overflow-hidden bg-gradient-to-b from-white via-[#f8faf9] to-[#f0f5f2]">
        {/* Ambient background light orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#002c13]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#fed65b]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1240px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Regulation Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white border border-[#fed65b]/60 shadow-xs rounded-full px-4 py-1.5">
              <div className="w-5 h-5 rounded-full bg-[#002c13] text-[#fed65b] flex items-center justify-center">
                <span className="material-symbols-outlined text-[13px]">verified</span>
              </div>
              <span className="text-xs font-extrabold text-[#002c13] tracking-wide">
                COSUMAF Regulated Institution • License SGP-04/2023
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#002c13] tracking-tight leading-[1.1] font-display">
              Grow Your Wealth with <br className="hidden sm:inline" />
              <span className="gold-gradient-text">Institutional Precision.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#404941] max-w-xl leading-relaxed">
              Central Africa’s premier asset management gateway. Seamless XAF deposits via Mobile Money &amp; Banks, high-yield regional funds, and transparent COSUMAF-supervised governance.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenDeposit}
                className="bg-[#002c13] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-[#014421] transition-all text-center flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer-badge pointer-events-none opacity-30"></div>
                <span>Start Investing in XAF</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExplorePlans}
                className="border border-[#002c13]/30 bg-white/80 backdrop-blur-xs text-[#002c13] font-bold text-sm px-7 py-4 rounded-xl hover:bg-[#f3f4f5] transition-colors text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[20px] text-[#735c00]">insights</span>
                <span>Explore Curated Funds</span>
              </motion.button>
            </div>

            {/* Credibility mini bar */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#c0c9be]/40">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#717970] font-bold">Total AUM Custody</p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#002c13] font-mono mt-0.5">45.2M XAF</p>
                <span className="text-[10px] text-[#306a43] font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span> 100% Segregated
                </span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#717970] font-bold">Active Investors</p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#002c13] font-mono mt-0.5">1,248+</p>
                <span className="text-[10px] text-[#717970] font-semibold mt-0.5 block">CEMAC Region</span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#717970] font-bold">Avg. Historical Yield</p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#735c00] font-mono mt-0.5">12.4% / yr</p>
                <span className="text-[10px] text-[#306a43] font-semibold mt-0.5 block">Net of All Fees</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Mockup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative w-full rounded-3xl border border-[#fed65b]/40 shadow-2xl bg-white p-5 lg:p-7 overflow-hidden">
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#002c13] via-[#fed65b] to-[#002c13]"></div>

              {/* Verified Header */}
              <div className="flex justify-between items-center pb-4 border-b border-[#e1e3e4] mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#002c13] text-[#fed65b] flex items-center justify-center font-bold text-sm shadow-xs">
                    SN
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#191c1d]">Samuel E. Nguema</p>
                    <p className="text-[10px] text-[#306a43] flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#306a43] animate-ping"></span>
                      Verified Portfolio • Tier 2 CNI
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono bg-[#002c13]/5 border border-[#002c13]/15 px-2.5 py-1 rounded-full text-[#002c13] font-bold">
                  BVMAC • COSUMAF
                </span>
              </div>

              {/* Total Balance Card */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#002c13] to-[#014421] text-white shadow-md relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#fed65b]/10 blur-xl"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#fed65b] tracking-wider">
                      Total Net Investment Value
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                      2,450,000 XAF
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-[#fed65b]/20 border border-[#fed65b]/40 rounded-lg text-[10px] font-bold text-[#fed65b]">
                    +14.8% YTD
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/60 text-[10px]">Available Liquid</span>
                    <p className="font-bold font-mono text-white">1,200,000 XAF</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-[10px]">Active Funds</span>
                    <p className="font-bold font-mono text-[#fed65b]">1,250,000 XAF</p>
                  </div>
                </div>
              </div>

              {/* Growth Curve Chart SVG */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-[#717970]">
                  <span className="font-semibold text-[#191c1d]">Historical Compound Performance</span>
                  <span className="text-[#306a43] font-bold">+168,450 XAF Payouts</span>
                </div>
                <div className="h-28 w-full bg-[#f8f9fa] rounded-xl p-2 flex items-end relative overflow-hidden border border-[#e1e3e4]">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#002c13" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#002c13" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,85 Q40,75 80,60 T160,45 T240,25 T300,8 L300,100 L0,100 Z"
                      fill="url(#heroGrad)"
                    />
                    <path
                      d="M0,85 Q40,75 80,60 T160,45 T240,25 T300,8"
                      fill="none"
                      stroke="#002c13"
                      strokeWidth="2.5"
                    />
                    <circle cx="80" cy="60" r="3" fill="#fed65b" stroke="#002c13" strokeWidth="1.5" />
                    <circle cx="160" cy="45" r="3" fill="#fed65b" stroke="#002c13" strokeWidth="1.5" />
                    <circle cx="240" cy="25" r="3" fill="#fed65b" stroke="#002c13" strokeWidth="1.5" />
                    <circle cx="300" cy="8" r="4.5" fill="#48c774" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Fast Activity Strip */}
              <div className="mt-4 pt-3 border-t border-[#e1e3e4] flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#fed65b]/30 text-[#735c00] flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#191c1d]">MTN Mobile Money Cleared</p>
                    <p className="text-[9px] text-[#717970]">Ref: GF-DP-882910</p>
                  </div>
                </div>
                <span className="font-bold font-mono text-[#306a43] bg-[#306a43]/10 px-2 py-0.5 rounded">
                  +100,000 XAF
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Institutional Depository & Partners Trust Strip */}
      <section className="py-8 bg-white border-b border-[#c0c9be]/30">
        <div className="max-w-[1240px] mx-auto px-4 md:px-12">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[#717970] mb-6">
            Institutional Trust Architecture &amp; Banking Clearing Partners
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center">
            {institutionalPartners.map((partner, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[#c0c9be]/30 bg-[#f8f9fa] flex flex-col items-center justify-center text-center hover:border-[#002c13] transition-all hover:bg-white shadow-2xs group"
              >
                <span className="material-symbols-outlined text-[20px] text-[#002c13] group-hover:scale-110 transition-transform">
                  {partner.icon}
                </span>
                <p className="text-xs font-extrabold text-[#191c1d] mt-1 truncate w-full">{partner.name}</p>
                <p className="text-[10px] text-[#717970] truncate w-full">{partner.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-16 md:py-20 bg-[#f8f9fa] border-b border-[#c0c9be]/30">
        <div className="max-w-[1240px] mx-auto px-4 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold text-[#735c00] tracking-widest">
              Frictionless Execution
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002c13] mt-1 font-display">
              Three Simple Steps to Build Wealth
            </h2>
            <p className="text-sm text-[#404941] mt-2">
              From instant local Mobile Money deposit to institutional asset growth and flexible redemption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-[#c0c9be]/40 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all relative group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-[#002c13] text-[#fed65b] rounded-2xl flex items-center justify-center mb-6 font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                  1
                </div>
                <h3 className="text-lg font-extrabold text-[#191c1d] mb-2">Fund Account in XAF</h3>
                <p className="text-xs sm:text-sm text-[#404941] leading-relaxed">
                  Deposit funds effortlessly using MTN Mobile Money, Orange Money, Express Union, or direct bank transfer. Your capital is instantly credited with zero hidden entry charges.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f0f2f3] text-[11px] font-bold text-[#002c13] flex items-center gap-1">
                <span>Instant Confirmation</span>
                <span className="material-symbols-outlined text-[14px]">bolt</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-[#fed65b] p-8 rounded-3xl shadow-md hover:shadow-xl transition-all relative group flex flex-col justify-between"
            >
              <div className="absolute -top-3 right-6 bg-[#002c13] text-[#fed65b] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Popular
              </div>
              <div>
                <div className="w-14 h-14 bg-[#002c13] text-[#fed65b] rounded-2xl flex items-center justify-center mb-6 font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                  2
                </div>
                <h3 className="text-lg font-extrabold text-[#191c1d] mb-2">Select Curated Strategy</h3>
                <p className="text-xs sm:text-sm text-[#404941] leading-relaxed">
                  Allocate across vetted asset portfolios—including Cocoa Agro-Export, Commercial Real Estate, and Sovereign Bonds—tailored to your risk profile and holding horizon.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f0f2f3] text-[11px] font-bold text-[#735c00] flex items-center gap-1">
                <span>7.5% – 16% Projected Yields</span>
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-[#c0c9be]/40 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all relative group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-[#002c13] text-[#fed65b] rounded-2xl flex items-center justify-center mb-6 font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                  3
                </div>
                <h3 className="text-lg font-extrabold text-[#191c1d] mb-2">Collect Audited Returns</h3>
                <p className="text-xs sm:text-sm text-[#404941] leading-relaxed">
                  Monitor live performance with downloadable receipts. At maturity, withdraw your principal and accumulated yield directly to your phone or bank within minutes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f0f2f3] text-[11px] font-bold text-[#002c13] flex items-center gap-1">
                <span>Direct Payouts</span>
                <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Investment Plans Preview */}
      <section className="py-16 md:py-24 bg-white border-b border-[#c0c9be]/30">
        <div className="max-w-[1240px] mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#735c00]">
                Institutional Due Diligence
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002c13] mt-1 font-display">
                Curated Regional Portfolios
              </h2>
              <p className="text-sm text-[#404941] mt-1">
                Asset-backed allocations vetted under COSUMAF investor protection standards.
              </p>
            </div>
            <button
              onClick={onExplorePlans}
              className="text-xs font-bold text-[#002c13] hover:text-[#014421] flex items-center gap-1.5 group bg-[#f3f4f5] px-4 py-2.5 rounded-xl border border-[#c0c9be]/40 hover:bg-[#e7e8e9] transition-all"
            >
              <span>View All 4 Portfolios</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.slice(0, 3).map((plan) => (
              <motion.div
                whileHover={{ y: -6 }}
                key={plan.id}
                className="bg-[#f8f9fa] rounded-3xl border border-[#c0c9be]/40 p-7 flex flex-col justify-between hover:border-[#002c13] transition-all hover:shadow-xl relative overflow-hidden group"
              >
                {/* Decorative Top Accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: plan.accentColor }}
                ></div>

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                        plan.riskLevel === 'Low' || plan.riskLevel === 'Very Low'
                          ? 'bg-[#b2f1bf] text-[#14512d]'
                          : plan.riskLevel === 'Medium'
                          ? 'bg-[#fed65b] text-[#745c00]'
                          : 'bg-[#2c3c4a] text-[#d4e4f6]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {plan.riskLevel === 'Low' ? 'shield' : plan.riskLevel === 'Medium' ? 'balance' : 'trending_up'}
                      </span>
                      {plan.riskLevel} Risk
                    </span>
                    <span className="material-symbols-outlined text-2xl text-[#002c13] group-hover:scale-110 transition-transform">
                      {plan.iconName}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#191c1d] mb-1.5">{plan.name}</h3>
                  <p className="text-xs text-[#404941] mb-6 line-clamp-2">{plan.description}</p>

                  <div className="space-y-3 mb-6 bg-white p-4 rounded-2xl border border-[#e1e3e4] shadow-2xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-[#717970] font-semibold">Projected Net Yield</span>
                      <span className="text-2xl font-extrabold text-[#002c13] font-mono">
                        {plan.projectedReturn}% <span className="text-xs font-normal text-[#717970]">/ yr</span>
                      </span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-[#f0f2f3]">
                      <span className="text-[#717970]">Min. Allocation</span>
                      <span className="font-bold text-[#191c1d] font-mono">{plan.minInvestment.toLocaleString()} XAF</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#717970]">Lock-in Term</span>
                      <span className="font-bold text-[#191c1d]">{plan.termMonths} Months</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectPlan(plan)}
                  className="w-full py-3 bg-white border border-[#002c13] text-[#002c13] rounded-xl text-xs font-extrabold hover:bg-[#002c13] hover:text-white transition-all flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md"
                >
                  <span>View Prospectus &amp; Allocate</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Simulator & Compound Calculator */}
      <section className="py-16 md:py-24 bg-[#f3f4f5] border-b border-[#c0c9be]/30">
        <div className="max-w-[1240px] mx-auto px-4 md:px-12">
          <div className="bg-white rounded-3xl border border-[#c0c9be]/40 p-6 md:p-12 shadow-md">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#735c00]">
                Financial Modeling
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002c13] mt-1 font-display">
                Simulate Your Wealth Accumulation
              </h2>
              <p className="text-xs sm:text-sm text-[#404941] mt-2">
                Forecast your compound outcomes in XAF based on historical regional fund yields and net holding periods.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Inputs */}
              <div className="lg:col-span-7 space-y-7">
                {/* Select Fund */}
                <div>
                  <label className="block text-xs font-extrabold text-[#191c1d] mb-2.5 uppercase tracking-wider">
                    Select Target Strategy
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {plans.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedCalcPlanId(p.id)}
                        className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                          selectedCalcPlanId === p.id
                            ? 'border-[#002c13] bg-[#002c13] text-white shadow-sm'
                            : 'border-[#c0c9be] bg-white text-[#191c1d] hover:bg-[#f8f9fa]'
                        }`}
                      >
                        <p className="font-bold truncate">{p.name}</p>
                        <p className={`text-[11px] mt-0.5 font-bold ${selectedCalcPlanId === p.id ? 'text-[#fed65b]' : 'text-[#735c00]'}`}>
                          {p.projectedReturn}% Projected
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-extrabold text-[#191c1d] uppercase tracking-wider">
                      Initial Capital (XAF)
                    </label>
                    <span className="text-base font-extrabold text-[#002c13] font-mono bg-[#002c13]/5 px-3 py-1 rounded-lg border border-[#002c13]/10">
                      {calcAmount.toLocaleString()} XAF
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="10000000"
                    step="50000"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#e1e3e4] rounded-lg appearance-none cursor-pointer accent-[#002c13]"
                  />
                  <div className="flex justify-between text-[11px] text-[#717970] mt-1 font-mono font-semibold">
                    <span>50,000 XAF</span>
                    <span>5,000,000 XAF</span>
                    <span>10,000,000 XAF</span>
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-extrabold text-[#191c1d] uppercase tracking-wider">
                      Holding Term Horizon
                    </label>
                    <span className="text-base font-extrabold text-[#002c13] font-mono bg-[#002c13]/5 px-3 py-1 rounded-lg border border-[#002c13]/10">
                      {calcMonths} Months ({Math.round((calcMonths / 12) * 10) / 10} yrs)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="36"
                    step="6"
                    value={calcMonths}
                    onChange={(e) => setCalcMonths(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#e1e3e4] rounded-lg appearance-none cursor-pointer accent-[#002c13]"
                  />
                  <div className="flex justify-between text-[11px] text-[#717970] mt-1 font-mono font-semibold">
                    <span>6 Mos</span>
                    <span>12 Mos</span>
                    <span>24 Mos</span>
                    <span>36 Mos</span>
                  </div>
                </div>
              </div>

              {/* Output Bento Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#002c13] via-[#01381b] to-[#002c13] text-white p-7 rounded-3xl border border-[#fed65b]/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#fed65b]/10 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                  <span className="text-[11px] uppercase font-bold text-[#fed65b] tracking-widest">
                    Projected Maturity Portfolio Value
                  </span>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white mt-1.5 font-mono">
                    {estimatedTotal.toLocaleString()} XAF
                  </p>
                  
                  <div className="mt-6 pt-5 border-t border-white/15 space-y-2.5 text-xs">
                    <div className="flex justify-between text-white/80">
                      <span>Initial Principal</span>
                      <span className="font-mono font-bold text-white">{calcAmount.toLocaleString()} XAF</span>
                    </div>
                    <div className="flex justify-between text-[#fed65b] font-bold">
                      <span>Estimated Total Yield (+{activeCalcPlan.projectedReturn}%)</span>
                      <span className="font-mono">+{projectedGain.toLocaleString()} XAF</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Equivalent Monthly Run-Rate</span>
                      <span className="font-mono">~{monthlyPayout.toLocaleString()} XAF / mo</span>
                    </div>
                    <div className="flex justify-between text-white/50 text-[11px] pt-1">
                      <span>Annual Management Fee</span>
                      <span>0.5% (Net factored)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/15">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectPlan(activeCalcPlan)}
                    className="w-full py-4 bg-[#fed65b] text-[#241a00] font-extrabold text-xs rounded-xl hover:bg-[#ffe088] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Lock in {activeCalcPlan.name} Strategy</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </motion.button>
                  <p className="text-[10px] text-white/60 text-center mt-2.5">
                    Projections conform to COSUMAF standard financial modeling guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Investor Case Studies */}
      <section className="py-16 md:py-24 bg-white border-b border-[#c0c9be]/30">
        <div className="max-w-[1240px] mx-auto px-4 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold text-[#735c00] tracking-widest">
              Verified Investor Voices
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002c13] mt-1 font-display">
              Trusted by 1,200+ Leaders in Central Africa
            </h2>
            <p className="text-sm text-[#404941] mt-2">
              Hear directly from verified investors growing their wealth with GrowthFund.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-7 rounded-3xl border border-[#c0c9be]/40 bg-[#f8f9fa] flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={testi.avatar}
                      alt={testi.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#fed65b]"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-[#191c1d]">{testi.name}</h4>
                      <p className="text-xs text-[#717970]">{testi.role}</p>
                      <p className="text-[10px] text-[#002c13] font-bold">{testi.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#404941] leading-relaxed italic mb-6">
                    "{testi.comment}"
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-[#e1e3e4] text-[11px] space-y-1">
                  <div className="flex justify-between text-[#717970]">
                    <span>Allocated Capital:</span>
                    <span className="font-bold text-[#191c1d] font-mono">{testi.amount}</span>
                  </div>
                  <div className="flex justify-between text-[#306a43] font-bold">
                    <span>Performance Realized:</span>
                    <span>{testi.yieldEarned}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Regulatory Safeguards */}
      <section className="py-16 md:py-24 bg-[#002410] text-white border-b border-[#fed65b]/20">
        <div className="max-w-[1240px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#fed65b]/20 border border-[#fed65b]/40 rounded-full px-3.5 py-1 text-xs font-bold text-[#fed65b]">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Quadruple-Layer Capital Protection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Enterprise Bank-Grade Security &amp; Legal Segregation
            </h2>

            <p className="text-sm text-white/80 leading-relaxed">
              Every franc of your capital is isolated from operating funds, safeguarded by military-grade cryptographic encryption, and audited under CEMAC market directives.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#fed65b] text-[#241a00] flex items-center justify-center shrink-0 font-bold">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ring-Fenced Depository Trust Accounts</h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    Assets are held directly in segregated custody with partner commercial banks (Ecobank, Afriland First, UBA).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#fed65b] text-[#241a00] flex items-center justify-center shrink-0 font-bold">
                  <span className="material-symbols-outlined text-[20px]">encrypted</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">256-bit AES &amp; Hardware HSM Keys</h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    End-to-end data encryption in transit and at rest with mandatory multi-signature authorization on all treasury movements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#fed65b] text-[#241a00] flex items-center justify-center shrink-0 font-bold">
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Quarterly Regulatory Compliance Audits</h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    Continuous supervisory reviews under COSUMAF financial market oversight with transparent investor disclosures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white/5 border border-white/15 p-8 rounded-3xl backdrop-blur-md relative">
            <div className="w-16 h-16 rounded-2xl bg-[#fed65b] text-[#002c13] flex items-center justify-center font-bold mb-6 shadow-lg">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="text-xl font-bold text-white">COSUMAF Accredited Asset Manager</h3>
            <p className="text-xs text-white/70 mt-2 leading-relaxed">
              Official License Registration Ref: SGP-04/2023. Authorized to structure and distribute collective investment schemes and fixed-income portfolios across Central Africa.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
                <p className="text-base font-extrabold text-[#fed65b] font-mono">100%</p>
                <p className="text-[10px] text-white/70">Capital Segregation</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
                <p className="text-base font-extrabold text-[#fed65b] font-mono">0.0%</p>
                <p className="text-[10px] text-white/70">Default Rate History</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="py-16 md:py-24 bg-[#f8f9fa] border-b border-[#c0c9be]/30">
        <div className="max-w-[900px] mx-auto px-4 md:px-12">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-extrabold text-[#735c00] tracking-widest">
              Investor Clarity
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002c13] mt-1 font-display">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#c0c9be]/40 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-sm text-[#191c1d] hover:text-[#002c13]"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-[#717970] transition-transform duration-200">
                    {activeFaq === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#404941] leading-relaxed border-t border-[#f0f2f3] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002c13] text-white w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-12 py-14 w-full max-w-[1240px] mx-auto">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <GrowthFundLogo size="md" variant="white" showTagline />
            <p className="text-xs text-white/70 max-w-md leading-relaxed">
              © 2026 GrowthFund (GrowthFund CEMAC SAS). Regulated by COSUMAF (Commission de Surveillance du Marché Financier de l'Afrique Centrale). All investments carry market risk. Base currency: XAF (FCFA).
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#fed65b]">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">lock</span> 256-Bit SSL</span>
              <span>•</span>
              <span>BEAC Interbank Cleared</span>
              <span>•</span>
              <span>COSUMAF Tier 1 Depository</span>
            </div>
          </div>

          <div className="col-span-1">
            <h5 className="text-xs uppercase font-extrabold text-[#fed65b] mb-4 tracking-widest">Platform &amp; Legal</h5>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white hover:underline">
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white hover:underline">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('fees')} className="hover:text-white hover:underline">
                  Fee Schedule (0.5% Net)
                </button>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h5 className="text-xs uppercase font-extrabold text-[#fed65b] mb-4 tracking-widest">Compliance</h5>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <button onClick={() => onOpenLegal('kyc')} className="hover:text-white hover:underline">
                  KYC &amp; AML Policy (CEMAC)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('risk')} className="hover:text-white hover:underline">
                  Risk Disclosure Prospectus
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('cosumaf')} className="hover:text-white hover:underline">
                  COSUMAF License Ref SGP-04
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

