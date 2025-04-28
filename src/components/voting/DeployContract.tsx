
import { Button } from "@/components/ui/button";

interface DeployContractProps {
  account: string;
  contractAddress: string;
  defaultContractAddress: string;
  onDeploy: () => Promise<void>;
  deploying: boolean;
}

export const DeployContract = ({ 
  account, 
  contractAddress, 
  defaultContractAddress,
  onDeploy, 
  deploying 
}: DeployContractProps) => {
  if (!account) return null;

  return (
    <div className="mt-4 flex justify-center space-x-4">
      <Button
        onClick={onDeploy}
        disabled={deploying || !account}
        className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {deploying ? "Deploying..." : "Deploy New Contract"}
      </Button>
      {contractAddress !== defaultContractAddress && (
        <p className="text-green-400 mt-2 text-sm">
          Using contract: {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
        </p>
      )}
    </div>
  );
};
