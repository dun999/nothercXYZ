// ─── Branding ──────────────────────────────────────────────────────────────
export const APP_NAME = "Notherc";
export const APP_TAGLINE = "Your on-chain savings account";
export const TWITTER_HANDLE = "@nothercxyz";

// ─── External URLs ─────────────────────────────────────────────────────────
export const BASESCAN_URL = "https://basescan.org";
export const YO_PROTOCOL_URL = "https://yo.xyz";
export const basescanTx = (hash: string) => `${BASESCAN_URL}/tx/${hash}`;
export const basescanAddress = (addr: string) => `${BASESCAN_URL}/address/${addr}`;

// ─── Storage keys ───────────────────────────────────────────────────────────
export const STORAGE_KEY_THEME = "notherc-theme";
export const STORAGE_KEY_RISK_ACCEPTED = "notherc_risk_accepted";

// ─── Timeouts & intervals (ms) ──────────────────────────────────────────────
export const APPROVAL_TIMEOUT_MS = 30_000;
export const PRIVY_READY_TIMEOUT_MS = 5_000;
export const QUERY_STALE_TIME_MS = 30_000;

// ─── Transaction defaults ────────────────────────────────────────────────────
export const DEPOSIT_SLIPPAGE_BPS = 50;
export const QUERY_RETRY_COUNT = 2;

// ─── Semantic colors (JS inline styles only) ─────────────────────────────────
export const COLOR_SUCCESS      = "#22C55E";
export const COLOR_ERROR        = "#EF4444";
export const COLOR_CHAIN_SWITCH = "#3B82F6";

export const MODAL_BACKDROP = "rgba(0,0,0,0.72)";
export const MODAL_SHADOW   = "0 24px 64px rgba(0,0,0,0.5)";

export const COLOR_SUCCESS_BG     = "rgba(34,197,94,0.08)";
export const COLOR_SUCCESS_BORDER = "rgba(34,197,94,0.2)";
export const COLOR_ERROR_BG       = "rgba(239,68,68,0.08)";
export const COLOR_ERROR_BORDER   = "rgba(239,68,68,0.2)";
export const COLOR_WARNING_BG     = "rgba(245,158,11,0.08)";
export const COLOR_WARNING_BORDER = "rgba(245,158,11,0.2)";
