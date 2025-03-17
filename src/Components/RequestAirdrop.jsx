import { useWallet } from "@solana/wallet-adapter-react";

export function RequestAirdrop() {
    const wallet = useWallet();

    function handleAirdropClick() {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first!");
            return;
        }
        alert(
            "To get Devnet SOL, please visit a Devnet faucet such as:\n\n" +
                "https://solfaucet.com/\n\n" +
                "Then, enter your wallet address: " +
                wallet.publicKey.toBase58()
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Request Airdrop</h2>
            <p className="text-gray-300 mb-4">
                Get some Devnet SOL to test the application. Click the button below to get instructions.
            </p>
            <button 
                onClick={handleAirdropClick}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
                Get Devnet SOL
            </button>
        </div>
    );
}

// import { useWallet,useConnection } from "@solana/wallet-adapter-react";
// import { LAMPORTS_PER_SOL } from "@solana/web3.js";



// export function RequestAirdrop() {
//     const wallet = useWallet();
//     const { connection } = useConnection();

//     async function requestAirdrop() {
//         let amount = document.getElementById("amount").value;
//         await connection.requestAirdrop(wallet.publicKey, amount* LAMPORTS_PER_SOL);
//         alert("Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
//     }

//   return ( <div>
//     <br></br>
//     <input id="amount" type="text" placeholder="Amount"/>
//     <button onClick={requestAirdrop}>Request Airdrop</button>
//     </div>
//   )
// }
