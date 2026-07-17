import React from 'react';
import { Activity, Droplets, Footprints, Flame, TrendingDown } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

// Helper component for SVG Rings
const CircularProgress = ({ value, max, size = 120, strokeWidth = 10, color = "#10b981", icon: Icon, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(value / max, 1);
  const offset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="stat-ring-container" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle 
            className="stat-ring-bg" 
            cx={size/2} cy={size/2} r={radius} 
            strokeWidth={strokeWidth} fill="none"
          />
          <circle 
            className="stat-ring"
            cx={size/2} cy={size/2} r={radius}
            strokeWidth={strokeWidth} stroke={color} fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {Icon && <Icon size={20} color={color} className="mb-1" />}
          <span className="font-bold text-lg" style={{ lineHeight: 1 }}>{value}</span>
        </div>
      </div>
      {label && <span className="text-xs text-secondary mt-2 font-medium">{label}</span>}
    </div>
  );
};

const Dashboard = () => {
  const { stats, history, addWater, streak, scansToday } = useGlobalContext();
  
  // Get up to 3 recent meals from today
  const today = new Date().toDateString();
  const todaysMeals = history.filter(meal => new Date(meal.date).toDateString() === today);
  const recentMeals = todaysMeals.slice(0, 3);

  // Calculate Weekly Stats for Dashboard
  const now = new Date();
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const thisWeekMeals = history.filter(meal => (now - new Date(meal.date)) <= SEVEN_DAYS);
  const lastWeekMeals = history.filter(meal => {
    const timeDiff = now - new Date(meal.date);
    return timeDiff > SEVEN_DAYS && timeDiff <= 2 * SEVEN_DAYS;
  });

  let topTriggerFood = "None yet";
  let topTriggerCount = 0;
  let avgSugarChange = 0;

  if (thisWeekMeals.length > 0) {
    const frequency = {};
    thisWeekMeals.forEach(m => {
      frequency[m.name] = (frequency[m.name] || 0) + 1;
    });
    for (const [name, count] of Object.entries(frequency)) {
      if (count > topTriggerCount) {
        topTriggerFood = name;
        topTriggerCount = count;
      }
    }
    const thisWeekSugar = thisWeekMeals.reduce((acc, m) => acc + (m.sugar || 0), 0) / thisWeekMeals.length;
    if (lastWeekMeals.length > 0) {
      const lastWeekSugar = lastWeekMeals.reduce((acc, m) => acc + (m.sugar || 0), 0) / lastWeekMeals.length;
      avgSugarChange = Math.round(((lastWeekSugar - thisWeekSugar) / Math.max(lastWeekSugar, 1)) * 100);
    }
  }

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-1">Today</p>
          <h1 className="text-3xl">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full flex items-center gap-1 font-bold text-sm shadow-sm border border-orange-200">
            <Flame size={16} fill="currentColor" className="text-orange-500" /> {streak} Day Streak
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=User&background=10b981&color=fff" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Coach Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 mb-6 shadow-sm flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200">
          <span className="text-xl">👩🏽‍⚕️</span>
        </div>
        <div>
          <h3 className="font-bold text-emerald-900 text-sm mb-0.5">Your Daily Insight</h3>
          <p className="text-xs text-emerald-800 font-medium leading-relaxed">
            {stats.sugar > 50 
              ? "You've crossed your sugar limit today. Let's focus on high-protein, zero-sugar meals for dinner to balance it out!" 
              : stats.calories > 1500 
                ? "You're getting close to your calorie limit! A light soup or salad would be a great way to end the day."
                : scansToday > 0 
                  ? "Great tracking today! You're making excellent choices. Keep it up!"
                  : "Welcome back! Scan your first meal of the day to get personalized insights."}
          </p>
        </div>
      </div>

      {/* Weekly Wins Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 px-1 text-slate-800">This Week's Trends</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="card bg-indigo-50 border border-indigo-100 p-4 text-center shadow-sm">
            <TrendingDown className="text-indigo-500 mx-auto mb-2" size={24} />
            <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Avg Sugar Drop</p>
            <p className="text-2xl font-black text-indigo-900">
              {avgSugarChange > 0 ? `${avgSugarChange}%` : avgSugarChange < 0 ? `+${Math.abs(avgSugarChange)}%` : 'Steady'}
            </p>
          </div>
          <div className="card bg-orange-50 border border-orange-100 p-4 text-center flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider mb-1">Top Trigger Food</p>
            <p className="text-sm font-black text-orange-900 leading-tight mb-1">
              {topTriggerFood.length > 20 ? topTriggerFood.substring(0, 20) + '...' : topTriggerFood}
            </p>
            {topTriggerCount > 0 && (
              <p className="text-[10px] font-bold text-orange-600 bg-orange-100/50 py-1 rounded-md mx-auto px-2">Logged {topTriggerCount}x</p>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section: Calories */}
      <div className="card text-center relative overflow-hidden" style={{ padding: '2rem 1.5rem' }}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Flame size={100} />
        </div>
        <h2 className="text-sm text-secondary font-semibold uppercase tracking-wider mb-4">Calories Remaining</h2>
        <div className="flex justify-center mb-4">
          <CircularProgress 
            value={Math.max(2000 - stats.calories, 0)} 
            max={2000} 
            size={160} 
            strokeWidth={14} 
            color="url(#calGrad)" 
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="text-center mt-2 mb-4">
          <p className={`text-sm font-bold ${stats.calories > 2000 ? 'text-red-500' : 'text-emerald-500'}`}>
            {stats.calories > 2000 ? "Daily Limit Exceeded!" : `${2000 - stats.calories} kcal left. Perfect pace!`}
          </p>
        </div>
        <div className="flex justify-between items-center px-4 mt-2">
          <div>
            <p className="text-xs text-secondary font-medium">Eaten</p>
            <p className="font-bold text-lg">{stats.calories}</p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div>
            <p className="text-xs text-secondary font-medium">Goal</p>
            <p className="font-bold text-lg">2000</p>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid-cols-2">
        <div className="card flex flex-col items-center text-center">
          <CircularProgress 
            value={stats.sugar} 
            max={50} 
            size={80} 
            strokeWidth={8} 
            color={stats.sugar > 50 ? "#ef4444" : "#f59e0b"} 
            label="Sugar (g)" 
          />
          <p className={`text-xs mt-2 font-bold ${stats.sugar > 50 ? 'text-red-500' : 'text-secondary'}`}>
            {stats.sugar > 50 ? 'Limit Exceeded!' : `${Math.max(50 - stats.sugar, 0)}g remaining`}
          </p>
        </div>

        <div className="card flex flex-col items-center text-center">
          <CircularProgress 
            value={stats.steps} 
            max={10000} 
            size={80} 
            strokeWidth={8} 
            color="#8b5cf6" 
            label="Steps" 
            icon={Footprints}
          />
          <p className="text-xs text-secondary mt-1">Capacitor Mock</p>
        </div>
      </div>

      {/* Macronutrients Breakdown */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-secondary">Macronutrients</h3>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Protein</span>
            <span className="text-sm font-bold text-slate-700">{stats.protein}g <span className="text-xs font-medium text-slate-400">({stats.protein * 4} kcal)</span></span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min((stats.protein / 150) * 100, 100)}%`, background: 'var(--accent-gradient)' }}></div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Carbs</span>
            <span className="text-sm font-bold text-slate-700">{stats.carbs}g <span className="text-xs font-medium text-slate-400">({stats.carbs * 4} kcal)</span></span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((stats.carbs / 250) * 100, 100)}%`, background: 'var(--water-gradient)' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Fats</span>
            <span className="text-sm font-bold text-slate-700">{stats.fats}g <span className="text-xs font-medium text-slate-400">({stats.fats * 9} kcal)</span></span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min((stats.fats / 70) * 100, 100)}%`, background: 'var(--sugar-gradient)' }}></div>
          </div>
        </div>
      </div>

      {/* Water Tracker Widget */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Droplets className="text-blue" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Water Intake</h3>
              <p className="text-xs text-secondary">{stats.water} / 8 Glasses</p>
            </div>
          </div>
          <button 
            className="w-10 h-10 rounded-full bg-blue text-white flex items-center justify-center font-bold text-lg shadow-sm"
            style={{ background: 'var(--water-gradient)' }}
            onClick={addWater}
          >
            +
          </button>
        </div>
        <div className="flex gap-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-8 flex-1 rounded-sm ${i < stats.water ? 'bg-blue' : 'bg-slate-100'}`} style={i < stats.water ? { background: 'var(--water-gradient)' } : {}}></div>
          ))}
        </div>
      </div>

      {/* Recent Scans (Today) */}
      <div className="mt-8 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-secondary">Today's Scans</h3>
        </div>
        
        {recentMeals.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentMeals.map((meal, idx) => (
              <div key={meal._id || idx} className="card py-3 px-4 flex justify-between items-center bg-white border border-slate-100 shadow-sm">
                <div>
                  <p className="font-bold text-slate-800">{meal.name}</p>
                  <p className="text-xs text-secondary">{new Date(meal.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-slate-800">{meal.calories}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Kcal</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-6 bg-slate-50 border-dashed border-2 border-slate-200">
            <p className="text-sm text-slate-500 font-medium">No meals scanned today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
