import { useState } from 'react';
import { PageBackdrop } from './PageBackdrop';
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


const EmptyState: React.FC<{ icon: string; title: string; body: string }> = ({ icon, title, body }) => (
  <div className="p-12 text-center">
    <span aria-hidden="true" className="material-symbols-outlined text-3xl text-ink-3">{icon}</span>
    <p className="text-sm font-bold text-ink mt-2">{title}</p>
    <p className="text-xs text-ink-3 mt-1">{body}</p>
  </div>
);

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
    <div className="flex-1 p-4 md:p-10 bg-canvas relative">
      <PageBackdrop pair="fan" />

      <div className="max-w-[1200px] mx-auto w-full relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-2xl border border-line/40 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald text-gold rounded-lg">
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-accent">Manager &amp; Compliance Portal</h2>
            </div>
            <p className="text-xs text-ink-3 mt-1">
              COSUMAF Supervisory Console • Real-time Liquidity &amp; Risk Oversight
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pos-bg text-on-pos-bg">
              <span className="w-2 h-2 rounded-full bg-pos animate-pulse"></span>
              BEAC RTGS Gateway: Active
            </span>
          </div>
        </div>

        {/* Top 4 KPI Metrics (Matching Image 8) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total AUM */}
          <div className="bg-surface p-5 rounded-xl border border-line/30 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Total AUM Managed
            </span>
            <p className="text-2xl font-extrabold text-accent font-mono mt-1">45,250,000 XAF</p>
            <p className="text-xs text-pos font-semibold mt-1 flex items-center gap-1">
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">trending_up</span> Up on last month
            </p>
          </div>

          {/* Total Users */}
          <div className="bg-surface p-5 rounded-xl border border-line/30 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Verified Investors
            </span>
            <p className="text-2xl font-extrabold text-ink font-mono mt-1">1,248 Users</p>
            <p className="text-xs text-ink-3 mt-1">982 with Active Capital</p>
          </div>

          {/* Pending KYC */}
          <div className="bg-surface p-5 rounded-xl border border-line/30 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Pending KYC Queue
            </span>
            <p className="text-2xl font-extrabold text-gold-ink font-mono mt-1">{kycList.filter(k => k.status === 'PENDING').length} Reviews</p>
            <p className="text-xs text-ink-3 mt-1">Avg turnaround 18 mins</p>
          </div>

          {/* Pending Withdrawals */}
          <div className="bg-surface p-5 rounded-xl border border-line/30 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Pending Withdrawals
            </span>
            <p className="text-2xl font-extrabold text-neg font-mono mt-1">
              {withdrawals.filter(w => w.status === 'PENDING').length} Batches
            </p>
            <p className="text-xs text-ink-3 mt-1">Interbank settlement queue</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-line-2 pb-2 overflow-x-auto">
          {([
            { id: 'deposits', label: 'Deposits', icon: 'arrow_downward', badge: deposits.filter((d) => d.status === 'PENDING').length },
            { id: 'withdrawals', label: 'Withdrawals', icon: 'outbox', badge: withdrawals.filter((w) => w.status === 'PENDING').length },
            { id: 'kyc', label: 'KYC queue', icon: 'verified_user', badge: kycList.filter((k) => k.status === 'PENDING').length },
            { id: 'audit', label: 'Audit trail', icon: 'security', badge: 0 },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald text-on-emerald shadow-xs'
                  : 'bg-surface text-ink-3 hover:bg-surface-2 hover:text-ink border border-line/40'
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="bg-gold text-on-gold text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Deposits Table (Matching Image 8) */}
        {activeTab === 'deposits' && (
          <div className="bg-surface rounded-2xl border border-line/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-line-2">
              <h3 className="text-base font-bold text-accent">Mobile &amp; Bank Inflow Authorizations</h3>
            </div>
            {deposits.length === 0 ? (
              <EmptyState icon="inbox" title="No deposits" body="Inbound payments will appear here as they clear." />
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-2 border-b border-line-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
                    <th className="p-4">Investor</th>
                    <th className="p-4">Amount (XAF)</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2">
                  {deposits.map((dp) => (
                    <tr key={dp.id} className="hover:bg-surface-2">
                      <td className="p-4 font-bold text-ink">{dp.user}</td>
                      <td className="p-4 font-mono font-bold text-accent">+{dp.amount.toLocaleString()} XAF</td>
                      <td className="p-4 text-ink-3">{dp.method}</td>
                      <td className="p-4 text-ink-3">{dp.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            dp.status === 'APPROVED'
                              ? 'bg-pos-bg text-on-pos-bg'
                              : dp.status === 'PENDING'
                              ? 'bg-gold text-on-gold'
                              : 'bg-neg-bg text-neg'
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
                              className="bg-emerald text-on-emerald px-2.5 py-1 rounded text-[11px] font-bold hover:bg-emerald-2"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectDeposit(dp.id)}
                              className="bg-danger text-on-danger px-2.5 py-1 rounded text-[11px] font-bold hover:bg-danger-hover transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-ink-3 text-[11px]">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* Tab 2: Withdrawals Table (Matching Image 8) */}
        {activeTab === 'withdrawals' && (
          <div className="bg-surface rounded-2xl border border-line/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-line-2">
              <h3 className="text-base font-bold text-accent">Withdrawal Payout Authorizations</h3>
            </div>
            {withdrawals.length === 0 ? (
              <EmptyState icon="outbox" title="No withdrawal requests" body="Payout requests awaiting authorisation will appear here." />
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-2 border-b border-line-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
                    <th className="p-4">Investor</th>
                    <th className="p-4">Amount (XAF)</th>
                    <th className="p-4">Payout Method</th>
                    <th className="p-4">Destination Account</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2">
                  {withdrawals.map((wd) => (
                    <tr key={wd.id} className="hover:bg-surface-2">
                      <td className="p-4 font-bold text-ink">{wd.user}</td>
                      <td className="p-4 font-mono font-bold text-neg">-{wd.amount.toLocaleString()} XAF</td>
                      <td className="p-4 text-ink-3">{wd.method}</td>
                      <td className="p-4 font-mono text-ink-3">{wd.account}</td>
                      <td className="p-4 text-ink-3">{wd.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            wd.status === 'APPROVED'
                              ? 'bg-pos-bg text-on-pos-bg'
                              : wd.status === 'PENDING'
                              ? 'bg-gold text-on-gold'
                              : 'bg-neg-bg text-neg'
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
                              className="bg-emerald text-on-emerald px-2.5 py-1 rounded text-[11px] font-bold hover:bg-emerald-2"
                            >
                              Authorize
                            </button>
                            <button
                              onClick={() => onRejectWithdrawal(wd.id)}
                              className="bg-danger text-on-danger px-2.5 py-1 rounded text-[11px] font-bold hover:bg-danger-hover transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-ink-3 text-[11px]">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* Tab 3: KYC Queue */}
        {activeTab === 'kyc' && (
          <div className="bg-surface rounded-2xl border border-line/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-line-2">
              <h3 className="text-base font-bold text-accent">CEMAC Identification Verification Queue</h3>
            </div>
            {kycList.length === 0 ? (
              <EmptyState icon="task_alt" title="Queue clear" body="Every identity submission has been reviewed." />
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-2 border-b border-line-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Document Type</th>
                    <th className="p-4">Document Number</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2">
                  {kycList.map((k) => (
                    <tr key={k.id} className="hover:bg-surface-2">
                      <td className="p-4">
                        <p className="font-bold text-ink">{k.user}</p>
                        <p className="text-[11px] text-ink-3">{k.email}</p>
                      </td>
                      <td className="p-4 text-ink font-semibold">{k.country}</td>
                      <td className="p-4 text-ink-3">{k.docType}</td>
                      <td className="p-4 font-mono font-bold text-accent">{k.docNumber}</td>
                      <td className="p-4 text-ink-3">{k.submittedAt}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApproveKyc(k.id)}
                            className="bg-emerald text-on-emerald px-2.5 py-1 rounded text-[11px] font-bold hover:bg-emerald-2"
                          >
                            Verify Tier 2
                          </button>
                          <button
                            onClick={() => onRejectKyc(k.id)}
                            className="bg-danger text-on-danger px-2.5 py-1 rounded text-[11px] font-bold hover:bg-danger-hover transition-colors"
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
            )}
          </div>
        )}

        {/* Tab 4: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="bg-surface rounded-2xl border border-line/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-line-2">
              <h3 className="text-base font-bold text-accent">COSUMAF Compliance &amp; Security Audit Log</h3>
            </div>
            {auditLogs.length === 0 ? (
              <EmptyState icon="security" title="No audit entries" body="Platform activity will be logged here." />
            ) : (
            <div className="divide-y divide-line-2 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-surface-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-accent">{log.action}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono font-bold text-[9px] ${
                          log.status === 'SUCCESS'
                            ? 'bg-pos-bg text-on-pos-bg'
                            : log.status === 'WARN'
                            ? 'bg-gold text-on-gold'
                            : 'bg-neg-bg text-on-neg-bg'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-3 mt-0.5">
                      Actor: <strong className="text-ink">{log.actor}</strong> • Target: {log.target}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-ink-3 font-mono">
                    <p>{log.timestamp}</p>
                    <p>{log.ipAddress}</p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
