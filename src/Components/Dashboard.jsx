import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShowSolBalance } from './ShowSolBalance';
import { Clock } from './Clock';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Request Airdrop', path: '/dashboard/request-airdrop' },
    { name: 'Send Tokens', path: '/dashboard/send-tokens' },
    { name: 'Sign Message', path: '/dashboard/sign-message' },
    { name: 'Token Launchpad', path: '/dashboard/token-launchpad' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Solana Wallet</h1>
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="pt-20 flex">
        {/* Main Content Area */}
        <div className="flex-1 p-8 mr-64">
          <div className="max-w-3xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* Right Side List */}
        <div className="fixed right-0 top-20 bottom-0 w-64 bg-gray-800 p-4">
          <div className="mb-6">
            <ShowSolBalance />
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Clock */}
      <Clock />
    </div>
  );
}
