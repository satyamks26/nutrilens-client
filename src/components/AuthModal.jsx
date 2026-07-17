import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login } = useGlobalContext();

  if (!isOpen) return null;

  const handleMockGoogleLogin = () => {
    // Mock SSO login
    login({ name: 'Guest User', email: 'guest@example.com' });
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
      <div className="card w-full max-w-sm animate-fade-in relative border-none shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-secondary font-bold text-lg leading-none p-2">&times;</button>
        
        <div className="text-center mb-6 mt-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <h2 className="text-2xl mb-2">Great Scan!</h2>
          <p className="text-secondary text-sm">Create a free account to save this meal and start tracking your goals.</p>
        </div>

        <button 
          onClick={handleMockGoogleLogin}
          className="btn flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 w-full mb-3"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>
        
        <button 
          onClick={handleMockGoogleLogin}
          className="btn flex items-center justify-center gap-3 bg-black text-white w-full"
        >
          <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 filter invert" alt="Apple" />
          Continue with Apple
        </button>
        
        <p className="text-center text-xs text-secondary mt-6">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
