import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";

export function SendTokens() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function sendTokens() {
        try {
            setError('');
            setSuccess('');

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
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Send SOL</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="to" className="block text-gray-300 mb-2">
                        Recipient Address:
                    </label>
                    <input 
                        id="to"
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter recipient's wallet address"
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label htmlFor="amount" className="block text-gray-300 mb-2">
                        Amount (SOL):
                    </label>
                    <input 
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        step="0.001"
                        min="0"
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <button 
                    onClick={sendTokens}
                    disabled={!recipient || !amount || !wallet.publicKey}
                    className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send SOL
                </button>

                {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
                        {success}
                    </div>
                )}
            </div>
        </div>
    );
}