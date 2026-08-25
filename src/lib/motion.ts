import { useReducedMotion, type Transition, type Variants } from 'motion/react';

/**
 * The app's motion vocabulary.
 *
 * Before this, each animated component invented its own duration and easing,
 * so a card that lifted on the home page and one that lifted on the plans page
 * moved at visibly different speeds. These are the shared curves, matching the
 * `--gf-ease*` and `--gf-dur*` tokens in `index.css`, so the CSS transitions
 * and the Motion animations are paced from one place.
 *
 * Everything here is also reduced-motion aware: `useMotionPreset` collapses the
 * movement to a plain cross-fade when the user has asked for less motion, which
 * a bare `variants` object cannot do on its own. The CSS in `index.css` already
 * zeroes durations for the same users; this keeps the JS-driven half honest.
 */

/** Settles hard without overshooting — for state changes and hovers. */
export const EASE: Transition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

/** Overshoots slightly — for things that appear rather than change. */
export const SPRING: Transition = { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 };

/** The press/lift a card or button gets under the pointer. */
export const LIFT = { y: -4, scale: 1.015 } as const;
export const PRESS = { scale: 0.98 } as const;

/**
 * Rises into place. `custom` is an index, so a list can pass its position and
 * get a staggered entrance without a parent container.
 */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...SPRING, delay: Math.min(index, 6) * 0.06 },
  }),
};

/** Parent of a staggered group — children animate on their own timing. */
export const stagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

/** Child of `stagger`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: SPRING },
};

/**
 * The viewport config every scroll reveal in the app shares: fire once, and
 * start slightly before the element's edge reaches the fold so the motion has
 * finished by the time it is properly in view.
 */
export const REVEAL_VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -60px 0px' } as const;

type Preset = {
  variants: Variants;
  initial: string;
  whileInView: string;
  viewport: typeof REVEAL_VIEWPORT;
};

/**
 * A scroll reveal that honours `prefers-reduced-motion`: the same fade, with
 * the travel taken out, for users who asked not to be moved around.
 */
export function useReveal(variants: Variants = riseIn): Preset {
  const reduced = useReducedMotion();
  return {
    variants: reduced ? fadeOnly : variants,
    initial: 'hidden',
    whileInView: 'shown',
    viewport: REVEAL_VIEWPORT,
  };
}

/**
 * Variants for a child of a `stagger` group. Separate from `useReveal` because
 * the child is driven by the parent's state, not its own viewport — it needs
 * the variants alone, and the same reduced-motion fallback.
 */
export function useRevealItem(): Variants {
  return useReducedMotion() ? fadeOnly : staggerItem;
}

/** The hover/tap pair, dropped entirely under reduced motion. */
export function useInteractive() {
  const reduced = useReducedMotion();
  if (reduced) return {};
  return { whileHover: LIFT, whileTap: PRESS, transition: SPRING };
}

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.25 } },
};
