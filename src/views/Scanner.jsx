import React, { useState, useRef } from 'react';
import { Camera, Upload, Info, CheckCircle2, Droplets, AlertTriangle, Zap } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState(null); // success data
  const [waterDetected, setWaterDetected] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fileInputRef = useRef(null);
  const { addMeal, addWater, user, history } = useGlobalContext();
  const navigate = useNavigate();

  const handleMockScan = async (e) => {
    if (e) e.preventDefault();
    setIsScanning(true);
    setResult(null);
    setWaterDetected(false);
    setErrorMsg(null);
    
    try {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      } else {
        // Fallback dummy file for testing without uploading
        const blob = new Blob(['dummy'], { type: 'image/jpeg' });
        formData.append('image', blob, 'test.jpg');
      }

      // Add recent history to payload to give AI memory context
      const recentHistoryNames = history.slice(0, 5).map(m => m.name).join(', ');
      if (recentHistoryNames) {
        formData.append('recentHistory', recentHistoryNames);
      }

      // Hit the real backend connected to FatSecret
      const response = await axios.post(`${API_URL}/api/meals/scan`, formData);
      const data = response.data;

      if (data.type === 'water_detected') {
        setWaterDetected(true);
      } else if (data.type === 'success') {
        setResult(data.data);
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Error communicating with AI Router.';
      setErrorMsg(errMsg);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLogMeal = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSaving(true);
    try {
      await addMeal(result);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save meal. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogWater = () => {
    addWater();
    navigate('/');
  };

  const handleLoginSuccess = async () => {
    setShowAuthModal(false);
    setIsSaving(true);
    try {
      await addMeal(result);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save meal. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col min-h-full">
      <header className="mb-6">
        <h1 className="text-3xl">Scan Meal</h1>
        <p className="text-secondary mt-1">AI-powered nutritional analysis</p>
      </header>

      {/* Non-Food Error State */}
      {errorMsg && (
        <div className="card border-red-200 bg-red-50 text-center animate-fade-in mb-4">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Scan Failed</h2>
          <p className="text-red-600 mb-6">{errorMsg}</p>
          <button className="btn bg-red-600 text-white w-full" onClick={() => fileInputRef.current?.click()}>
            Try Again
          </button>
        </div>
      )}

      {/* Water Detected State */}
      {waterDetected && (
        <div className="card border-blue-200 bg-blue-50 text-center animate-fade-in mb-4">
          <Droplets size={48} className="text-blue-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-blue-800 mb-2">Hydration Detected!</h2>
          <p className="text-blue-600 mb-6">Looks like a glass of water. Would you like to log it?</p>
          <div className="flex gap-3">
            <button className="btn btn-outline border-blue-300 text-blue-700 flex-1" onClick={() => setWaterDetected(false)}>Cancel</button>
            <button className="btn bg-blue-600 text-white flex-1" onClick={handleLogWater}>Log 1 Glass</button>
          </div>
        </div>
      )}

      {/* Default Camera Upload State */}
      {!result && !waterDetected && !errorMsg ? (
        <div className="flex-1 flex flex-col justify-center items-center pb-10">
          <div 
            className="w-full aspect-square bg-white rounded-[32px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden shadow-sm transition-all"
            onClick={() => !isScanning && fileInputRef.current?.click()}
            style={{ boxShadow: isScanning ? 'var(--shadow-glow)' : 'var(--shadow-md)' }}
          >
            {isScanning ? (
              <div className="text-center z-10">
                <div className="w-20 h-20 border-4 border-slate-100 border-t-accent rounded-full animate-spin mb-4 mx-auto" style={{ borderTopColor: 'var(--accent-color)' }}></div>
                <p className="font-bold text-accent text-lg">Routing Image...</p>
                <p className="text-xs text-secondary mt-1">Classifying item type</p>
                <div className="absolute top-0 left-0 w-full h-1 bg-accent-color animate-scan" style={{ background: 'var(--accent-gradient)' }}></div>
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Camera size={40} className="text-slate-400" />
                </div>
                <p className="font-semibold text-lg text-slate-600">Tap to Scan</p>
                <p className="text-sm mt-1">or upload from gallery</p>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleMockScan} />
          </div>
        </div>
      ) : null}

      {/* Success Result State */}
      {result && (
        <div className="w-full pb-8 animate-fade-in">
          <div className="card relative overflow-hidden p-0 border-none shadow-md">
            
            <div className="p-5 bg-white text-center border-b border-slate-100">
              <span className="bg-accent-color text-white text-[10px] px-2 py-1 rounded-md font-bold mb-2 inline-block uppercase tracking-wider shadow-sm">
                {result.name.includes('Packaged') ? 'Barcode/Label Found' : 'AI Identified'}
              </span>
              <h2 className="text-2xl text-slate-800 font-extrabold leading-tight">
                {result.name}
              </h2>
            </div>
            
            <div className="p-5 bg-white">
              
              {/* Massive Centered Calorie Display */}
              <div className="text-center mb-6 mt-2">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-2">Total Calories</p>
                <h1 className="text-7xl font-black text-slate-900 tracking-tighter" style={{ lineHeight: '1' }}>{result.calories}</h1>
                <p className="text-emerald-500 font-bold mt-2">Accurate AI Estimation</p>
              </div>

              {/* Health Tags */}
              {result.healthTags && result.healthTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {result.healthTags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Minimal Macros Row */}
              <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 shadow-inner">
                <div className="text-center flex-1">
                  <p className="text-secondary text-xs font-semibold mb-1 uppercase">Protein</p>
                  <p className="font-bold text-xl text-slate-800">{result.protein}g</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center flex-1">
                  <p className="text-secondary text-xs font-semibold mb-1 uppercase">Carbs</p>
                  <p className="font-bold text-xl text-slate-800">{result.carbs}g</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center flex-1">
                  <p className="text-secondary text-xs font-semibold mb-1 uppercase">Fats</p>
                  <p className="font-bold text-xl text-slate-800">{result.fats}g</p>
                </div>
              </div>

              {/* High Impact Sugar & Suggestion */}
              <div className={`rounded-2xl p-5 border-l-4 ${result.sugar > 15 ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'} mb-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${result.sugar > 15 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <Info size={20} />
                  </div>
                  <div>
                    <p className={`font-bold ${result.sugar > 15 ? 'text-red-700' : 'text-emerald-700'}`}>
                      Sugar Impact: {result.sugar}g
                    </p>
                  </div>
                </div>
                {result.suggestion && (
                  <p className="text-sm font-medium text-slate-700 mt-2 pl-1">
                    <span className="font-bold text-slate-900">Coach Insight:</span> {result.suggestion}
                  </p>
                )}
              </div>

              {/* Better Alternative Swap */}
              {result.betterAlternative && (
                <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 shrink-0">
                      <Zap size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Healthier Swap</p>
                      <p className="text-sm text-blue-900 font-medium">{result.betterAlternative}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="btn btn-outline flex-1" onClick={() => setResult(null)} disabled={isSaving}>Retake</button>
            <button className="btn btn-primary flex-1 flex justify-center items-center gap-2" onClick={handleLogMeal} disabled={isSaving}>
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><CheckCircle2 size={20} /> Log Meal</>
              )}
            </button>
          </div>
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Scanner;
