import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function RequestAirdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState(1); // Default amount is 1 SOL

    async function handleAirdropClick() {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            const signature = await connection.requestAirdrop(
                wallet.publicKey,
                amount * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction({
                signature,
                commitment: "confirmed"
            });
            alert(`Airdropped ${amount} SOL to ${wallet.publicKey.toBase58()}`);
        } catch (error) {
            alert("Airdrop failed: " + error.message);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Request Airdrop</h2>
            <p className="text-gray-300 mb-4">
                Get some Devnet SOL to test the application. Select the amount and click the button below to request an airdrop.
            </p>
            <div className="mb-4">
                <label htmlFor="amount" className="text-gray-300 mr-2">Select Amount:</label>
                <select
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                >
                    <option value={0.25}>0.25 SOL</option>
                    <option value={0.5}>0.5 SOL</option>
                    <option value={1}>1.0 SOL</option>
                    <option value={2}>2.0 SOL</option>
                </select>
            </div>
            <button 
                onClick={handleAirdropClick}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
                Get Devnet SOL
            </button>
        </div>
    );
}
