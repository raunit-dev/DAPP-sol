import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export function ShowSolBalance() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        async function getBalance() { 
            try {
                if (wallet.publicKey) {
                    const balance = await connection.getBalance(wallet.publicKey);
                    setBalance(balance / LAMPORTS_PER_SOL);
                }
            } catch (error) {
                console.error("Failed to fetch balance:", error);
            }
        }
        getBalance();
        const interval = setInterval(getBalance, 5000);
        return () => clearInterval(interval);
    }, [connection, wallet.publicKey]);
    
    if (!wallet.publicKey) return null;

    return (
        <div className="bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-gray-400 text-sm">Balance:</p>
            <p className="text-xl font-bold text-white">
                {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </p>
        </div>
    );
}