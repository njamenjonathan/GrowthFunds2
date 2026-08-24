/**
 * Deterministic initials avatar rendered as an inline SVG data URI.
 *
 * The app previously pulled profile pictures from Unsplash and a Google user
 * content URL. Those are third-party links that break offline, leak a request
 * per render, and 404 without warning — so avatars are generated locally
 * instead. The same name always produces the same colour.
 */

const PALETTE = [
  ['#043d21', '#f5cf5a'],
  ['#0a5c33', '#ffe08a'],
  ['#1d3a52', '#d4e4f6'],
  ['#8a6a00', '#fff6d9'],
  ['#0d4a28', '#d2f2dd'],
  ['#3d2b12', '#f0d9a8'],
] as const;

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';

const hashOf = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

export const avatarFor = (name: string): string => {
  const [background, foreground] = PALETTE[hashOf(name) % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="${background}"/><text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-size="38" font-weight="700" fill="${foreground}">${initialsOf(name)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
