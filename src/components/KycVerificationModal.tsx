import React, { useState } from 'react';
import { UserProfile } from '../types';

interface KycVerificationModalProps {
  user: UserProfile;
  onClose: () => void;
  onKycComplete: (updatedFields: Partial<UserProfile>) => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({
  user,
  onClose,
  onKycComplete,
}) => {
  const [step, setStep] = useState<number>(user.kycStatus === 'verified' ? 4 : 1);
  const [fullName, setFullName] = useState(user.name || 'Samuel E. Nguema');
  const [country, setCountry] = useState(user.country || 'Cameroon');
  const [dob, setDob] = useState('1988-04-12');
  const [docType, setDocType] = useState<'National ID' | 'Passport' | 'Driver License' | 'Resident Permit'>('National ID');
  const [docNumber, setDocNumber] = useState('CM-10928374-2024');
  const [expiryDate, setExpiryDate] = useState('2029-11-15');
  const [fileUploaded, setFileUploaded] = useState(true);
  const [selfieTaken, setSelfieTaken] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitKyc = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onKycComplete({
        kycStatus: 'verified',
        kycTier: 2,
        idDocumentType: docType,
        idNumber: docNumber,
        expiryDate: expiryDate,
      });
      setStep(4);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#c0c9be]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#e1e3e4] flex justify-between items-center bg-[#f8f9fa]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#002c13] text-[#fed65b] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#002c13]">Identity Verification (KYC)</h3>
              <p className="text-xs text-[#717970]">COSUMAF Tier 2 Compliance Standard</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#717970] hover:text-[#191c1d] rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 pt-4 pb-2 bg-white">
          <div className="flex items-center justify-between text-xs font-bold text-[#717970] mb-2">
            <span className={step >= 1 ? 'text-[#002c13]' : ''}>1. Personal</span>
            <span className={step >= 2 ? 'text-[#002c13]' : ''}>2. Document</span>
            <span className={step >= 3 ? 'text-[#002c13]' : ''}>3. Biometric</span>
            <span className={step >= 4 ? 'text-[#002c13]' : ''}>4. Status</span>
          </div>
          <div className="w-full h-1.5 bg-[#e1e3e4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#002c13] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                  Full Legal Name (as in Official ID)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c0c9be] text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                    CEMAC Country of Residence
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-semibold"
                  >
                    <option>Cameroon</option>
                    <option>Gabon</option>
                    <option>Congo</option>
                    <option>Chad</option>
                    <option>Central African Republic</option>
                    <option>Equatorial Guinea</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#002c13]/5 rounded-xl border border-[#002c13]/15 text-xs text-[#404941]">
                <p className="font-bold text-[#002c13] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">lock</span> Why is this required?
                </p>
                <p className="mt-0.5">
                  CEMAC anti-money laundering regulations require verified identity for all capital deposit accounts.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] flex items-center justify-center gap-2"
              >
                <span>Proceed to ID Document</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                  Document Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['National ID', 'Passport', 'Driver License', 'Resident Permit'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDocType(t)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left ${
                        docType === t
                          ? 'border-[#002c13] bg-[#002c13]/5 text-[#002c13]'
                          : 'border-[#c0c9be]/50 text-[#717970]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                    Document / Card #
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                  Front &amp; Back Scan of ID
                </label>
                <div
                  onClick={() => setFileUploaded(true)}
                  className="border-2 border-dashed border-[#002c13]/40 rounded-xl p-6 text-center bg-[#f8f9fa] hover:bg-[#002c13]/5 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-3xl text-[#002c13]">cloud_upload</span>
                  <p className="text-xs font-bold text-[#191c1d] mt-1">
                    {fileUploaded ? 'ID_Document_Scan_CM.pdf (Uploaded)' : 'Click or Drag & Drop Document'}
                  </p>
                  <p className="text-[10px] text-[#717970]">JPG, PNG, or PDF up to 10MB</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-[#c0c9be] text-[#191c1d] rounded-xl text-xs font-bold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] flex items-center justify-center gap-2"
                >
                  <span>Continue to Biometrics</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="w-24 h-24 rounded-full border-4 border-[#306a43] mx-auto overflow-hidden relative shadow-md">
                <img
                  src={user.avatarUrl}
                  alt="Biometric face"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#002c13]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-3xl">face</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#002c13]">Facial Match Verification</h4>
                <p className="text-xs text-[#404941] max-w-sm mx-auto mt-1">
                  Biometric matching against government identity record database with 98.4% confidence score.
                </p>
              </div>

              <div className="bg-[#b2f1bf]/40 p-3 rounded-xl border border-[#306a43]/20 text-xs text-[#14512d] font-bold">
                Biometric Liveness Check: PASSED
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-[#c0c9be] text-[#191c1d] rounded-xl text-xs font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitKyc}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] flex items-center justify-center gap-2 shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Verifying with COSUMAF...</span>
                  ) : (
                    <>
                      <span>Submit &amp; Verify Tier 2</span>
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-[#b2f1bf] text-[#002c13] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#002c13]">Identity Verified (Tier 2)</h4>
                <p className="text-xs text-[#404941] max-w-sm mx-auto mt-1">
                  Your identity has been authenticated in accordance with COSUMAF Regulation SGP-04/2023.
                </p>
              </div>

              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4] text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#717970]">Verification Tier</span>
                  <span className="font-bold text-[#002c13]">Tier 2 (Full Access)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Daily Withdrawal Limit</span>
                  <span className="font-mono font-bold text-[#191c1d]">10,000,000 XAF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Audited ID Document</span>
                  <span className="font-mono text-[#191c1d]">{docType} ({docNumber})</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421]"
              >
                Close &amp; Continue Investing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
