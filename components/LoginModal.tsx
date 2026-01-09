
import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
  onSwitchToSignUp: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here.
    // For this demo, we'll just log in with a generic name.
    onLoginSuccess(email.split('@')[0] || 'User');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md flex flex-col transition-transform duration-300 transform scale-95"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: 'scale(1)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-4xl text-primary">Log In</h2>
          <button onClick={onClose} className="p-2 -mt-4 -mr-4 text-textSecondary hover:text-textPrimary rounded-full">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-lg text-lg hover:bg-orange-600 transition-colors mt-4"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-textSecondary mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="font-semibold text-primary hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
