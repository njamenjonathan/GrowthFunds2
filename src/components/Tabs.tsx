import { useRef } from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon: string;
  /** Optional count shown as a pill, e.g. number of holdings. */
  badge?: number;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}

/**
 * Accessible tab strip.
 *
 * Implements the WAI-ARIA tabs pattern: roving tabindex so the group is a
 * single tab stop, and Left/Right/Home/End to move between tabs. Panels are
 * rendered by the caller and wired up with `tabPanelProps` below.
 */
export function Tabs<T extends string>({ tabs, active, onChange, label }: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = (index: number) => {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[index]?.focus();
    onChange(tabs[index].id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Move relative to whichever tab actually holds focus. Deriving this from
    // the *selected* tab instead breaks whenever focus and selection diverge
    // — e.g. focus moved programmatically, or restored after a dialog closes.
    const buttons = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
    );
    const focusedIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const current = focusedIndex >= 0 ? focusedIndex : tabs.findIndex((t) => t.id === active);
    if (current < 0) return;
    const last = tabs.length - 1;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusTab(current === last ? 0 : current + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusTab(current === 0 ? last : current - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(last);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-1 overflow-x-auto hide-scrollbar bg-surface border border-line rounded-2xl p-1.5 shadow-sm"
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              selected
                ? 'bg-emerald text-on-emerald shadow-sm'
                : 'text-ink-2 hover:text-ink hover:bg-surface-2'
            }`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              {tab.icon}
            </span>
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  selected ? 'bg-gold text-on-gold' : 'bg-surface-3 text-ink-2'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Props for the panel that belongs to `id`, keeping the ARIA wiring in one place. */
export const tabPanelProps = (id: string) => ({
  role: 'tabpanel' as const,
  id: `panel-${id}`,
  'aria-labelledby': `tab-${id}`,
  tabIndex: 0,
});
