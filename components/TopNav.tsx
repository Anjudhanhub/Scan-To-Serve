
import React from 'react';
import type { View } from '../types';
import { CartIcon, QrCodeIcon, CameraIcon } from './Icons';

interface TopNavProps {
  activeView: View;
  onNav: (view: View, sectionId?: string) => void;
  onCartClick: () => void;
  cartItemCount: number;
  onScanClick: () => void;
  onShowAppQr: () => void;
  tableInfo: string | null;
}

const NavLink: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  mobile?: boolean;
}> = ({ label, isActive, onClick, mobile }) => (
  <button
    onClick={onClick}
    className={`
        px-3 py-2 font-sans transition-colors duration-200 whitespace-nowrap
        ${mobile ? 'text-sm font-bold flex-1 text-center' : 'text-lg'}
        ${isActive ? 'text-primary' : 'text-textSecondary hover:text-primary'}
        ${mobile && isActive ? 'border-b-2 border-primary bg-primary/5 rounded-t-md' : ''}
    `}
  >
    {label}
  </button>
);

const TopNav: React.FC<TopNavProps> = ({ 
    activeView, 
    onNav, 
    onCartClick, 
    cartItemCount, 
    onScanClick, 
    onShowAppQr,
    tableInfo
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm shadow-md z-40 transition-all">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex justify-between items-center h-16 md:h-20">
            <h1 className="font-display text-2xl md:text-4xl text-primary cursor-pointer truncate mr-2" onClick={() => onNav('home')}>
            Scan To Serve
            </h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
            <NavLink label="Home" isActive={activeView === 'home'} onClick={() => onNav('home')} />
            <NavLink label="Menu" isActive={false} onClick={() => onNav('home', 'menu')} />
            <NavLink label="About" isActive={false} onClick={() => onNav('home', 'about')} />
            <NavLink label="Settings" isActive={activeView === 'settings'} onClick={() => onNav('settings')} />
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 md:space-x-2 shrink-0">
                <button 
                    onClick={onShowAppQr}
                    className="p-2 text-textPrimary hover:bg-primary/10 rounded-full transition-colors"
                    title="Show App QR Code"
                >
                    <QrCodeIcon className="h-6 w-6 md:h-7 md:w-7" />
                </button>

                <button 
                    onClick={onScanClick}
                    className="p-2 text-textPrimary hover:bg-primary/10 rounded-full transition-colors relative group"
                    title="Scan QR Code"
                >
                    <CameraIcon className="h-6 w-6 md:h-7 md:w-7" />
                    {tableInfo && (
                    <span className="absolute -bottom-8 right-0 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap hidden md:block">
                        {tableInfo}
                    </span>
                    )}
                </button>

                <button onClick={onCartClick} className="relative p-2 text-textPrimary hover:bg-primary/10 rounded-full transition-colors">
                    <CartIcon className="h-6 w-6 md:h-7 md:w-7" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
        
        {/* Mobile Navigation Row */}
        <nav className="md:hidden flex items-center justify-between pb-2 overflow-x-auto no-scrollbar border-t border-gray-100 pt-1 space-x-1">
             <NavLink label="Home" isActive={activeView === 'home'} onClick={() => onNav('home')} mobile />
             <NavLink label="Menu" isActive={false} onClick={() => onNav('home', 'menu')} mobile />
             <NavLink label="About" isActive={false} onClick={() => onNav('home', 'about')} mobile />
             <NavLink label="Settings" isActive={activeView === 'settings'} onClick={() => onNav('settings')} mobile />
        </nav>
      </div>
    </header>
  );
};

export default TopNav;
