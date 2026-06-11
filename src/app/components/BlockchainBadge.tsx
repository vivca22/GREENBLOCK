import { ExternalLink } from "lucide-react";

interface BlockchainBadgeProps {
  txHash: string;
}

export function BlockchainBadge({ txHash }: BlockchainBadgeProps) {
  const shortHash = txHash.slice(0, 8) + "...";
  // Connect to: https://amoy.polygonscan.com/tx/{txHash}
  return (
    <a
      href={`https://amoy.polygonscan.com/tx/${txHash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
      style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
    >
      <span>✓ Verified Polygon</span>
      <span className="opacity-70">{shortHash}</span>
      <ExternalLink size={10} />
    </a>
  );
}
