import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { toast } from 'sonner';

export function RequestAirdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState(1); // Default amount is 1 SOL
    const [isLoading, setIsLoading] = useState(false);

    async function handleAirdropClick() {
        if (!wallet.publicKey) {
            toast.error("Please connect your wallet first!");
            return;
        }

        try {
            setIsLoading(true);
            toast.loading('Requesting airdrop...', { id: 'airdrop' });
            
            const signature = await connection.requestAirdrop(
                wallet.publicKey,
                amount * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction({
                signature,
                commitment: "confirmed"
            });
            
            toast.success(`Airdropped ${amount} SOL to ${wallet.publicKey.toBase58()}`, { id: 'airdrop' });
        } catch (error) {
            toast.error("Airdrop failed: " + error.message, { id: 'airdrop' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-2">Request Airdrop</h2>
                <p className="text-gray-400 mb-6">
                    Get some Devnet SOL to test the application. Select the amount and click the button below to request an airdrop.
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                            Select Amount
                        </label>
                        <select
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                        >
                            <option value={0.25}>0.25 SOL</option>
                            <option value={0.5}>0.5 SOL</option>
                            <option value={1}>1.0 SOL</option>
                            <option value={2}>2.0 SOL</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleAirdropClick}
                        disabled={isLoading || !wallet.publicKey}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Requesting...
                            </span>
                        ) : 'Get Devnet SOL'}
                    </button>

                    {!wallet.publicKey && (
                        <div className="p-4 bg-amber-900/50 border border-amber-500/50 rounded-lg text-amber-300 animate-fade-in">
                            Please connect your wallet to request an airdrop
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
