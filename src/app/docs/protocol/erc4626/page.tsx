import type { Metadata } from "next";

export const metadata: Metadata = { title: "ERC-4626 Standard" };

export default function Erc4626Page() {
  return (
    <div>
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>
        docs / protocol / erc4626
      </p>
      <h1 className="text-[2rem] font-black tracking-tight mb-3" style={{ color: "var(--color-n-text)" }}>
        ERC-4626 Standard
      </h1>
      <p className="text-base leading-relaxed mb-8" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        ERC-4626 is the Tokenized Vault Standard — a unified API for yield-bearing vaults.
        It extends ERC-20, so vault shares are transferable tokens.
      </p>

      {[
        {
          fn: "deposit(uint256 assets, address receiver)",
          returns: "uint256 shares",
          desc: "Transfers assets from msg.sender to the vault and mints shares to receiver.",
        },
        {
          fn: "mint(uint256 shares, address receiver)",
          returns: "uint256 assets",
          desc: "Mints exactly shares vault tokens to receiver by depositing assets.",
        },
        {
          fn: "withdraw(uint256 assets, address receiver, address owner)",
          returns: "uint256 shares",
          desc: "Burns shares from owner and sends assets to receiver.",
        },
        {
          fn: "redeem(uint256 shares, address receiver, address owner)",
          returns: "uint256 assets",
          desc: "Burns exactly shares from owner and sends assets to receiver.",
        },
        {
          fn: "previewDeposit(uint256 assets)",
          returns: "uint256 shares",
          desc: "Read-only simulation of deposit — shows shares received (no state change).",
        },
        {
          fn: "previewRedeem(uint256 shares)",
          returns: "uint256 assets",
          desc: "Read-only simulation of redeem — shows assets received (no state change).",
        },
        {
          fn: "convertToAssets(uint256 shares)",
          returns: "uint256 assets",
          desc: "Converts a share amount to the current underlying asset value (the exchange rate).",
        },
      ].map(({ fn, returns, desc }) => (
        <div key={fn} className="mb-4 p-5 rounded-xl" style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}>
          <div className="flex items-start gap-3 flex-wrap mb-2">
            <code className="text-[12px] font-mono font-bold" style={{ color: "var(--color-n-text)" }}>{fn}</code>
            <span className="text-[11px] font-mono" style={{ color: "var(--color-n-muted)" }}>→ {returns}</span>
          </div>
          <p className="text-[13px]" style={{ color: "var(--color-n-muted)" }}>{desc}</p>
        </div>
      ))}
    </div>
  );
}
