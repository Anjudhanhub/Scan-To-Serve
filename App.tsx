
import React, { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import OrdersScreen from './components/OrdersScreen';
import SettingsScreen from './components/SettingsScreen';
import MapScreen from './components/MapScreen';
import TopNav from './components/TopNav';
import Cart from './components/Cart';
import CustomizeModal from './components/CustomizeModal';
import QRScannerModal from './components/QRScannerModal';
import Chatbot from './components/Chatbot';
import type { View, CartItem, MenuItem as MenuItemType } from './types';
import { RESTAURANT_DATA } from './constants';
import { ThemeProvider } from './contexts/ThemeContext';
import { CloseIcon } from './components/Icons';

type ModalType = 'none' | 'cart' | 'qrscanner' | 'appQr';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customizingItem, setCustomizingItem] = useState<MenuItemType | null>(null);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [tableInfo, setTableInfo] = useState<string | null>(null);
  
  // Unique App ID for the QR code to simulate a unique session/table
  const uniqueAppId = React.useMemo(() => Math.random().toString(36).substring(7).toUpperCase(), []);

  const addItemToCart = useCallback((item: MenuItemType, selectedCustomizations?: { [key: string]: string | string[] }) => {
    setCart(prevCart => {
      const cartItemId = item.id + JSON.stringify(selectedCustomizations || {});
      const existingItem = prevCart.find(cartItem => cartItem.cartItemId === cartItemId);

      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.cartItemId === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1, selectedCustomizations, cartItemId }];
    });
  }, []);
  
  const handleAddToCartClick = useCallback((item: MenuItemType) => {
      if (item.customizations && item.customizations.length > 0) {
          setCustomizingItem(item);
      } else {
          addItemToCart(item);
      }
  }, [addItemToCart]);


  const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.cartItemId !== cartItemId);
      }
      return prevCart.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleNav = (targetView: View, sectionId?: string) => {
      setView(targetView);
      if (sectionId) {
          setScrollTarget(sectionId);
      } else if (targetView === 'home') {
          // If navigating to home without a section, scroll to top
          setScrollTarget('top');
      }
  };

  const handleScan = (data: string) => {
    // In a real app, this data would ID a table or restaurant menu
    // We'll simulate a successful scan
    setActiveModal('none');
    setTableInfo(data); // e.g. "Table 5" or "Menu-123"
    alert(`Successfully scanned! Loaded info for: ${data}`);
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeScreen 
                 restaurant={RESTAURANT_DATA} 
                 onAddToCartClick={handleAddToCartClick}
                 scrollTarget={scrollTarget}
                 clearScrollTarget={() => setScrollTarget(null)}
                 onOpenChatbot={() => {
                   const fab = document.querySelector('button[aria-label="Open AI Chatbot"]') as HTMLButtonElement;
                   if (fab) fab.click();
                 }}
               />;
      case 'orders':
        return <OrdersScreen onBack={() => setView('settings')} />;
      case 'settings':
        return <SettingsScreen onNavigate={(v) => handleNav(v)} />;
      case 'map':
        return <MapScreen restaurant={RESTAURANT_DATA} onBack={() => setView('settings')} />;
      default:
        return <HomeScreen 
                 restaurant={RESTAURANT_DATA} 
                 onAddToCartClick={handleAddToCartClick}
                 scrollTarget={scrollTarget}
                 clearScrollTarget={() => setScrollTarget(null)}
               />;
    }
  };

  return (
    <ThemeProvider>
      <div className="font-sans text-textPrimary min-h-screen bg-background">
        <TopNav 
          activeView={view} 
          onNav={handleNav}
          onCartClick={() => setActiveModal('cart')} 
          cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          onScanClick={() => setActiveModal('qrscanner')}
          onShowAppQr={() => setActiveModal('appQr')}
          tableInfo={tableInfo}
        />
        <main className="container mx-auto px-4 py-8 pt-32 md:pt-28">
          {renderView()}
        </main>
        
        {/* Global Components */}
        <Chatbot />
        
        <Cart 
          isOpen={activeModal === 'cart'} 
          onClose={() => setActiveModal('none')} 
          cartItems={cart} 
          updateQuantity={updateCartQuantity}
          clearCart={clearCart}
        />
        <QRScannerModal
            isOpen={activeModal === 'qrscanner'}
            onClose={() => setActiveModal('none')}
            onScan={handleScan}
        />
        {customizingItem && (
          <CustomizeModal 
            item={customizingItem}
            onClose={() => setCustomizingItem(null)}
            onAddToCart={(customizations) => {
              addItemToCart(customizingItem, customizations);
              setCustomizingItem(null);
            }}
          />
        )}
        
        {/* App QR Code Modal */}
        {activeModal === 'appQr' && (
             <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setActiveModal('none')}>
                <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-primary font-display">Scan To Serve</h2>
                        <button onClick={() => setActiveModal('none')} className="text-gray-400 hover:text-gray-600">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="bg-white p-2 rounded-lg border-4 border-primary inline-block mb-6 shadow-inner">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ScanToServe_AppID_${uniqueAppId}&color=F97316`} 
                            alt="Scan To Serve App QR" 
                            className="w-56 h-56 md:w-64 md:h-64" 
                        />
                    </div>
                    <p className="text-textSecondary mb-2 font-medium">Unique App ID: <span className="font-mono text-primary">{uniqueAppId}</span></p>
                    <p className="text-textSecondary mb-6 text-sm">Scan this code to connect or share this session.</p>
                    <button 
                        onClick={() => setActiveModal('none')}
                        className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-colors w-full shadow-lg"
                    >
                        Done
                    </button>
                </div>
            </div>
        )}
      </div>
      <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
              animation: fade-in 0.2s ease-out forwards;
          }
      `}</style>
    </ThemeProvider>
  );
};

export default App;
