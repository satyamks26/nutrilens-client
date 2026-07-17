import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { User as UserIcon, LogOut, Settings, Crown, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const Profile = () => {
  const { user, isPremium, logout } = useGlobalContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <header className="mb-6">
        <h1 className="text-3xl">Profile</h1>
        <p className="text-secondary mt-1">Manage your account</p>
      </header>

      {user ? (
        <>
          <div className="card text-center relative overflow-hidden mb-6">
            {isPremium && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                <Crown size={12} /> PRO
              </div>
            )}
            <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center border-4 ${isPremium ? 'border-yellow-400' : 'border-accent'} shadow-sm bg-slate-100`}>
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=f1f5f9&color=0f172a`} alt="User" className="rounded-full w-full h-full" />
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-secondary text-sm flex items-center justify-center gap-1 mt-1"><Mail size={14} /> {user.email}</p>
          </div>

          {!isPremium && (
            <div 
              onClick={() => navigate('/pro')}
              className="card bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                  <Crown size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-900">Upgrade to PRO</h3>
                  <p className="text-xs text-yellow-700">Unlock unlimited scans</p>
                </div>
              </div>
              <span className="text-yellow-600 font-bold">&rarr;</span>
            </div>
          )}

          <div className="card p-2">
            <button className="flex items-center gap-3 w-full p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
              <Settings size={20} className="text-slate-500" />
              <span className="font-medium">Settings & Preferences</span>
            </button>
            <hr className="border-slate-100 my-1" />
            <button onClick={logout} className="flex items-center gap-3 w-full p-3 text-left hover:bg-red-50 text-danger rounded-lg transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </>
      ) : (
        <div className="card text-center py-10">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <UserIcon size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">Guest User</h2>
          <p className="text-secondary text-sm mb-6 px-4">Create a free account to save your scan history across devices.</p>
          <button className="btn btn-primary w-auto px-8" onClick={() => setShowAuthModal(true)}>Sign In / Register</button>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLoginSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Profile;
