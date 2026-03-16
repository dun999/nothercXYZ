export const VAULTS = [
  {
    id: "yoUSD",
    name: "yoUSD",
    label: "Stablecoin",
    description: "Earn yield on USDC",
    asset: "USDC",
    assetAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
    decimals: 6,
    riskLevel: "Low" as const,
    riskColor: "#7bc49e",
    accent: "#c8b485",
  },
  {
    id: "yoETH",
    name: "yoETH",
    label: "Ethereum",
    description: "Earn yield on WETH",
    asset: "WETH",
    assetAddress: "0x4200000000000000000000000000000000000006" as `0x${string}`,
    decimals: 18,
    riskLevel: "Medium" as const,
    riskColor: "#9ab0c4",
    accent: "#9ab0c4",
  },
  {
    id: "yoBTC",
    name: "yoBTC",
    label: "Bitcoin",
    description: "Earn yield on cbBTC",
    asset: "cbBTC",
    assetAddress: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c" as `0x${string}`,
    decimals: 8,
    riskLevel: "Medium" as const,
    riskColor: "#c8a07a",
    accent: "#c8a07a",
  },
  {
    id: "yoEUR",
    name: "yoEUR",
    label: "Euro",
    description: "Earn yield on EURC",
    asset: "EURC",
    assetAddress: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42" as `0x${string}`,
    decimals: 6,
    riskLevel: "Low" as const,
    riskColor: "#7bc49e",
    accent: "#6ea8d8",
  },
] as const;

export const VAULT_ADDRESSES: Record<string, `0x${string}`> = {
  yoUSD: "0x0000000f2eB9f69274678c76222B35eEc7588a65",
  yoETH: "0x3a43aec53490cb9fa922847385d82fe25d0e9de7",
  yoBTC: "0xbCbc8cb4D1e8ED048a6276a5E94A3e952660BcbC",
  yoEUR: "0x50c749ae210d3977adc824ae11f3c7fd10c871e9",
};

export const BASE_CHAIN_ID = 8453;

export const TWITTER_URL = "https://x.com/nothercxyz?s=21";

export type VaultId = "yoUSD" | "yoETH" | "yoBTC" | "yoEUR";
export type VaultConfig = (typeof VAULTS)[number];
