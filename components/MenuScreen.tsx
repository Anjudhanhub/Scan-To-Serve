
import React, { useMemo } from 'react';
import type { Restaurant, MenuItem as MenuItemType } from '../types';
import MenuItem from './MenuItem';

interface MenuScreenProps {
  restaurant: Restaurant;
  onAddToCartClick: (item: MenuItemType) => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ restaurant, onAddToCartClick }) => {
  const categories = useMemo(() => 
    ['Main Dish', 'Appetizers', 'Desserts', 'Beverages'], 
    []
  );

  return (
    <div className="text-center">
       <h2 className="font-display text-5xl text-primary mb-4">Menu</h2>
      
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-sm py-4 mb-8 border-b-2 border-gray-200">
        <div className="flex justify-center flex-wrap gap-x-4 md:gap-x-8 gap-y-2">
          {categories.map(category => (
             <a
              key={category}
              href={`#menu-${category.replace(' ', '-')}`}
              onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`menu-${category.replace(' ', '-')}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2 px-1 md:px-4 text-lg font-semibold transition-colors duration-200 text-textSecondary hover:text-primary"
            >
              {category}
            </a>
          ))}
        </div>
      </div>

       <div className="space-y-12">
            {categories.map(category => (
                <div key={category} id={`menu-${category.replace(' ', '-')}`}>
                    <h3 className="text-3xl font-bold text-textPrimary mb-6 font-sans">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {restaurant.menu.filter(item => item.category === category).map(item => (
                            <MenuItem key={item.id} item={item} onAddToCartClick={onAddToCartClick} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default MenuScreen;