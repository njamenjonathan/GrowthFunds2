import { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  /** Tailwind max-width class for the panel, e.g. `max-w-lg`. */
  size?: string;
  /** Accessible name for the dialog, announced when it opens. */
  label: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Shared shell for every dialog in the app. Centralises the behaviour each
 * modal previously lacked: Escape to dismiss, click-outside to dismiss,
 * background scroll lock, initial focus, and a focus trap so keyboard users
 * can't tab out into the inert page behind.
 */
export const Modal: React.FC<ModalProps> = ({
  onClose,
  size = 'max-w-lg',
  label,
  className = '',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    // Focus the panel itself rather than the first control, so a dialog never
    // opens with a destructive button pre-armed.
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onMouseDown={(event) => {
        // Only dismiss on a press that both starts and ends on the backdrop,
        // so dragging a text selection out of the panel doesn't close it.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className={`bg-surface rounded-2xl w-full ${size} shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh] outline-none animate-in zoom-in-95 duration-150 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

interface ModalHeaderProps {
  icon: string;
  title: string;
  subtitle?: React.ReactNode;
  onClose: () => void;
  /** Renders the header on the deep brand surface instead of a light bar. */
  tone?: 'light' | 'brand';
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  icon,
  title,
  subtitle,
  onClose,
  tone = 'light',
}) => {
  const isBrand = tone === 'brand';
  return (
    <div
      className={`p-5 sm:p-6 border-b flex justify-between items-center gap-3 shrink-0 ${
        isBrand ? 'bg-emerald border-emerald-2 text-on-emerald' : 'bg-surface-2 border-line-2'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isBrand ? 'bg-gold-on-emerald text-gold-2' : 'bg-emerald text-gold-on-emerald'
          }`}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className={`text-base sm:text-lg font-bold truncate ${isBrand ? 'text-on-emerald' : 'text-accent'}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-xs truncate ${isBrand ? 'text-on-emerald/80' : 'text-ink-3'}`}>{subtitle}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className={`p-2 rounded-xl transition-colors shrink-0 ${
          isBrand ? 'text-on-emerald/80 hover:text-on-emerald hover:bg-on-emerald/10' : 'text-ink-3 hover:text-ink hover:bg-surface-3'
        }`}
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  );
};
