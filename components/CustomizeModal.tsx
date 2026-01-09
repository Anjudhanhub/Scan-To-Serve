import React, { useState, useEffect } from 'react';
import type { MenuItem, Customization, CustomizationOption } from '../types';
import { CloseIcon } from './Icons';

interface CustomizeModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (selectedCustomizations: { [key: string]: string | string[] }) => void;
}

const CustomizeModal: React.FC<CustomizeModalProps> = ({ item, onClose, onAddToCart }) => {
  const [selected, setSelected] = useState<{ [key: string]: string | string[] }>({});

  useEffect(() => {
    // Set default values for radio button customizations
    // FIX: Correctly type `defaults` to allow string arrays for checkbox customizations, resolving a type mismatch.
    const defaults: { [key: string]: string | string[] } = {};
    item.customizations?.forEach(cust => {
        if (cust.type === 'radio' && cust.options.length > 0) {
            defaults[cust.name] = cust.options[0].name;
        } else if (cust.type === 'checkbox') {
            defaults[cust.name] = [];
        }
    });
    setSelected(defaults);
  }, [item]);


  const handleRadioChange = (custName: string, optName: string) => {
    setSelected(prev => ({...prev, [custName]: optName }));
  };
  
  const handleCheckboxChange = (custName: string, optName: string) => {
    setSelected(prev => {
        const currentSelection = (prev[custName] as string[] || []);
        const newSelection = currentSelection.includes(optName)
            ? currentSelection.filter(name => name !== optName)
            : [...currentSelection, optName];
        return {...prev, [custName]: newSelection };
    });
  };

  const handleSubmit = () => {
    onAddToCart(selected);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md flex flex-col transition-transform duration-300 transform scale-95"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: 'scale(1)' }}
      >
        <div className="flex justify-between items-start mb-4">
            <div>
                 <h2 className="text-2xl font-bold text-textPrimary">{item.name}</h2>
                 <p className="text-lg font-semibold text-primary">Rs.{item.price.toFixed(2)}</p>
            </div>
          <button onClick={onClose} className="p-2 -mt-2 -mr-2 text-textSecondary hover:text-textPrimary rounded-full">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow space-y-4">
            {item.customizations?.map((cust: Customization) => (
                <div key={cust.name}>
                    <h3 className="font-semibold text-textPrimary mb-2">{cust.name}</h3>
                    <div className="space-y-1">
                        {cust.type === 'radio' && cust.options.map((opt: CustomizationOption) => (
                            <label key={opt.name} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <input 
                                    type="radio"
                                    name={cust.name}
                                    value={opt.name}
                                    checked={(selected[cust.name] as string) === opt.name}
                                    onChange={() => handleRadioChange(cust.name, opt.name)}
                                    className="h-4 w-4 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-textSecondary">{opt.name}</span>
                            </label>
                        ))}
                         {cust.type === 'checkbox' && cust.options.map((opt: CustomizationOption) => (
                            <label key={opt.name} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    name={opt.name}
                                    value={opt.name}
                                    checked={(selected[cust.name] as string[] || []).includes(opt.name)}
                                    onChange={() => handleCheckboxChange(cust.name, opt.name)}
                                    className="h-4 w-4 text-primary focus:ring-primary rounded"
                                />
                                <span className="ml-3 text-textSecondary">{opt.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-primary text-white font-bold py-3 rounded-lg text-lg hover:bg-orange-600 transition-colors"
            >
              Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;