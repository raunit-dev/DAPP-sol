import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { useState } from 'react';
import { TokenField } from './TokenField';
import { toast } from 'sonner';

export function TokenLaunchpad() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Form state
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [uri, setUri] = useState('');
    const [supply, setSupply] = useState('');

    async function createToken() {
        if (!wallet.publicKey || !wallet.signTransaction) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!name || !symbol || !uri || !supply) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            setIsLoading(true);
            setSuccessMessage('');
            
            const mintKeypair = Keypair.generate();
            
            // Ensure symbol is 4 characters with padding
            const paddedSymbol = symbol.padEnd(4, ' ');
            
            const metadata = {
                mint: mintKeypair.publicKey,
                name: name,
                symbol: paddedSymbol,
                uri: uri,
                additionalMetadata: [],
            };

            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

            // Show creating token toast
            toast.loading('Creating your token...', { id: 'creating-token' });

            // First transaction - Create and initialize the token
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(
                    mintKeypair.publicKey,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                ),
                createInitializeMintInstruction(
                    mintKeypair.publicKey,
                    9, // 9 decimals
                    wallet.publicKey,
                    null,
                    TOKEN_2022_PROGRAM_ID
                ),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mintKeypair.publicKey,
                    metadata: mintKeypair.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                    mintAuthority: wallet.publicKey,
                    updateAuthority: wallet.publicKey,
                }),
            );
                
            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);

            await wallet.sendTransaction(transaction, connection);

            const mintAddress = mintKeypair.publicKey.toBase58();
            console.log(`Token mint created at ${mintAddress}`);
            
            toast.loading('Creating token account...', { id: 'creating-token' });
            
            // Second transaction - Create the associated token account
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
            );

            const transaction2 = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
            );

            await wallet.sendTransaction(transaction2, connection);
            
            toast.loading('Minting tokens...', { id: 'creating-token' });
            
            // Third transaction - Mint the tokens
            const transaction3 = new Transaction().add(
                createMintToInstruction(
                    mintKeypair.publicKey, 
                    associatedToken, 
                    wallet.publicKey, 
                    Number(supply) * (10 ** 9), // Convert to smallest units (9 decimals)
                    [], 
                    TOKEN_2022_PROGRAM_ID
                )
            );

            await wallet.sendTransaction(transaction3, connection);

            toast.success('Token created successfully!', { id: 'creating-token' });
            
            // Set success message
            setSuccessMessage(`Successfully created ${name} token (${symbol}) with mint address: ${mintAddress}`);
            
            // Reset form
            setName('');
            setSymbol('');
            setUri('');
            setSupply('');
            
        } catch (error) {
            console.error('Error creating token:', error);
            toast.error('Error creating token. Please try again.');
            toast.dismiss('creating-token');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold gradient-text mb-2">Create New Token</h2>
                <p className="text-softWhite/70 mb-6">Launch your own token on Solana in minutes</p>
                
                <div className="space-y-4">
                    <TokenField 
                        id="token-name"
                        label="Token Name"
                        placeholder="e.g., My Awesome Token"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    
                    <TokenField 
                        id="token-symbol"
                        label="Token Symbol (max 4 characters)"
                        placeholder="e.g., MAT"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.slice(0, 4))}
                    />
                    
                    <TokenField 
                        id="token-uri"
                        label="Metadata URI (JSON with image URL)"
                        placeholder="https://example.com/metadata.json"
                        value={uri}
                        onChange={(e) => setUri(e.target.value)}
                    />
                    
                    <TokenField 
                        id="token-supply"
                        label="Initial Supply"
                        type="number"
                        placeholder="1000000"
                        value={supply}
                        onChange={(e) => setSupply(e.target.value)}
                        min="0"
                        step="1"
                    />
                    
                    <button 
                        onClick={createToken} 
                        disabled={isLoading || !wallet.publicKey || !name || !symbol || !uri || !supply}
                        className="w-full py-3 px-4 gradient-btn rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </span>
                        ) : 'Create Token'}
                    </button>
                </div>
                
                {successMessage && (
                    <div className="mt-6 p-4 bg-teal/10 border border-teal/30 rounded-lg text-teal animate-fade-in">
                        {successMessage}
                    </div>
                )}
                
                {!wallet.publicKey && (
                    <div className="mt-6 p-4 bg-amber-900/30 border border-amber-500/30 rounded-lg text-amber-300 animate-fade-in">
                        Please connect your wallet to create a token
                    </div>
                )}
            </div>
        </div>
    );
}