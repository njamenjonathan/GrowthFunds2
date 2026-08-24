interface SignedOutNoticeProps {
  onLogin: () => void;
  onRegister: () => void;
  onExplorePlans: () => void;
}

/**
 * Shown when a signed-out visitor lands on a private view. Previously these
 * routes rendered nothing at all, leaving a blank page after sign-out.
 */
export const SignedOutNotice: React.FC<SignedOutNoticeProps> = ({
  onLogin,
  onRegister,
  onExplorePlans,
}) => (
  <div className="flex-1 flex items-center justify-center p-6 bg-canvas">
    <div className="max-w-md w-full text-center bg-surface border border-line rounded-2xl p-8 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-emerald text-gold flex items-center justify-center mx-auto mb-5">
        <span aria-hidden="true" className="material-symbols-outlined text-[28px]">lock</span>
      </div>
      <h1 className="text-xl font-extrabold text-ink">Sign in to view your portfolio</h1>
      <p className="text-sm text-ink-2 mt-2 leading-relaxed">
        Your balances, transactions and security settings are only available once you're signed in to
        your GrowthFund account.
      </p>
      <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
        <button
          onClick={onLogin}
          className="flex-1 py-3 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors"
        >
          Sign in
        </button>
        <button
          onClick={onRegister}
          className="flex-1 py-3 border border-line text-ink rounded-xl text-xs font-bold hover:bg-surface-2 transition-colors"
        >
          Create an account
        </button>
      </div>
      <button onClick={onExplorePlans} className="mt-4 text-xs font-semibold text-accent hover:underline">
        Or browse investment plans first
      </button>
    </div>
  </div>
);
