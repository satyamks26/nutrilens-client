import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { Crown, Check, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProUpgrade = () => {
  const { upgradeToPremium, isPremium } = useGlobalContext();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    upgradeToPremium();
    alert('Welcome to NutriLens PRO!');
    navigate('/');
  };

  if (isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center px-4">
        <Crown size={64} className="text-yellow-500 mb-4" />
        <h1 className="text-3xl mb-2">You are a PRO!</h1>
        <p className="text-secondary mb-8">Enjoy unlimited AI scans and deep sugar insights.</p>
        <button className="btn btn-outline" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10">
      <header className="text-center mb-8 mt-4">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full mb-4 shadow-sm">
          <Crown size={32} className="text-yellow-600" />
        </div>
        <h1 className="text-3xl">NutriLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">PRO</span></h1>
        <p className="text-secondary mt-2">Unlock the ultimate nutrition intelligence.</p>
      </header>

      <div className="card border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
          Most Popular
        </div>
        
        <div className="text-center mb-6 pt-2">
          <p className="text-4xl font-bold">₹99<span className="text-lg text-secondary font-medium">/month</span></p>
          <p className="text-sm text-secondary mt-1">Cancel anytime</p>
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3">
            <Check size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Unlimited AI Scans</span>
              <span className="text-sm text-secondary">Never hit the daily limit.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Check size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Deep Sugar Insights</span>
              <span className="text-sm text-secondary">Precise glycemic index tracking for Indian meals.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Check size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Smart Alternatives</span>
              <span className="text-sm text-secondary">AI suggests healthier swaps to hit your macros.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Check size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">WhatsApp Export</span>
              <span className="text-sm text-secondary">Send weekly reports directly to your dietitian.</span>
            </div>
          </li>
        </ul>

        <button 
          onClick={handleUpgrade}
          className="btn flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg border-none"
        >
          Upgrade Now <ArrowRight size={18} />
        </button>
      </div>
      
      <p className="text-center text-xs text-slate-400">
        Free tier includes 3 scans per day and 3-day history.
      </p>
    </div>
  );
};

export default ProUpgrade;
