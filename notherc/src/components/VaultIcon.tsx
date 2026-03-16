/**
 * Premium SVG vault icons — inspired by BTC/ETH/USDC brand icons,
 * refined with gradient fills and clean geometry for the Notherc palette.
 */

export function VaultIcon({ id, size = 44 }: { id: string; size?: number }) {
  if (id === "yoBTC") return <BTCIcon size={size} />;
  if (id === "yoETH") return <ETHIcon size={size} />;
  return <USDIcon size={size} />;
}

/* ── USDC — rounded square, premium emerald ── */
function USDIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="usd-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1ec97e" />
          <stop offset="100%" stopColor="#0da35e" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="11" fill="url(#usd-grad)" />
      {/* Dollar sign */}
      <text
        x="22"
        y="30"
        textAnchor="middle"
        fontSize="26"
        fontWeight="900"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
        fill="rgba(0,0,0,0.85)"
        letterSpacing="-1"
      >
        $
      </text>
    </svg>
  );
}

/* ── Ethereum — circle, premium cobalt-steel ── */
function ETHIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eth-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#74afd4" />
          <stop offset="100%" stopColor="#3a7fb5" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="22" fill="url(#eth-grad)" />
      {/* ETH diamond — upper */}
      <polygon
        points="22,9 31,22.5 22,18.5 13,22.5"
        fill="rgba(0,0,0,0.82)"
      />
      {/* ETH diamond — lower */}
      <polygon
        points="22,35 31,24.5 22,28.5 13,24.5"
        fill="rgba(0,0,0,0.65)"
      />
    </svg>
  );
}

/* ── Bitcoin — circle, premium warm amber ── */
function BTCIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="btc-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8a050" />
          <stop offset="100%" stopColor="#c47030" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="22" fill="url(#btc-grad)" />
      {/*
        Bitcoin B — simplified vector:
        vertical bar + two bumps with tilt serifs
      */}
      {/* Vertical staff */}
      <rect x="14" y="10" width="3.5" height="24" rx="1.5" fill="rgba(0,0,0,0.85)" />
      {/* Upper bump */}
      <path
        d="M17.5 10.5 C17.5 10.5 26 10.5 26 16 C26 21 17.5 21 17.5 21"
        stroke="rgba(0,0,0,0.85)" strokeWidth="3.5" strokeLinecap="round" fill="none"
      />
      {/* Lower bump (slightly wider for ₿ shape) */}
      <path
        d="M17.5 21 C17.5 21 27 21 27 27 C27 33 17.5 33 17.5 33"
        stroke="rgba(0,0,0,0.85)" strokeWidth="3.5" strokeLinecap="round" fill="none"
      />
      {/* Top serif — tilted slightly right */}
      <rect x="12.5" y="9" width="6" height="3" rx="1.5" fill="rgba(0,0,0,0.85)" transform="rotate(8 12.5 9)" />
      {/* Bottom serif */}
      <rect x="12.5" y="32" width="6" height="3" rx="1.5" fill="rgba(0,0,0,0.85)" transform="rotate(-8 12.5 32)" />
    </svg>
  );
}
