/**
 * Which pair of currency photographs a page sits on.
 *
 * - `sheet` — the printed sheet of BEAC note designs, and a handful of coins.
 * - `fan` — a fan of 10,000 and 5,000 notes, and the denomination series.
 *
 * A page shows one pair and only one pair. Pages alternate between them as you
 * move through the header, so no single photograph follows you around the site.
 */
export type BackdropPair = 'sheet' | 'fan';

interface PageBackdropProps {
  /** Stated at every call site — the point of the pairs is that pages differ. */
  pair: BackdropPair;
}

/**
 * The decorative layer behind a page: the woven motif the app has always drawn
 * from its own tokens, plus CEMAC money at opposite corners — one photograph
 * bleeding off the top right, the other off the bottom left.
 *
 * It clips on its own wrapper rather than asking the page container for
 * `overflow-hidden`, because those containers hold sticky headers and popovers
 * that a clipping ancestor would trap. Every page container already wraps its
 * content in `relative z-10`, which is what keeps this underneath.
 */
export const PageBackdrop: React.FC<PageBackdropProps> = ({ pair }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0 opacity-40 pattern-bg"></div>
    {pair === 'sheet' ? (
      <>
        <div className="gf-motif gf-motif--notes"></div>
        <div className="gf-motif gf-motif--coins"></div>
      </>
    ) : (
      <>
        <div className="gf-motif gf-motif--fan"></div>
        <div className="gf-motif gf-motif--series"></div>
      </>
    )}
  </div>
);
