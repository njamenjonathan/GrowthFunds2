import { View } from '../types';

/**
 * Where the app is: which page is open, and — on a plan's package page — which
 * plan's packages are being read.
 *
 * Every page the investor can reach has an address of its own, so a plan's
 * packages are a real page: the browser's back button returns to the
 * catalogue, and the address bar can be shared or bookmarked. Addresses live
 * in the hash (`#/invest/agri-growth`) so they survive being opened directly
 * on any static host, with no server rewrite rules to configure.
 */
export interface Route {
  view: View;
  /** Set only on the 'plan' view: the plan whose packages are listed. */
  planId?: string;
}

/** The address each view answers to. */
const PATH_BY_VIEW: Record<Exclude<View, 'plan'>, string> = {
  home: '/',
  plans: '/invest',
  dashboard: '/profile',
  referrals: '/invite',
  checkin: '/check-in',
  history: '/history',
  about: '/about',
  faq: '/faq',
  security: '/security',
};

const VIEW_BY_PATH: Record<string, View> = Object.fromEntries(
  Object.entries(PATH_BY_VIEW).map(([view, path]) => [path, view as View])
);

/** The address of a route, hash and all: `#/invest/agri-growth`. */
export const hashForRoute = (route: Route): string => {
  if (route.view === 'plan') {
    return route.planId
      ? `#${PATH_BY_VIEW.plans}/${encodeURIComponent(route.planId)}`
      : `#${PATH_BY_VIEW.plans}`;
  }
  return `#${PATH_BY_VIEW[route.view]}`;
};

/**
 * The route an address points at, or `null` when it points at no page.
 *
 * In-page anchors such as the `#main` skip link are addresses too, so anything
 * that is not one of ours is left alone rather than bounced to the home page.
 */
export const routeFromHash = (hash: string): Route | null => {
  if (!hash.startsWith('#/')) return null;

  const path = hash.slice(1).replace(/\/+$/, '') || '/';

  const planPath = `${PATH_BY_VIEW.plans}/`;
  if (path.startsWith(planPath)) {
    const planId = decodeURIComponent(path.slice(planPath.length));
    return planId ? { view: 'plan', planId } : { view: 'plans' };
  }

  const view = VIEW_BY_PATH[path];
  return view ? { view } : null;
};
