import { Button } from "@/components/ui/button.jsx";

export const DeployContract = ({ 
  account, 
  contractAddress, 
  defaultContractAddress,
  onDeploy, 
  deploying 
}) => {
  if (!account) return null;

  const hasContract = contractAddress && contractAddress !== defaultContractAddress;

  return (
    <div className="text-center mb-8">
      {!hasContract ? (
        <div className="space-y-4">
          <div className="p-4 bg-opacity-20 bg-amber-900 backdrop-blur-lg rounded-xl border border-amber-500/20">
            <h3 className="text-lg text-amber-300 mb-2">📋 Ready to Start Voting</h3>
            <p className="text-amber-200 text-sm mb-4">
              Create a new voting session to begin the election process
            </p>
            <Button
              onClick={onDeploy}
              disabled={deploying}
              className="bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deploying ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Voting Session...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Start New Voting Session</span>
                </span>
              )}
            </Button>
          </div>
          <p className="text-gray-400 text-xs">
            💡 This is a mock voting system for demonstration purposes
          </p>
        </div>
      ) : (
        <div className="p-4 bg-opacity-20 bg-green-900 backdrop-blur-lg rounded-xl border border-green-500/20">
          <h3 className="text-lg text-green-300 mb-2">✅ Voting Session Active</h3>
          <p className="text-green-200 text-sm">
            Contract: <span className="font-mono">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            You can now vote for your preferred candidate below
          </p>
        </div>
      )}
    </div>
  );
}; 