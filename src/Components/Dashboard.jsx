import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShowSolBalance } from './ShowSolBalance';
import { Clock } from './Clock';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Request Airdrop', path: '/dashboard/request-airdrop' },
    { name: 'Send Tokens', path: '/dashboard/send-tokens' },
    { name: 'Sign Message', path: '/dashboard/sign-message' },
    { name: 'Token Launchpad', path: '/dashboard/token-launchpad' },
  ];

  return (
    <div className="min-h-screen bg-deepBlue bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjUgNTAgNzUgNTBNNTAgMjUgNTAgNzUiIHN0cm9rZT0iIzFlMjkzYiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 glass-panel-dark border-b border-white/5 p-4 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-softWhite p-2 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold gradient-text">Solana Wallet</h1>
          </div>
          <WalletMultiButton className="!bg-gradient-teal-purple hover:!bg-gradient-teal-purple-hover !transition-all !duration-300 !shadow-md hover:!shadow-glow !border-0" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="pt-24 flex flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-8 lg:mr-64">
          <div className="max-w-3xl mx-auto glass-panel-dark rounded-xl p-6 shadow-xl border border-white/5 animate-fade-in">
            <Outlet />
          </div>
        </div>

        {/* Right Side List - Desktop */}
        <div className="hidden lg:block fixed right-0 top-20 bottom-0 w-64 glass-panel-dark p-4 border-l border-white/5">
          <div className="mb-6 p-3 glass-panel rounded-lg">
            <ShowSolBalance />
          </div>
          <div className="mb-4">
            <h2 className="text-softWhite/80 text-sm uppercase tracking-wider font-medium px-4 mb-2">Wallet Actions</h2>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'menu-item-active' 
                    : 'menu-item text-softWhite/80 hover:text-softWhite'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
          
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="glass-panel rounded-lg p-2 flex justify-center">
              <Clock />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 bg-deepBlue/95 backdrop-blur-md z-10 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4 pt-20">
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-softWhite p-2 hover:bg-white/10 rounded-full"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6 p-3 glass-panel rounded-lg">
              <ShowSolBalance />
            </div>
            <div className="mb-4">
              <h2 className="text-softWhite/80 text-sm uppercase tracking-wider font-medium px-4 mb-2">Wallet Actions</h2>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'menu-item-active'
                      : 'menu-item text-softWhite/80 hover:text-softWhite'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 px-8">
            <div className="glass-panel rounded-lg p-2 flex justify-center">
              <Clock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}