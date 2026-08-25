import { useState } from 'react';
import { UserProfile } from '../types';
import { Modal, ModalHeader } from './Modal';

interface KycVerificationModalProps {
  user: UserProfile;
  onClose: () => void;
  onKycComplete: (updatedFields: Partial<UserProfile>) => void;
}

type DocType = 'National ID' | 'Passport' | 'Driver License' | 'Resident Permit';

const DOC_TYPES: DocType[] = ['National ID', 'Passport', 'Driver License', 'Resident Permit'];

const COUNTRIES = [
  'Cameroon',
  'Gabon',
  'Congo',
  'Chad',
  'Central African Republic',
  'Equatorial Guinea',
];

const STEPS = ['Personal', 'Document', 'Biometric', 'Status'];

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({
  user,
  onClose,
  onKycComplete,
}) => {
  const [step, setStep] = useState(user.kycStatus === 'verified' ? 4 : 1);
  const [fullName, setFullName] = useState(user.name);
  const [country, setCountry] = useState(user.country);
  const [dob, setDob] = useState('');
  const [docType, setDocType] = useState<DocType>(user.idDocumentType ?? 'National ID');
  const [docNumber, setDocNumber] = useState(user.idNumber ?? '');
  const [expiryDate, setExpiryDate] = useState(user.expiryDate ?? '');
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const goToDocument = () => {
    if (!fullName.trim()) {
      setErrorMsg('Enter your full legal name as it appears on your ID.');
      return;
    }
    if (!dob) {
      setErrorMsg('Enter your date of birth.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const goToBiometric = () => {
    if (!docNumber.trim()) {
      setErrorMsg('Enter your document number.');
      return;
    }
    if (!documentName) {
      setErrorMsg('Attach a scan of your identity document.');
      return;
    }
    setErrorMsg(null);
    setStep(3);
  };

  const handleSubmitKyc = () => {
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      // The personal details captured in step 1 are now saved too; previously
      // only the document fields were persisted and name/country were dropped.
      onKycComplete({
        name: fullName.trim(),
        country,
        kycStatus: 'verified',
        idDocumentType: docType,
        idNumber: docNumber.trim(),
        expiryDate,
      });
      setStep(4);
    }, 1200);
  };

  const field = 'w-full px-3.5 py-2.5 rounded-xl border border-line text-xs font-semibold focus:border-accent outline-none';
  const label = 'block text-xs font-bold uppercase text-ink mb-1.5';

  return (
    <Modal onClose={onClose} size="max-w-xl" label="Identity verification">
      <ModalHeader
        icon="verified_user"
        title="Identity verification"
        subtitle="Required before you invest or withdraw"
        onClose={onClose}
      />

      {/* Progress */}
      <div className="px-6 pt-4 pb-3 shrink-0">
        <ol className="flex items-center justify-between text-[11px] font-bold mb-2">
          {STEPS.map((name, index) => (
            <li key={name} className={step >= index + 1 ? 'text-accent' : 'text-ink-3'}>
              {index + 1}. {name}
            </li>
          ))}
        </ol>
        <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6 pt-2 overflow-y-auto flex-1 space-y-4">
        {errorMsg && step < 4 && (
          <p role="alert" className="p-3 rounded-lg bg-neg-bg text-on-neg-bg text-xs font-medium flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined text-sm">error</span>
            {errorMsg}
          </p>
        )}

        {step === 1 && (
          <>
            <div>
              <label htmlFor="kyc-name" className={label}>
                Full legal name
              </label>
              <input
                id="kyc-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="As printed on your official ID"
                className={field}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="kyc-country" className={label}>
                  Country of residence
                </label>
                <select id="kyc-country" value={country} onChange={(e) => setCountry(e.target.value)} className={field}>
                  {COUNTRIES.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="kyc-dob" className={label}>
                  Date of birth
                </label>
                <input
                  id="kyc-dob"
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDob(e.target.value)}
                  className={field}
                />
              </div>
            </div>

            <div className="p-3.5 bg-accent-bg rounded-xl border border-accent/20 text-xs text-ink-2">
              <p className="font-bold text-accent flex items-center gap-1.5">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">lock</span>
                Why we ask
              </p>
              <p className="mt-1">
                CEMAC anti-money-laundering rules require verified identity on every account that holds capital.
              </p>
            </div>

            <button
              onClick={goToDocument}
              className="w-full py-3 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2 gf-press"
            >
              Continue
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <fieldset>
              <legend className={label}>Document type</legend>
              <div className="grid grid-cols-2 gap-2">
                {DOC_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      docType === type ? 'border-accent bg-accent-bg text-accent' : 'border-line text-ink-3 hover:bg-surface-2'
                    }`}
                  >
                    <input
                      type="radio"
                      name="kyc-doc-type"
                      value={type}
                      checked={docType === type}
                      onChange={() => setDocType(type)}
                      className="sr-only"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="kyc-doc-number" className={label}>
                  Document number
                </label>
                <input
                  id="kyc-doc-number"
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="CM-00000000-0000"
                  className={`${field} font-mono`}
                />
              </div>
              <div>
                <label htmlFor="kyc-expiry" className={label}>
                  Expiry date
                </label>
                <input
                  id="kyc-expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={field}
                />
              </div>
            </div>

            <div>
              <label htmlFor="kyc-upload" className={label}>
                Scan of your document
              </label>
              <label
                htmlFor="kyc-upload"
                className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  documentName ? 'border-pos bg-pos-bg/40' : 'border-accent/40 bg-surface-2 hover:bg-accent-bg'
                }`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-3xl text-accent">
                  {documentName ? 'check_circle' : 'cloud_upload'}
                </span>
                <span className="block text-xs font-bold text-ink mt-1 break-all">
                  {documentName ?? 'Choose a file or drop it here'}
                </span>
                <span className="block text-[10px] text-ink-3">JPG, PNG or PDF, up to 10 MB</span>
              </label>
              <input
                id="kyc-upload"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="sr-only"
                onChange={(e) => setDocumentName(e.target.files?.[0]?.name ?? null)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-line text-ink rounded-xl text-xs font-bold hover:bg-surface-2 transition-colors"
              >
                Back
              </button>
              <button
                onClick={goToBiometric}
                className="flex-1 py-3 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2 gf-press"
              >
                Continue
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-24 h-24 rounded-full border-4 border-pos mx-auto overflow-hidden">
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="text-base font-bold text-accent">Facial match</h3>
              <p className="text-xs text-ink-2 max-w-sm mx-auto mt-1 leading-relaxed">
                Your selfie is compared against the photo on your identity document.
              </p>
            </div>

            <p className="bg-pos-bg p-3 rounded-xl border border-pos/20 text-xs text-on-pos-bg font-bold">
              Liveness check passed
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-line text-ink rounded-xl text-xs font-bold hover:bg-surface-2 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitKyc}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 gf-press"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Verifying…
                  </>
                ) : (
                  <>
                    Submit for verification
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">check_circle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-pos-bg text-on-pos-bg rounded-full flex items-center justify-center mx-auto">
              <span aria-hidden="true" className="material-symbols-outlined text-3xl">verified</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-accent">Identity verified — Tier 2</h3>
              <p className="text-xs text-ink-2 max-w-sm mx-auto mt-1 leading-relaxed">
                Verified under COSUMAF regulation SGP-04/2023. You now have full access to deposits, investments and
                withdrawals.
              </p>
            </div>

            <dl className="bg-surface-2 p-4 rounded-xl border border-line-2 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Tier</dt>
                <dd className="font-bold text-accent">Tier 2 (full access)</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Daily withdrawal limit</dt>
                <dd className="font-mono font-bold text-ink">10,000,000 XAF</dd>
              </div>
              {docNumber && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-3">Document</dt>
                  <dd className="font-mono text-ink text-right">
                    {docType} ({docNumber})
                  </dd>
                </div>
              )}
            </dl>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors gf-press"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
