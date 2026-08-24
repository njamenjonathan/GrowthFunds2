import React, { useState } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
}

interface SupportChatModalProps {
  onClose: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  onClose,
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'support',
      text: 'Hello! Welcome to GrowthFund Institutional Helpdesk. I am your CEMAC-regulated investment advisory assistant. How can I assist your portfolio today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'How do I deposit via MTN MoMo or Orange Money?',
    'Are returns guaranteed under COSUMAF regulations?',
    'What is the minimum lockup duration?',
    'How do withdrawals work to local banks?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Thank you for your inquiry. Our portfolio managers and COSUMAF compliance officers are monitoring the platform. For immediate assistance with funds, please check your KYC verification or deposit history.";

      const lower = text.toLowerCase();
      if (lower.includes('deposit') || lower.includes('momo') || lower.includes('orange')) {
        reply = "You can deposit in XAF instantly using MTN Mobile Money, Orange Money, Express Union Mobile, or Bank Transfer (Afriland, BGFIBank, Ecobank). Deposits under Tier 2 are credited within seconds via USSD push.";
      } else if (lower.includes('guarantee') || lower.includes('cosumaf') || lower.includes('risk')) {
        reply = "Under COSUMAF market regulations, no investment platform can promise guaranteed returns. All returns (8% - 18%) are actuarial projections based on real underlying assets (agriculture cooperatives, commercial real estate, treasury bills). Capital risk disclosures are fully audited.";
      } else if (lower.includes('withdraw')) {
        reply = "Withdrawals are processed directly back to your verified Mobile Money wallet or CEMAC bank account. Payouts are instant to mobile wallets and 1-2 hours for interbank transfers, with a flat fee of 250 XAF.";
      } else if (lower.includes('lockup') || lower.includes('duration') || lower.includes('term')) {
        reply = "Our funds offer flexible holding terms ranging from 6 months (CEMAC Sovereign Bond Fund) to 24 months (Real Estate Fund). Quarterly dividends are paid out directly into your available balance.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `rep_${Date.now()}`,
          sender: 'support',
          text: reply,
          timestamp: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#c0c9be]/50 overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#e1e3e4] flex justify-between items-center bg-[#002c13] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fed65b] text-[#241a00] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
            </div>
            <div>
              <h3 className="text-sm font-bold">GrowthFund Investment Advisory</h3>
              <p className="text-[11px] text-[#b2f1bf] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#97d5a5] animate-pulse"></span>
                Online • Regulated Advisor
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/70 hover:text-white rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#f8f9fa] text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-[#002c13] text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-[#191c1d] border border-[#c0c9be]/40 rounded-tl-xs shadow-2xs'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <span
                  className={`text-[9px] block mt-1 text-right ${
                    m.sender === 'user' ? 'text-white/60' : 'text-[#717970]'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#c0c9be]/40 p-3 rounded-2xl rounded-tl-xs text-[#717970] text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#002c13] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#002c13] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#002c13] animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-2.5 bg-white border-t border-[#e1e3e4] flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 rounded-full bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#002c13] text-[11px] font-semibold whitespace-nowrap border border-[#c0c9be]/40 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#e1e3e4] flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your investment question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2 text-xs border border-[#c0c9be] rounded-xl focus:border-[#002c13]"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 bg-[#002c13] text-white rounded-xl hover:bg-[#014421] transition-all shadow-xs flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
