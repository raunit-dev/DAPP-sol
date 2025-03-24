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
    
    if (!wallet.publicKey) {
        return (
            <div className="glass-panel rounded-lg p-4 text-center">
                <p className="text-softWhite/70">Connect wallet to view balance</p>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-lg p-4">
            <p className="text-softWhite/70 text-sm mb-1">Balance:</p>
            <p className="text-xl font-bold gradient-text">
                {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </p>
        </div>
    );
}