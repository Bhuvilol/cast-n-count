
import { Button } from "@/components/ui/button";

interface WalletConnectProps {
  account: string;
  onConnect: () => Promise<void>;
  isReadOnly: boolean;
}

export const WalletConnect = ({ account, onConnect, isReadOnly }: WalletConnectProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-white mb-4">Decentralized Voting</h1>
      <p className="text-gray-300 mb-4">
        {account ? (
          <>
            Connected Wallet: <span className="font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </>
        ) : (
          <Button 
            onClick={onConnect} 
            className="bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Connect Wallet
          </Button>
        )}
      </p>
      {isReadOnly && !account && (
        <p className="text-amber-400 text-sm">
          ⓘ Viewing in read-only mode. Connect wallet to vote.
        </p>
      )}
    </div>
  );
};
