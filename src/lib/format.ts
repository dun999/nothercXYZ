export function formatAmount(raw: bigint, decimals: number, maxFrac = 4): string {
  const n = Number(raw) / 10 ** decimals;
  if (n === 0) return "0";
  if (n < 0.0001) return "< 0.0001";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFrac,
  });
}

export function formatUSD(n: number): string {
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
  if (n === 0) return "—";
  return `${n.toFixed(decimals)}%`;
}

export function parseAmount(val: string, decimals: number): bigint {
  if (!val || isNaN(Number(val))) return 0n;
  const [int, frac = ""] = val.split(".");
  const padded = frac.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(int || "0") * (10n ** BigInt(decimals)) + BigInt(padded);
}

/** "Deposit $1,000 → earn ~$X/year" */
export function estimateYearlyEarnings(principal: number, apy: number): string {
  if (!apy || !principal) return "—";
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
