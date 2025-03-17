import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import React, { useState } from 'react';

export function SignMessage() {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [error, setError] = useState('');

    async function onClick() {
        try {
            setError('');
            setSignature('');
            
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
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Sign Message</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-gray-300 mb-2">
                        Enter your message:
                    </label>
                    <input 
                        id="message"
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here"
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                
                <button 
                    onClick={onClick}
                    disabled={!message}
                    className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Sign Message
                </button>

                {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                {signature && (
                    <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg">
                        <p className="text-green-200 font-medium mb-2">Message signed successfully!</p>
                        <p className="text-gray-300 text-sm break-all">
                            Signature: {signature}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}