import React, { useMemo, useRef, useEffect, useState } from 'react';
import { RESTAURANT_DATA } from '../constants';
import { QrCodeIcon, MicrophoneIcon } from './Icons';
import type { Restaurant, MenuItem as MenuItemType } from '../types';
import MenuItem from './MenuItem';

interface HomeScreenProps {
  restaurant: Restaurant;
  onAddToCartClick: (item: MenuItemType) => void;
  scrollTarget: string | null;
  clearScrollTarget: () => void;
  onOpenChatbot?: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ restaurant, onAddToCartClick, scrollTarget, clearScrollTarget, onOpenChatbot }) => {
  const favouriteFood = RESTAURANT_DATA.menu.find(item => item.name === 'Biryani');
  const menuRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');

  const categories = useMemo(() => 
    ['Main Dish', 'Appetizers', 'Desserts', 'Beverages'], 
    []
  );
  
  // Set default active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
        setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredMenu = useMemo(() => {
    if (!searchQuery) return restaurant.menu;
    return restaurant.menu.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, restaurant.menu]);

  // Intersection Observer for Active Link Highlighting
  useEffect(() => {
    const observerOptions = {
      root: null,
      // Adjust rootMargin to handle sticky header offsets
      // -180px from top pushes the "trigger line" down so sections activate when they are under the headers
      rootMargin: '-180px 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const categoryId = entry.target.id;
             // Match back to original category name
            const matchedCategory = categories.find(c => c.replace(' ', '-') === categoryId);
            if (matchedCategory) {
                setActiveCategory(matchedCategory);
            }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    categories.forEach(category => {
      const element = document.getElementById(category.replace(' ', '-'));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [categories, filteredMenu]);

  useEffect(() => {
    if (scrollTarget) {
      if (scrollTarget === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        let elementRef: React.RefObject<HTMLElement> | null = null;
        if (scrollTarget === 'menu') elementRef = menuRef;
        if (scrollTarget === 'about') elementRef = aboutRef;
        elementRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }
      clearScrollTarget();
    }
  }, [scrollTarget, clearScrollTarget]);

  const handleScrollToCategory = (category: string) => {
      const id = category.replace(' ', '-');
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveCategory(category); // Immediate visual feedback
      }
  };

  const handleVoiceInput = () => {
    if (isListening) return;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    // Use 'any' to bypass TS check for non-standard webkitSpeechRecognition if types aren't available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        alert(
          "Microphone access is blocked.\n\n" +
          "To enable voice search:\n" +
          "1. Click the lock icon (🔒) or settings icon in your browser's address bar.\n" +
          "2. Select 'Site Settings' or 'Permissions'.\n" +
          "3. Allow 'Microphone' access."
        );
      } else if (event.error === 'no-speech') {
        // Silently handle no speech by just resetting listening state
      } else {
        console.warn("Voice search failed:", event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 text-center md:text-left overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-1/2 -right-1/4 w-[50rem] h-[50rem] bg-yellow-200/50 rounded-full -translate-y-1/2 z-0"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-100/50 rounded-full z-0"></div>
        <div className="absolute top-2/3 left-1/4 w-40 h-40 bg-orange-100/50 rounded-full z-0"></div>

         <div className="relative z-20">
            <div className="relative w-2/3 md:w-1/3 p-1 rounded-full border-2 border-gray-200 shadow-sm mb-8 focus-within:ring-2 focus-within:ring-primary mx-auto md:mx-0 bg-white flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
              <input 
                type="text" 
                placeholder={isListening ? "Listening..." : "Search for food..."}
                className="w-full p-2 ml-2 rounded-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className={`p-2 mr-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-primary hover:bg-orange-100'}`}
                onClick={handleVoiceInput}
                title="Search by Voice"
              >
                  <MicrophoneIcon className="h-5 w-5" />
              </button>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-textPrimary leading-tight font-sans">
              Best Way To Place Your Order
            </h2>
            <p className="mt-4">
                <span className="text-xl md:text-2xl mr-4">Only at</span>
                <span className="text-4xl md:text-6xl font-display text-primary">
                Scan To Serve
                </span>
            </p>
            <div className="w-40 h-1 bg-primary my-6 mx-auto md:mx-0"></div>

            <p className="max-w-md mx-auto md:mx-0 my-8 text-textSecondary">
              Good food brings happiness and health together in every bite. It's not just about taste—it's about freshness, nutrition, and love in cooking. A balanced meal made with fresh ingredients keeps your body active and your mind positive.
            </p>

            <button
              onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-white font-bold py-3 px-8 rounded-md text-lg transform hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Order Now &gt;
            </button>
         </div>
      </section>

      {/* Favourite Food Section */}
      {favouriteFood && !searchQuery && (
        <section>
          <h2 className="font-display text-5xl text-primary mb-8">Favourite Food</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-2xl shadow-lg">
              <div className="relative">
                <img src={favouriteFood.imageUrl} alt={favouriteFood.name} className="w-64 h-64 rounded-full object-cover shadow-lg border-4 border-white"/>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg text-center shadow-md">
                   <h4 className="font-bold text-xl">{favouriteFood.name}</h4>
                   <p className="text-sm text-gray-600">15 min</p>
                   <StarRating rating={favouriteFood.rating} />
                </div>
              </div>
              <div className="text-center md:text-left">
                  <h3 className="text-5xl font-bold text-textPrimary font-sans">{favouriteFood.name}</h3>
                  <p className="text-lg text-textSecondary max-w-lg mt-4">
                    The biryani was absolutely delicious and full of rich flavors. The rice was perfectly cooked — soft, aromatic, and infused with the right blend of spices.
                  </p>
              </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      <section ref={menuRef} id="menu">
         <h2 className="font-display text-5xl text-primary mb-4 text-center">Menu</h2>
        
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md shadow-sm py-4 mb-8 border-b border-gray-100 rounded-lg">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                 {/* Categories Links */}
                <div className="flex justify-center flex-wrap gap-x-4 md:gap-x-8 gap-y-2">
                {categories.map(category => (
                    <button
                    key={category}
                    onClick={() => handleScrollToCategory(category)}
                    className={`py-2 px-1 md:px-4 text-lg font-semibold transition-all duration-200 border-b-2 
                        ${activeCategory === category 
                            ? 'text-primary border-primary bg-primary/5 rounded-t-lg' 
                            : 'text-textSecondary border-transparent hover:text-primary hover:bg-gray-50'}`}
                    >
                    {category}
                    </button>
                ))}
                </div>

                {/* Secondary Voice Search Bar */}
                <div className="relative w-full md:w-72 group">
                     <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Voice order search..."
                        className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                     />
                     <button 
                        onClick={handleVoiceInput}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-primary hover:bg-gray-100'}`}
                        title="Voice Search"
                     >
                        <MicrophoneIcon className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                     </button>
                </div>
            </div>
        </div>

        {filteredMenu.length > 0 ? (
            <div className="space-y-12">
                {categories.map(category => {
                    const itemsInCategory = filteredMenu.filter(item => item.category === category);
                    if (itemsInCategory.length === 0) return null;

                    return (
                        <div key={category} id={category.replace(' ', '-')} className="scroll-mt-40">
                            <h3 className="text-3xl font-bold text-textPrimary mb-6 font-sans">{category}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {itemsInCategory.map(item => (
                                    <MenuItem key={item.id} item={item} onAddToCartClick={onAddToCartClick} />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="text-center py-16 text-textSecondary">
                <p className="text-xl font-semibold">No dishes found for "{searchQuery}"</p>
                <p>Try searching for something else!</p>
            </div>
        )}
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="text-center py-16">
        <h2 className="font-display text-5xl text-primary mb-12">About</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl mx-auto">
          <div className="p-8 border-4 border-primary rounded-2xl bg-white/50 animate-pulse">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ScanToServe" alt="QR Code" className="w-48 h-48"/>
          </div>
          <div className="max-w-md text-center md:text-left">
            <h3 className="font-display text-4xl text-primary mb-4">Scan To Serve</h3>
            <p className="text-xl text-textPrimary font-semibold leading-relaxed">
              The User Can Easy To Place Your Order in ScanTo Serve is Best Way To Place The Order ForTime Save.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;