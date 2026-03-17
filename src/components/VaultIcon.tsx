export function VaultIcon({ id, size = 44 }: { id: string; size?: number }) {
  const map: Record<string, string> = {
    yoBTC: "/icons/btc.png",
    yoETH: "/icons/eth.png",
    yoUSD: "/icons/usdc.png",
    yoEUR: "/icons/eur.png",
  };
  const src = map[id] ?? "/icons/usdc.svg";

  return (
    <img
      src={src}
      alt={id}
      width={size}
      height={size}
      style={{ borderRadius: (id === "yoUSD") ? "22%" : "50%", display: "block" }}
    />
  );
}
