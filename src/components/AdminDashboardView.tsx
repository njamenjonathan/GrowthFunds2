import React, { useState } from 'react';
import { AuditLog } from '../types';

interface AdminDashboardViewProps {
  deposits: { id: string; user: string; amount: number; status: 'APPROVED' | 'PENDING' | 'REJECTED'; date: string; method: string }[];
  withdrawals: { id: string; user: string; amount: number; status: 'PENDING' | 'REJECTED' | 'APPROVED'; date: string; method: string; account: string }[];
  kycList: { id: string; user: string; email: string; country: string; docType: string; docNumber: string; submittedAt: string; status: string }[];
  auditLogs: AuditLog[];
  onApproveDeposit: (id: string) => void;
  onRejectDeposit: (id: string) => void;
  onApproveWithdrawal: (id: string) => void;
  onRejectWithdrawal: (id: string) => void;
  onApproveKyc: (id: string) => void;
  onRejectKyc: (id: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  deposits,
  withdrawals,
  kycList,
  auditLogs,
  onApproveDeposit,
  onRejectDeposit,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onApproveKyc,
  onRejectKyc,
}) => {
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'kyc' | 'audit'>('deposits');

  return (
    <div className="flex-1 p-4 md:p-12 bg-[#f8f9fa] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none pattern-bg"></div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#c0c9be]/40 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#002c13] text-[#fed65b] rounded-lg">
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#002c13]">Manager &amp; Compliance Portal</h2>
            </div>
            <p className="text-xs text-[#717970] mt-1">
              COSUMAF Supervisory Console • Real-time Liquidity &amp; Risk Oversight
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#b2f1bf] text-[#14512d]">
              <span className="w-2 h-2 rounded-full bg-[#306a43] animate-pulse"></span>
              BEAC RTGS Gateway: Active
            </span>
          </div>
        </div>

        {/* Top 4 KPI Metrics (Matching Image 8) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total AUM */}
          <div className="bg-white p-5 rounded-xl border border-[#c0c9be]/30 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717970]">
              Total AUM Managed
            </span>
            <p className="text-2xl font-extrabold text-[#002c13] font-mono mt-1">45,250,000 XAF</p>
            <p className="text-xs text-[#306a43] font-semibold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +18.4% MoM
            </p>
          </div>

          {/* Total Users */}
          <div className="bg-white p-5 rounded-xl border border-[#c0c9be]/30 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717970]">
              Verified Investors
            </span>
            <p className="text-2xl font-extrabold text-[#191c1d] font-mono mt-1">1,248 Users</p>
            <p className="text-xs text-[#717970] mt-1">982 with Active Capital</p>
          </div>

          {/* Pending KYC */}
          <div className="bg-white p-5 rounded-xl border border-[#c0c9be]/30 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717970]">
              Pending KYC Queue
            </span>
            <p className="text-2xl font-extrabold text-[#735c00] font-mono mt-1">{kycList.filter(k => k.status === 'PENDING').length} Reviews</p>
            <p className="text-xs text-[#717970] mt-1">Avg turnaround 18 mins</p>
          </div>

          {/* Pending Withdrawals */}
          <div className="bg-white p-5 rounded-xl border border-[#c0c9be]/30 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717970]">
              Pending Withdrawals
            </span>
            <p className="text-2xl font-extrabold text-[#ba1a1a] font-mono mt-1">
              {withdrawals.filter(w => w.status === 'PENDING').length} Batches
            </p>
            <p className="text-xs text-[#717970] mt-1">Interbank settlement queue</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#e1e3e4] pb-2 overflow-x-auto">
          {[
            { id: 'deposits', label: 'Recent Deposits', icon: 'arrow_downward', badge: deposits.filter(d => d.status === 'PENDING').length },
            { id: 'withdrawals', label: 'Withdrawal Requests', icon: 'outbox', badge: withdrawals.filter(w => w.status === 'PENDING').length },
            { id: 'kyc', label: 'KYC Verifications', icon: 'verified_user', badge: kycList.filter(k => k.status === 'PENDING').length },
            { id: 'audit', label: 'Audit Trail', icon: 'security', badge: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#002c13] text-white shadow-xs'
                  : 'bg-white text-[#717970] hover:bg-[#f3f4f5] hover:text-[#191c1d] border border-[#c0c9be]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="bg-[#fed65b] text-[#745c00] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Deposits Table (Matching Image 8) */}
        {activeTab === 'deposits' && (
          <div className="bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#e1e3e4]">
              <h3 className="text-base font-bold text-[#002c13]">Mobile &amp; Bank Inflow Authorizations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[11px] font-bold uppercase tracking-wider text-[#717970]">
                    <th className="p-4">Investor</th>
                    <th className="p-4">Amount (XAF)</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e4]">
                  {deposits.map((dp) => (
                    <tr key={dp.id} className="hover:bg-[#f8f9fa]">
                      <td className="p-4 font-bold text-[#191c1d]">{dp.user}</td>
                      <td className="p-4 font-mono font-bold text-[#002c13]">+{dp.amount.toLocaleString()} XAF</td>
                      <td className="p-4 text-[#717970]">{dp.method}</td>
                      <td className="p-4 text-[#717970]">{dp.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            dp.status === 'APPROVED'
                              ? 'bg-[#b2f1bf] text-[#14512d]'
                              : dp.status === 'PENDING'
                              ? 'bg-[#fed65b] text-[#745c00]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}
                        >
                          {dp.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {dp.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onApproveDeposit(dp.id)}
                              className="bg-[#002c13] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#014421]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectDeposit(dp.id)}
                              className="bg-[#ba1a1a] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#93000a]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#717970] text-[11px]">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Withdrawals Table (Matching Image 8) */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#e1e3e4]">
              <h3 className="text-base font-bold text-[#002c13]">Withdrawal Payout Authorizations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[11px] font-bold uppercase tracking-wider text-[#717970]">
                    <th className="p-4">Investor</th>
                    <th className="p-4">Amount (XAF)</th>
                    <th className="p-4">Payout Method</th>
                    <th className="p-4">Destination Account</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e4]">
                  {withdrawals.map((wd) => (
                    <tr key={wd.id} className="hover:bg-[#f8f9fa]">
                      <td className="p-4 font-bold text-[#191c1d]">{wd.user}</td>
                      <td className="p-4 font-mono font-bold text-[#ba1a1a]">-{wd.amount.toLocaleString()} XAF</td>
                      <td className="p-4 text-[#717970]">{wd.method}</td>
                      <td className="p-4 font-mono text-[#717970]">{wd.account}</td>
                      <td className="p-4 text-[#717970]">{wd.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            wd.status === 'APPROVED'
                              ? 'bg-[#b2f1bf] text-[#14512d]'
                              : wd.status === 'PENDING'
                              ? 'bg-[#fed65b] text-[#745c00]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}
                        >
                          {wd.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {wd.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onApproveWithdrawal(wd.id)}
                              className="bg-[#002c13] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#014421]"
                            >
                              Authorize
                            </button>
                            <button
                              onClick={() => onRejectWithdrawal(wd.id)}
                              className="bg-[#ba1a1a] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#93000a]"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#717970] text-[11px]">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: KYC Queue */}
        {activeTab === 'kyc' && (
          <div className="bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#e1e3e4]">
              <h3 className="text-base font-bold text-[#002c13]">CEMAC Identification Verification Queue</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[11px] font-bold uppercase tracking-wider text-[#717970]">
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Document Type</th>
                    <th className="p-4">Document Number</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e4]">
                  {kycList.map((k) => (
                    <tr key={k.id} className="hover:bg-[#f8f9fa]">
                      <td className="p-4">
                        <p className="font-bold text-[#191c1d]">{k.user}</p>
                        <p className="text-[11px] text-[#717970]">{k.email}</p>
                      </td>
                      <td className="p-4 text-[#191c1d] font-semibold">{k.country}</td>
                      <td className="p-4 text-[#717970]">{k.docType}</td>
                      <td className="p-4 font-mono font-bold text-[#002c13]">{k.docNumber}</td>
                      <td className="p-4 text-[#717970]">{k.submittedAt}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApproveKyc(k.id)}
                            className="bg-[#002c13] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#014421]"
                          >
                            Verify Tier 2
                          </button>
                          <button
                            onClick={() => onRejectKyc(k.id)}
                            className="bg-[#ba1a1a] text-white px-2.5 py-1 rounded text-[11px] font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#e1e3e4]">
              <h3 className="text-base font-bold text-[#002c13]">COSUMAF Compliance &amp; Security Audit Log</h3>
            </div>
            <div className="divide-y divide-[#e1e3e4] text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-[#f8f9fa]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#002c13]">{log.action}</span>
                      <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[9px] bg-[#b2f1bf] text-[#14512d]">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#717970] mt-0.5">
                      Actor: <strong className="text-[#191c1d]">{log.actor}</strong> • Target: {log.target}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-[#717970] font-mono">
                    <p>{log.timestamp}</p>
                    <p>{log.ipAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
