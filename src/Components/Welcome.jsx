import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-deepBlue bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjUgNTAgNzUgNTBNNTAgMjUgNTAgNzUiIHN0cm9rZT0iIzFlMjkzYiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]">
      <div className="glass-panel-dark rounded-xl p-10 max-w-xl mx-4 animate-fade-in">
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text leading-tight">
            Welcome to Solana Wallet
          </h1>
          
          <p className="text-softWhite/90 text-lg md:text-xl leading-relaxed">
            Your gateway to the Solana ecosystem. Connect your wallet and start exploring the world of decentralized finance.
          </p>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="gradient-btn py-4 px-8 text-lg rounded-lg mt-4 self-center transform hover:scale-[1.02]"
          >
            Enter App
          </button>
          
          <div className="absolute -z-10 w-48 h-48 bg-teal/10 rounded-full blur-3xl left-1/4 bottom-0"></div>
          <div className="absolute -z-10 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl right-1/4 top-1/3"></div>
        </div>
      </div>
    </div>
  );
}