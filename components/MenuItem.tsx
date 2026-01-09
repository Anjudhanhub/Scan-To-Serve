
import React from 'react';
import type { MenuItem as MenuItemType } from '../types';
import { PlusIcon } from './Icons';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

interface MenuItemProps {
  item: MenuItemType;
  onAddToCartClick: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCartClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 group">
      <div className="relative">
        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        {item.customizations && item.customizations.length > 0 && 
            <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">Customizable</span>
        }
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-textPrimary font-sans">{item.name}</h3>
            <p className="text-lg font-bold text-primary font-sans">Rs:{item.price.toFixed(0)}</p>
        </div>
        <div className="flex justify-between items-center">
            <StarRating rating={item.rating} />
            <button
            onClick={() => onAddToCartClick(item)}
            className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary transition-colors group-hover:bg-primary"
            aria-label={`Add ${item.name} to cart`}
            >
             <PlusIcon className="h-6 w-6" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
