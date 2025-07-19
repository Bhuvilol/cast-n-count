import { Button } from "@/components/ui/button.jsx";

export const WalletConnect = ({ account, onConnect, isReadOnly }) => {
  const getConnectionStatus = () => {
    if (account) {
      return {
        text: `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`,
        color: "bg-green-600 hover:bg-green-700",
        disabled: true
      };
    }
    
    if (isReadOnly) {
      return {
        text: "Connect Wallet",
        color: "bg-blue-600 hover:bg-blue-700",
        disabled: false
      };
    }
    
    return {
      text: "Connect Wallet",
      color: "bg-purple-600 hover:bg-purple-700",
      disabled: false
    };
  };

  const status = getConnectionStatus();

  return (
    <div className="text-center">
      <div className="inline-flex items-center space-x-4">
        <Button
          onClick={onConnect}
          disabled={status.disabled}
          className={`${status.color} text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {account ? (
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{status.text}</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{status.text}</span>
            </span>
          )}
        </Button>
        
        {isReadOnly && !account && (
          <div className="text-amber-400 text-sm">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Read-only mode
          </div>
        )}
      </div>
    </div>
  );
}; 