
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CogIcon, ReceiptIcon, CreditCardIcon, MapIcon, ArrowLeftIcon } from './Icons';
import type { View } from '../types';

interface SettingsScreenProps {
  onNavigate: (view: View) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
      <header className="text-center relative flex items-center justify-center">
        <button 
            onClick={() => onNavigate('home')}
            className="absolute left-0 p-2 text-textSecondary hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            aria-label="Go back to home"
        >
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
            <h1 className="font-display text-5xl text-primary">Settings</h1>
            <p className="text-textSecondary mt-2">Manage your app preferences and history.</p>
        </div>
      </header>

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => onNavigate('orders')}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20 group"
        >
           <div className="bg-blue-100 p-4 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
             <ReceiptIcon className="w-8 h-8 text-blue-600" />
           </div>
           <span className="font-bold text-lg text-textPrimary">Order History</span>
           <span className="text-xs text-textSecondary mt-1">View past orders</span>
        </button>

        <button 
          onClick={() => onNavigate('orders')}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20 group"
        >
           <div className="bg-green-100 p-4 rounded-full mb-3 group-hover:bg-green-200 transition-colors">
             <CreditCardIcon className="w-8 h-8 text-green-600" />
           </div>
           <span className="font-bold text-lg text-textPrimary">Payment History</span>
           <span className="text-xs text-textSecondary mt-1">Check transaction details</span>
        </button>

        <button 
          onClick={() => onNavigate('map')}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20 group"
        >
           <div className="bg-orange-100 p-4 rounded-full mb-3 group-hover:bg-orange-200 transition-colors">
             <MapIcon className="w-8 h-8 text-orange-600" />
           </div>
           <span className="font-bold text-lg text-textPrimary">Shop Map</span>
           <span className="text-xs text-textSecondary mt-1">Locate the restaurant</span>
        </button>
      </div>

      {/* Theme Settings */}
      <div className="bg-white/50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-textPrimary mb-4 flex items-center gap-2">
            <CogIcon className="w-6 h-6" /> App Appearance
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {Object.entries(themes).map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`flex-1 p-4 rounded-lg border-4 transition-all duration-200 ${
                theme === key ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'
              }`}
              style={{ backgroundColor: `rgb(${themeData.colors['--color-background']})` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: `rgb(${themeData.colors['--color-text-primary']})` }}>
                  {themeData.name}
                </span>
                <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: `rgb(${themeData.colors['--color-primary']})`}}></div>
                    <div className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: `rgb(${themeData.colors['--color-secondary']})`}}></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
