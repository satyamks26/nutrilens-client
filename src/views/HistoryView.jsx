import React, { useState } from 'react';
import { Calendar, Share2, TrendingDown, Lock, Crown } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

const HistoryView = () => {
  const { history, isPremium, upgradeToPremium } = useGlobalContext();

  const handleWhatsAppShare = () => {
    const text = `NutriLens Daily Summary:\nKeep tracking to see your actual stats here!`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const now = new Date();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  
  const recentMeals = history.filter(meal => (now - new Date(meal.date)) <= ONE_DAY);
  const olderMeals = history.filter(meal => (now - new Date(meal.date)) > ONE_DAY);

  // Compute Weekly Insights
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const thisWeekMeals = history.filter(meal => (now - new Date(meal.date)) <= SEVEN_DAYS);
  const lastWeekMeals = history.filter(meal => {
    const timeDiff = now - new Date(meal.date);
    return timeDiff > SEVEN_DAYS && timeDiff <= 2 * SEVEN_DAYS;
  });

  let topTriggerFood = null;
  let topTriggerCount = 0;
  let avgSugarChange = 0;
  let weeklyInsightMessage = "Log more meals to see your weekly trends!";
  let weeklyRecommendation = "Keep tracking!";

  if (thisWeekMeals.length > 0) {
    // Find top trigger food
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

    // Sugar calc
    const thisWeekSugar = thisWeekMeals.reduce((acc, m) => acc + (m.sugar || 0), 0) / thisWeekMeals.length;
    
    if (lastWeekMeals.length > 0) {
      const lastWeekSugar = lastWeekMeals.reduce((acc, m) => acc + (m.sugar || 0), 0) / lastWeekMeals.length;
      avgSugarChange = Math.round(((lastWeekSugar - thisWeekSugar) / Math.max(lastWeekSugar, 1)) * 100);
    }

    // Recommendation logic
    if (avgSugarChange > 0) {
      weeklyInsightMessage = `Awesome! Your average sugar intake dropped by ${avgSugarChange}% compared to last week.`;
    } else if (avgSugarChange < 0) {
      weeklyInsightMessage = `Watch out, your average sugar intake increased by ${Math.abs(avgSugarChange)}% compared to last week.`;
    } else {
      weeklyInsightMessage = `You are maintaining a steady sugar intake this week.`;
    }

    if (topTriggerCount > 1) {
      weeklyRecommendation = `Top Trigger Food: ${topTriggerFood} (logged ${topTriggerCount}x). `;
      if (topTriggerFood.toLowerCase().includes('rice') || topTriggerFood.toLowerCase().includes('biryani')) {
        weeklyRecommendation += `Try swapping for millets or quinoa this week!`;
      } else if (topTriggerFood.toLowerCase().includes('sweet') || topTriggerFood.toLowerCase().includes('chocolate')) {
        weeklyRecommendation += `Try swapping for fresh fruit to manage cravings!`;
      } else {
        weeklyRecommendation += `Ensure you're balancing it with enough protein and fiber.`;
      }
    } else {
      weeklyRecommendation = `You have great variety in your diet! Keep balancing your plates.`;
    }
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl">History</h1>
          <p className="text-secondary mt-1">Your nutritional journey</p>
        </div>
        <button 
          onClick={handleWhatsAppShare}
          className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors shadow-sm"
          title="Share to WhatsApp"
        >
          <Share2 size={22} />
        </button>
      </header>

      {/* Insight Card */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 p-5 mb-8 shadow-sm">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <TrendingDown className="text-blue-500" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-lg">Weekly Insight</h4>
            <p className="text-sm text-blue-800 mt-1 font-medium leading-relaxed">
              {weeklyInsightMessage}
            </p>
            {thisWeekMeals.length > 0 && (
              <p className="text-xs text-indigo-800 mt-2 font-bold bg-indigo-100/60 p-2 rounded-lg inline-block border border-indigo-200">
                <span className="text-indigo-500 mr-1">💡</span> {weeklyRecommendation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* History List */}
      <div>
        <h3 className="text-lg font-bold mb-4 px-1">Last 24 Hours</h3>
        {recentMeals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary font-medium">No meals logged in the last 24 hours.</p>
            <p className="text-sm text-slate-400 mt-2">Scan a meal to see it here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMeals.map((meal, idx) => (
              <div key={meal._id || idx} className="card p-0 mb-0 overflow-hidden flex flex-col border border-slate-200 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[1.05rem]">{meal.name}</h4>
                      <p className="text-sm text-secondary font-medium">{new Date(meal.date).toLocaleString([], {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-800">{meal.calories} <span className="text-xs font-semibold text-secondary" style={{ WebkitTextFillColor: 'initial' }}>kcal</span></p>
                    <p className={`text-sm font-semibold ${meal.sugar > 15 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {meal.sugar}g sugar
                    </p>
                  </div>
                </div>

                {/* Macros Breakdown */}
                <div className="px-4 pb-3 flex justify-between gap-2 border-t border-slate-50 pt-3 bg-slate-50/50">
                  <div className="text-center flex-1">
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-wider">Protein</p>
                    <p className="font-semibold text-sm text-slate-800">{meal.protein}g</p>
                  </div>
                  <div className="text-center flex-1 border-x border-slate-200">
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-wider">Carbs</p>
                    <p className="font-semibold text-sm text-slate-800">{meal.carbs}g</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-wider">Fats</p>
                    <p className="font-semibold text-sm text-slate-800">{meal.fats}g</p>
                  </div>
                </div>

                {/* AI Suggestion */}
                {meal.suggestion && (
                  <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      <span className="font-bold">AI Insight:</span> {meal.suggestion}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Older History / Premium Lock */}
      {olderMeals.length > 0 && (
        <div className="mt-8 mb-10">
          <h3 className="text-lg font-bold mb-4 px-1 text-slate-400">Older Scans</h3>
          
          {isPremium ? (
            <div className="space-y-4">
               {/* Premium users see older meals here (simplified for space) */}
               {olderMeals.map((meal, idx) => (
                 <div key={meal._id || idx} className="card py-3 px-4 flex justify-between items-center bg-white border border-slate-100 shadow-sm opacity-80">
                   <div>
                     <p className="font-bold text-slate-700">{meal.name}</p>
                     <p className="text-xs text-secondary">{new Date(meal.date).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-lg text-slate-600">{meal.calories}</p>
                   </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="card border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px]"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg mb-4">
                  <Lock size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">History Locked</h3>
                <p className="text-slate-600 text-sm mb-6 max-w-[250px] mx-auto">
                  Free users can only view meals scanned in the last 24 hours.
                </p>
                <button 
                  onClick={upgradeToPremium}
                  className="btn bg-slate-900 text-white w-full flex items-center justify-center gap-2 shadow-xl"
                >
                  <Crown size={18} className="text-amber-400" /> Unlock NutriLens PRO
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
