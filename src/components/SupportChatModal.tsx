import { useEffect, useRef, useState } from 'react';
import { Modal, ModalHeader } from './Modal';

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
}

interface SupportChatModalProps {
  onClose: () => void;
}

const QUICK_QUESTIONS = [
  'How do I deposit with MTN MoMo or Orange Money?',
  'Are returns guaranteed?',
  'What is the minimum lock-up period?',
  'How do withdrawals reach my bank?',
];

/** Keyword-matched canned replies, checked in order. */
const REPLIES: { match: string[]; reply: string }[] = [
  {
    match: ['deposit', 'momo', 'orange', 'fund'],
    reply:
      'You can deposit in XAF instantly with MTN Mobile Money, Orange Money, Express Union Mobile, or a bank transfer from Afriland, BGFIBank, Ecobank, UBA or Société Générale. Mobile deposits are credited within seconds of you approving the USSD prompt.',
  },
  {
    match: ['guarantee', 'cosumaf', 'risk', 'safe'],
    reply:
      'Under COSUMAF rules no platform may promise guaranteed returns. Our projections (6.5%–18%) are actuarial estimates based on real underlying assets — agricultural cooperatives, commercial real estate and treasury bills — and all capital risk disclosures are audited quarterly.',
  },
  {
    match: ['withdraw', 'payout', 'cash out'],
    reply:
      'Withdrawals go back to your verified mobile money wallet or CEMAC bank account. Mobile payouts are near-instant, interbank transfers take 1–2 hours, and the fee is a flat 250 XAF.',
  },
  {
    match: ['lockup', 'lock-up', 'duration', 'term', 'maturity'],
    reply:
      'Terms run from 6 months on the CEMAC Sovereign Bond Fund up to 24 months on the Real Estate Fund. Quarterly dividends are paid into your available balance during the term.',
  },
  {
    match: ['kyc', 'verify', 'identity', 'document'],
    reply:
      'Tier 1 needs your mobile number and basic ID (up to 1,000,000 XAF). Tier 2 adds a government ID scan and a selfie liveness check, raising your limit to 10,000,000 XAF. Verification usually completes in under 20 minutes.',
  },
];

const FALLBACK =
  'Thanks for getting in touch. A GrowthFund advisor will follow up shortly. In the meantime you can check your KYC status or deposit history from your portfolio.';

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'support',
      text: 'Hello — welcome to the GrowthFund helpdesk. How can I help with your portfolio today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: `msg_${Date.now()}`, sender: 'user', text }]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    const lower = text.toLowerCase();
    const matched = REPLIES.find((entry) => entry.match.some((keyword) => lower.includes(keyword)));

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `rep_${Date.now()}`, sender: 'support', text: matched?.reply ?? FALLBACK },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <Modal onClose={onClose} label="Support chat" className="h-[600px]">
      <ModalHeader
        icon="support_agent"
        title="GrowthFund advisory"
        subtitle="Online · regulated advisor"
        onClose={onClose}
        tone="brand"
      />

      <div ref={threadRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-2 text-xs">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                message.sender === 'user'
                  ? 'bg-emerald text-on-emerald rounded-tr-sm'
                  : 'bg-surface text-ink border border-line rounded-tl-sm'
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start" aria-label="Advisor is typing">
            <div className="bg-surface border border-line p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.3s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-2.5 bg-surface border-t border-line-2 flex items-center gap-1.5 overflow-x-auto hide-scrollbar shrink-0">
        {QUICK_QUESTIONS.map((question) => (
          <button
            key={question}
            onClick={() => handleSendMessage(question)}
            className="px-3 py-1.5 rounded-full bg-surface-2 hover:bg-surface-3 text-accent text-[11px] font-semibold whitespace-nowrap border border-line transition-colors"
          >
            {question}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-surface border-t border-line-2 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          aria-label="Message"
          placeholder="Ask a question…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs border border-line rounded-xl focus:border-accent outline-none"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="p-2.5 bg-emerald text-on-emerald rounded-xl hover:bg-emerald-2 transition-colors flex items-center justify-center"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </Modal>
  );
};
