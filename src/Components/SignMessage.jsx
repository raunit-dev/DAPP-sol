import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import React, { useState } from 'react';
import { TokenField } from './TokenField';

export function SignMessage() {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function onClick() {
        try {
            setError('');
            setSignature('');
            setIsLoading(true);
            
            if (!publicKey) throw new Error('Wallet not connected!');
            if (!signMessage) throw new Error('Wallet does not support message signing!');
            
            const encodedMessage = new TextEncoder().encode(message);
            const sig = await signMessage(encodedMessage);

            if (!ed25519.verify(sig, encodedMessage, publicKey.toBytes())) {
                throw new Error('Message signature invalid!');
            }
            
            setSignature(bs58.encode(sig));
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold gradient-text mb-2">Sign Message</h2>
                <p className="text-softWhite/70 mb-6">Sign a message to verify your wallet ownership</p>
                
                <div className="space-y-4">
                    <TokenField 
                        id="message"
                        label="Message to Sign"
                        placeholder="Type your message here"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    
                    <button 
                        onClick={onClick}
                        disabled={isLoading || !message || !publicKey || !signMessage}
                        className="w-full py-3 px-4 gradient-btn rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing...
                            </span>
                        ) : 'Sign Message'}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 animate-fade-in">
                            {error}
                        </div>
                    )}

                    {signature && (
                        <div className="p-4 bg-teal/10 border border-teal/30 rounded-lg animate-fade-in">
                            <p className="text-teal font-medium mb-2">Message signed successfully!</p>
                            <p className="text-softWhite/90 text-sm break-all">
                                Signature: {signature}
                            </p>
                        </div>
                    )}

                    {!publicKey && (
                        <div className="p-4 bg-amber-900/30 border border-amber-500/30 rounded-lg text-amber-300 animate-fade-in">
                            Please connect your wallet to sign messages
                        </div>
                    )}

                    {!signMessage && publicKey && (
                        <div className="p-4 bg-amber-900/30 border border-amber-500/30 rounded-lg text-amber-300 animate-fade-in">
                            Your wallet does not support message signing
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}