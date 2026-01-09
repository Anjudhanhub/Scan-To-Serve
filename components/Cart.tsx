
import React, { useMemo, useState, useEffect } from 'react';
import type { CartItem, Order, UserDetails, PaymentMethod } from '../types';
import { CloseIcon, PlusIcon, MinusIcon, CartIcon, ArrowLeftIcon, UserIcon, CreditCardIcon, BanknotesIcon, DevicePhoneMobileIcon } from './Icons';
import { saveOrder } from '../services/supabaseClient';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

type CheckoutStep = 'cart' | 'details' | 'payment';

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, updateQuantity, clearCart }) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [userDetails, setUserDetails] = useState<UserDetails>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    mobile: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
        setStep('cart');
        setShowConfirmation(false);
        setIsProcessing(false);
    }
  }, [isOpen]);

  const subtotal = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateDetails = () => {
    return userDetails.firstName.trim() !== '' && 
           userDetails.lastName.trim() !== '' && 
           userDetails.email.trim() !== '' && 
           userDetails.mobile.trim() !== '';
  };

  const handleFinalizeCheckout = async () => {
    setIsProcessing(true);
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cartItems,
      total: total,
      status: 'Order Placed',
      userDetails: userDetails,
      paymentMethod: paymentMethod
    };

    try {
      // Save to Supabase
      await saveOrder(newOrder);

      // Save to localStorage as a backup
      try {
        const existingOrdersJSON = localStorage.getItem('userOrders');
        const existingOrders: Order[] = existingOrdersJSON ? JSON.parse(existingOrdersJSON) : [];
        const updatedOrders = [...existingOrders, newOrder];
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      } catch (e) {
         console.warn("Could not save backup to local storage", e);
      }

      alert(`Order Placed Successfully!\n\nName: ${userDetails.firstName} ${userDetails.lastName}\nAmount: Rs.${total.toFixed(2)}\nPayment: ${paymentMethod.toUpperCase()}`);
      clearCart();
      onClose();
      // Reset state for next time
      setTimeout(() => {
          setStep('cart');
          setUserDetails({ 
            firstName: '', 
            lastName: '', 
            email: '', 
            mobile: ''
          });
          setPaymentMethod('upi');
          setIsProcessing(false);
      }, 500);

    } catch (error) {
      console.error("Order processing failed", error);
      alert("There was an error processing your order. Please check your connection and try again.");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div
        className="fixed top-0 right-0 bottom-0 bg-white w-full max-w-md shadow-2xl flex flex-col transition-transform duration-300 transform"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
                {step !== 'cart' && (
                    <button 
                        onClick={() => setStep(step === 'payment' ? 'details' : 'cart')} 
                        className="text-textSecondary hover:text-primary rounded-full p-1 hover:bg-gray-100 transition-colors"
                        disabled={isProcessing}
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                )}
                <h2 className="text-2xl font-bold font-display text-primary">
                    {step === 'cart' && 'Your Order'}
                    {step === 'details' && 'Your Details'}
                    {step === 'payment' && 'Payment'}
                </h2>
            </div>
            <button onClick={onClose} className="p-2 text-textSecondary hover:text-textPrimary rounded-full" disabled={isProcessing}>
                <CloseIcon className="h-6 w-6" />
            </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-4">
            
            {/* STEP 1: CART ITEMS */}
            {step === 'cart' && (
                <>
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col justify-center items-center text-center">
                            <CartIcon className="h-24 w-24 text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-textPrimary mb-2">Your cart is empty</h3>
                            <p className="text-textSecondary mb-6">Looks like you haven't added anything to your order yet.</p>
                            <button
                                onClick={onClose}
                                className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-orange-600 transition-colors"
                            >
                                Start Ordering
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                             {cartItems.map(item => (
                                <div key={item.cartItemId} className="flex items-start justify-between py-2 border-b last:border-b-0">
                                <div className="flex items-start">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                                    <div className="flex-grow">
                                    <p className="font-bold text-lg text-textPrimary">{item.name}</p>
                                    {item.selectedCustomizations && (
                                        <div className="text-xs text-gray-500 mt-1">
                                        {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                            <div key={key}>
                                            - {Array.isArray(value) ? value.join(', ') : value}
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end justify-between h-20">
                                    <p className="font-semibold text-textPrimary mb-2">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                                    <div className="flex items-center">
                                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><MinusIcon className="h-4 w-4" /></button>
                                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><PlusIcon className="h-4 w-4" /></button>
                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* STEP 2: USER DETAILS */}
            {step === 'details' && (
                <div className="space-y-6 animate-slide-up">
                    <div className="bg-orange-50 p-4 rounded-lg flex items-center gap-3">
                        <UserIcon className="w-6 h-6 text-primary" />
                        <p className="text-sm text-gray-700">Please enter your billing details.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-textSecondary mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={userDetails.firstName}
                                    onChange={handleInputChange}
                                    placeholder="John"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-textSecondary mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={userDetails.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Doe"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-textSecondary mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={userDetails.email}
                                onChange={handleInputChange}
                                placeholder="john@example.com"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textSecondary mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={userDetails.mobile}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 'payment' && (
                <div className="space-y-6 animate-slide-up">
                     <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-4 text-textPrimary">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-textSecondary">Name</span>
                                <span className="font-medium">{userDetails.firstName} {userDetails.lastName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textSecondary">Mobile</span>
                                <span className="font-medium">{userDetails.mobile}</span>
                            </div>
                            <div className="border-t border-gray-200 my-2 pt-2"></div>
                            <div className="flex justify-between text-textSecondary">
                                <span>Subtotal</span>
                                <span>Rs.{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-textSecondary">
                                <span>Tax (8%)</span>
                                <span>Rs.{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-primary mt-2">
                                <span>Total Payable</span>
                                <span>Rs.{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-3 text-textPrimary">Select Payment Method</h3>
                        <div className="space-y-3">
                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary bg-orange-50 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50'}`}>
                                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-primary focus:ring-primary" />
                                <div className="ml-3 flex items-center gap-2">
                                    <DevicePhoneMobileIcon className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-textPrimary">UPI / GPay / PhonePe</p>
                                        <p className="text-xs text-textSecondary">Fast & Secure</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-orange-50 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50'}`}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-primary focus:ring-primary" />
                                <div className="ml-3 flex items-center gap-2">
                                    <CreditCardIcon className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="font-semibold text-textPrimary">Credit / Debit Card</p>
                                        <p className="text-xs text-textSecondary">Visa, Mastercard, RuPay</p>
                                    </div>
                                </div>
                            </label>

                             <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-orange-50 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50'}`}>
                                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-primary focus:ring-primary" />
                                <div className="ml-3 flex items-center gap-2">
                                    <BanknotesIcon className="w-6 h-6 text-orange-600" />
                                    <div>
                                        <p className="font-semibold text-textPrimary">Cash on Delivery</p>
                                        <p className="text-xs text-textSecondary">Pay when served</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Footer Actions */}
        {cartItems.length > 0 && (
             <div className="p-4 border-t-2 bg-gray-50">
                 {step === 'cart' && (
                    <div className="space-y-3">
                         <div className="flex justify-between text-textPrimary font-bold text-xl">
                            <span>Total</span>
                            <span>Rs.{total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => setShowConfirmation(true)}
                            className="w-full bg-primary text-white font-bold py-3 rounded-lg text-lg hover:bg-orange-600 transition-colors"
                        >
                            Checkout
                        </button>
                    </div>
                 )}

                 {step === 'details' && (
                    <button
                        onClick={() => setStep('payment')}
                        disabled={!validateDetails()}
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg text-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Proceed to Payment
                    </button>
                 )}

                 {step === 'payment' && (
                    <button
                        onClick={handleFinalizeCheckout}
                        disabled={isProcessing}
                        className={`w-full text-white font-bold py-3 rounded-lg text-lg shadow-lg transition-colors flex justify-center items-center ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isProcessing ? 'Processing...' : `Pay Rs.${total.toFixed(0)} & Confirm`}
                    </button>
                 )}
             </div>
        )}
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={() => !isProcessing && setShowConfirmation(false)}>
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-textPrimary mb-2">Checkout Summary</h3>
                    <p className="text-textSecondary">Please review your order total before proceeding.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Items Count:</span>
                        <span className="font-semibold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} items</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-600">Subtotal:</span>
                         <span className="font-semibold">Rs.{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-600">Tax (8%):</span>
                         <span className="font-semibold">Rs.{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-lg font-bold text-primary">
                        <span>Grand Total:</span>
                        <span>Rs.{total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowConfirmation(false)}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            setShowConfirmation(false);
                            setStep('details');
                        }}
                        className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md"
                        disabled={isProcessing}
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Cart;
