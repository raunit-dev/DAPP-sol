import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { TokenField } from './TokenField';

export function SendTokens() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function sendTokens() {
        try {
            setError('');
            setSuccess('');
            setIsLoading(true);

            if (!wallet.publicKey) {
                throw new Error('Please connect your wallet first!');
            }

            if (!recipient || !amount) {
                throw new Error('Please fill in both recipient address and amount!');
            }

            let recipientPubKey;
            try {
                recipientPubKey = new PublicKey(recipient);
            } catch (e) {
                throw new Error('Invalid recipient address!');
            }

            const transaction = new Transaction();
            transaction.add(SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: recipientPubKey,
                lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
            }));

            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature);
            setSuccess(`Successfully sent ${amount} SOL to ${recipient}`);
            setAmount('');
            setRecipient('');
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-2">Send SOL</h2>
                <p className="text-gray-400 mb-6">Transfer SOL to any wallet address</p>
                
                <div className="space-y-4">
                    <TokenField 
                        id="recipient"
                        label="Recipient Address"
                        placeholder="Enter recipient's wallet address"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />

                    <TokenField 
                        id="amount"
                        label="Amount (SOL)"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="0.001"
                    />

                    <button 
                        onClick={sendTokens}
                        disabled={isLoading || !recipient || !amount || !wallet.publicKey}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </span>
                        ) : 'Send SOL'}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 animate-fade-in">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-900/50 border border-green-500/50 rounded-lg text-green-300 animate-fade-in">
                            {success}
                        </div>
                    )}

                    {!wallet.publicKey && (
                        <div className="p-4 bg-amber-900/50 border border-amber-500/50 rounded-lg text-amber-300 animate-fade-in">
                            Please connect your wallet to send SOL
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}