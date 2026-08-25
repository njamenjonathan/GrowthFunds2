/**
 * The decorative layer behind an interior page: the woven motif the app has
 * always drawn from its own tokens, plus a faded sheet of CEMAC banknotes
 * bleeding off the top-right corner.
 *
 * It clips on its own wrapper rather than asking the page container for
 * `overflow-hidden`, because those containers hold sticky headers and popovers
 * that a clipping ancestor would trap. Every page container already wraps its
 * content in `relative z-10`, which is what keeps this underneath.
 */
export const PageBackdrop: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0 opacity-40 pattern-bg"></div>
    <div className="gf-motif gf-motif--notes"></div>
  </div>
);
