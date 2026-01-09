
import React from 'react';
import type { Restaurant } from '../types';
import { MapIcon, ArrowLeftIcon } from './Icons';

interface MapScreenProps {
  restaurant: Restaurant;
  onBack: () => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ restaurant, onBack }) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.location.lat},${restaurant.location.lng}`;
  // Note: In a real app, use a real key or iframe
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${restaurant.location.lat},${restaurant.location.lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${restaurant.location.lat},${restaurant.location.lng}&key=YOUR_API_KEY_HERE`; 

  return (
    <div className="p-4 max-w-4xl mx-auto text-center">
      <div className="relative mb-8 flex items-center justify-center">
          <button 
            onClick={onBack}
            className="absolute left-0 p-2 text-textSecondary hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            aria-label="Go back to settings"
          >
             <ArrowLeftIcon className="w-8 h-8" />
          </button>
          <h2 className="font-display text-5xl text-primary">Shop Map</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Placeholder for Map since we don't have a real API key for dynamic maps in this demo environment. 
            Using a visual placeholder or iframe approach is common. */}
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-50/50 flex flex-col items-center justify-center p-8">
                 <MapIcon className="w-16 h-16 text-primary mb-4" />
                 <p className="text-textSecondary text-lg font-semibold">Map View Placeholder</p>
                 <p className="text-sm text-textSecondary">(Integrate Google Maps API or Leaflet here)</p>
            </div>
        </div>

        <div className="p-8">
            <h3 className="text-3xl font-bold text-textPrimary mb-6">{restaurant.name}</h3>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <a 
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-orange-600 md:text-lg transition-colors"
                >
                    Get Directions on Google Maps
                </a>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h4 className="font-bold text-lg mb-2">Address</h4>
                    <p className="text-textPrimary">{restaurant.address}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Coordinates</h4>
                    <p>Latitude: {restaurant.location.lat}</p>
                    <p>Longitude: {restaurant.location.lng}</p>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Opening Hours</h4>
                    <p>Mon - Sun: 10:00 AM - 10:00 PM</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
