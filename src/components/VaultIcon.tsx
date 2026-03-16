export function VaultIcon({ id, size = 44 }: { id: string; size?: number }) {
  const map: Record<string, string> = {
    yoBTC: "/icons/btc.svg",
    yoETH: "/icons/eth.svg",
    yoUSD: "/icons/usdc.svg",
  };
  const src = map[id] ?? "/icons/usdc.svg";

  return (
    <img
      src={src}
      alt={id}
      width={size}
      height={size}
      style={{ borderRadius: id === "yoUSD" ? "22%" : "50%", display: "block" }}
    />
  );
}
