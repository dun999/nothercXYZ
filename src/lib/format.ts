export function formatAmount(raw: bigint, decimals: number, maxFrac = 4): string {
  if (raw === 0n) return "0";
  // Avoid Number() precision loss for large bigints (> 2^53).
  // Split into integer and fractional parts before converting.
  const divisor = 10n ** BigInt(decimals);
  const whole = raw / divisor;
  const frac = raw % divisor;
  const n = Number(whole) + Number(frac) / 10 ** decimals;
  if (!isFinite(n)) return "0";
  if (n < 0.0001) return "< 0.0001";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFrac,
  });
}

export function formatUSD(n: number): string {
  if (!isFinite(n) || isNaN(n) || n <= 0) return "—";
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatTVL(n: number): string {
  return formatUSD(n);
}

export function formatPercent(n: number, decimals = 2): string {
  if (!isFinite(n) || isNaN(n) || n === 0) return "—";
  return `${n.toFixed(decimals)}%`;
}

export function parseAmount(val: string, decimals: number): bigint {
  if (!val) return 0n;
  // Reject anything that's not a valid positive decimal number
  if (!/^\d*\.?\d*$/.test(val)) return 0n;
  // "." with no digits on either side → 0
  const [intPart, fracPart = ""] = val.split(".");
  if (!intPart && !fracPart) return 0n;
  const padded = fracPart.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(intPart || "0") * (10n ** BigInt(decimals)) + BigInt(padded || "0");
}

/** "Deposit $1,000 → earn ~$X/year" */
export function estimateYearlyEarnings(principal: number, apy: number): string {
  if (!apy || !principal || !isFinite(apy) || !isFinite(principal)) return "—";
  const yearly = principal * (apy / 100);
  return formatUSD(yearly);
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function parseErrorMessage(error: Error | null): string {
  if (!error) return "";
  const msg = error.message?.toLowerCase() ?? "";
  if (msg.includes("user rejected") || msg.includes("user denied"))
    return "Transaction cancelled.";
  if (msg.includes("insufficient funds") || msg.includes("exceeds balance"))
    return "Insufficient balance.";
  if (msg.includes("network") || msg.includes("failed to fetch"))
    return "Network error, check your connection.";
  if (msg.includes("gas") || msg.includes("underpriced"))
    return "Gas estimation failed. Try again.";
  if (msg.includes("timed out") || msg.includes("timeout")) {
    const hashMatch = error.message?.match(/0x[a-fA-F0-9]{64}/);
    const shortHash = hashMatch ? `${hashMatch[0].slice(0, 10)}…${hashMatch[0].slice(-6)}` : "";
    return `Transaction timed out${shortHash ? ` (${shortHash})` : ""}. Try again.`;
  }
  return error.message?.slice(0, 80) ?? "Transaction failed.";
}
