import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Welcome to Solana Wallet
        </h1>
        <p className="text-gray-400 text-xl mb-12">
          Your gateway to the Solana ecosystem
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-purple-600 text-white text-xl rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105"
        >
          Enter App
        </button>
      </div>
    </div>
  );
}
