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
  'How long does an investment run?',
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
      'No platform may promise guaranteed returns, and we do not. The profit shown on a package is the target it is built to pay from real assets — farm cooperatives, building sites, treasury bills — and every risk disclosure is audited quarterly.',
  },
  {
    match: ['withdraw', 'payout', 'cash out'],
    reply:
      'Withdrawals start at 5,000 XAF and go in steps of 5,000 — 5,000, 10,000, 15,000, 20,000, 25,000 and so on. They go back to your verified mobile money wallet or bank account, and the fee is a flat 250 XAF.',
  },
  {
    match: ['lockup', 'lock-up', 'duration', 'term', 'maturity', 'days', 'long'],
    reply:
      'From 5 days on the smallest 5,000 XAF package up to 28 days on the largest — nothing on the platform runs longer than 30 days. Your money and its profit land back in your balance the day the package finishes.',
  },
  {
    match: ['check-in', 'checkin', 'daily', 'bonus', 'referral', 'invite', 'friend'],
    reply:
      'Two easy ones: the Check-in tab pays 100 XAF once a day, every day, straight into your balance. And every friend who joins with your invite code and verifies pays you 800 XAF.',
  },
  {
    match: ['kyc', 'verify', 'identity', 'document'],
    reply:
      'We need your mobile number, a government ID scan and a selfie so we can match the two. Verification usually completes in under 20 minutes, and you can start once it clears.',
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
