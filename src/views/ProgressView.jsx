import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Plus, Loader2, Weight, TrendingDown, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

const ProgressView = () => {
  const { progressPhotos, addProgressPhoto } = useGlobalContext();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [weightInput, setWeightInput] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('image', file);
    if (weightInput) {
      formData.append('weight', weightInput);
    }

    try {
      await addProgressPhoto(formData);
      setWeightInput(''); // Clear input on success
    } catch (error) {
      setErrorMsg('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Transformation Engine Logic
  const hasTransformation = progressPhotos.length >= 2;
  const newestPhoto = hasTransformation ? progressPhotos[0] : null;
  const oldestPhoto = hasTransformation ? progressPhotos[progressPhotos.length - 1] : null;
  
  let daysPassed = 0;
  let weightDiff = null;
  
  if (hasTransformation) {
    daysPassed = Math.round((new Date(newestPhoto.date) - new Date(oldestPhoto.date)) / (1000 * 60 * 60 * 24));
    if (newestPhoto.weight && oldestPhoto.weight) {
      weightDiff = (newestPhoto.weight - oldestPhoto.weight).toFixed(1);
    }
  }

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl">Progress</h1>
          <p className="text-secondary mt-1">Track your physical transformation</p>
        </div>
      </header>

      {/* Upload Action with Weight */}
      <div className="card mb-8 shadow-sm p-4 bg-white border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Log New Progress</h3>
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <input 
              type="text" 
              inputMode="decimal"
              placeholder="Enter Current Weight (kg)"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
            />
          </div>
        </div>
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleUpload} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`btn btn-primary w-full flex items-center justify-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin text-white" size={20} />
              <span className="font-bold">Securely Uploading...</span>
            </>
          ) : (
            <>
              <Camera size={20} />
              <span className="font-bold">Save Weight & Log Photo</span>
            </>
          )}
        </button>
        {errorMsg && <p className="text-red-500 text-sm text-center mt-2 font-medium">{errorMsg}</p>}
      </div>

      {/* Before / After Transformation Hero */}
      {hasTransformation && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 px-1 text-slate-800 flex items-center gap-2">
            Transformation <span className="text-xl">🔥</span>
          </h3>
          
          {/* Side-by-Side Images */}
          <div className="flex rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-6 bg-white">
            <div className="flex-1 relative h-64 border-r border-slate-200">
              <img src={oldestPhoto.imageUrl} alt="Before" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">BEFORE</div>
              {oldestPhoto.weight && (
                <div className="absolute bottom-2 left-2 bg-white/95 text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-md">
                  {oldestPhoto.weight} kg
                </div>
              )}
            </div>
            <div className="flex-1 relative h-64">
              <img src={newestPhoto.imageUrl} alt="After" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">CURRENT</div>
              {newestPhoto.weight && (
                <div className="absolute bottom-2 left-2 bg-white/95 text-emerald-700 text-xs font-bold px-2 py-1 rounded shadow-md">
                  {newestPhoto.weight} kg
                </div>
              )}
            </div>
          </div>

          {/* Motivational Stats Row */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="card bg-indigo-50 border border-indigo-100 p-4 flex flex-col items-center justify-center text-center">
              <CalendarIcon className="text-indigo-500 mb-1" size={20} />
              <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">Time Passed</p>
              <p className="text-2xl font-black text-indigo-900">{daysPassed} <span className="text-sm font-bold text-indigo-700">days</span></p>
            </div>
            
            <div className={`card border p-4 flex flex-col items-center justify-center text-center ${
              weightDiff < 0 ? 'bg-emerald-50 border-emerald-100' : 
              weightDiff > 0 ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'
            }`}>
              {weightDiff < 0 ? <TrendingDown className="text-emerald-500 mb-1" size={20} /> : 
               weightDiff > 0 ? <TrendingUp className="text-orange-500 mb-1" size={20} /> : 
               <Weight className="text-slate-400 mb-1" size={20} />}
              
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                weightDiff < 0 ? 'text-emerald-800' : weightDiff > 0 ? 'text-orange-800' : 'text-slate-600'
              }`}>Weight Change</p>
              
              <p className={`text-2xl font-black ${
                weightDiff < 0 ? 'text-emerald-600' : weightDiff > 0 ? 'text-orange-600' : 'text-slate-700'
              }`}>
                {weightDiff ? `${weightDiff > 0 ? '+' : ''}${weightDiff}` : '0'} <span className={`text-sm font-bold ${weightDiff < 0 ? 'text-emerald-500' : weightDiff > 0 ? 'text-orange-500' : 'text-slate-500'}`}>kg</span>
              </p>
            </div>
          </div>
          
          <div className="text-center py-2">
            <p className="text-sm font-bold text-slate-500">You've logged <span className="text-slate-800">{progressPhotos.length}</span> photos. Keep it up!</p>
          </div>
        </div>
      )}

      {/* Grid Gallery */}
      <div>
        <h3 className="text-lg font-bold mb-4 px-1 text-slate-700">All Logs</h3>
        
        {progressPhotos.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ImageIcon size={32} />
            </div>
            <p className="text-slate-600 font-medium">No progress photos yet.</p>
            <p className="text-sm text-slate-400 mt-1 max-w-[250px] mx-auto">Upload your first photo today to start tracking your journey!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {progressPhotos.map((photo, idx) => {
              // Calculate previous weight to show trend indicator on gallery cards
              const prevPhoto = idx < progressPhotos.length - 1 ? progressPhotos[idx + 1] : null;
              let trend = null;
              if (photo.weight && prevPhoto && prevPhoto.weight) {
                trend = photo.weight - prevPhoto.weight;
              }

              return (
                <div key={photo._id || idx} className="card p-2 relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 group flex flex-col">
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-2">
                    <img 
                      src={photo.imageUrl} 
                      alt={`Progress ${idx}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                      {new Date(photo.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <div className="px-1 pb-1 flex justify-between items-center">
                    <div>
                      {photo.weight ? (
                        <p className="font-bold text-slate-800 text-sm">{photo.weight} <span className="text-[10px] text-slate-500 font-medium">kg</span></p>
                      ) : (
                        <p className="font-medium text-slate-400 text-xs">No weight</p>
                      )}
                    </div>
                    {trend !== null && (
                      <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trend < 0 ? 'text-emerald-500' : trend > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                        {trend < 0 ? <TrendingDown size={12} /> : trend > 0 ? <TrendingUp size={12} /> : null}
                        {Math.abs(trend).toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressView;
