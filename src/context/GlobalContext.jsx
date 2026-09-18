import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  // Pre-login the user for seamless testing
  const [user, setUser] = useState({ name: 'Nidhi', email: 'nidhi@example.com' }); 
  const [isPremium, setIsPremium] = useState(false);
  
  const [stats, setStats] = useState({
    calories: 0,
    sugar: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    steps: 0,
    water: 0
  });

  const [history, setHistory] = useState([]);
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [scansToday, setScansToday] = useState(0);
  const [streak, setStreak] = useState(5); // Mocked streak

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const upgradeToPremium = () => setIsPremium(true);

  // Fetch data on load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/meals/history`);
        const dbHistory = response.data;
        setHistory(dbHistory);
        
        // Calculate today's stats
        const today = new Date().toDateString();
        const todaysMeals = dbHistory.filter(meal => new Date(meal.date).toDateString() === today);
        
        let cals = 0, sug = 0, pro = 0, car = 0, fat = 0;
        todaysMeals.forEach(m => {
          cals += m.calories || 0; sug += m.sugar || 0; pro += m.protein || 0; car += m.carbs || 0; fat += m.fats || 0;
        });
        
        setStats(prev => ({
          ...prev, calories: cals, sugar: sug, protein: pro, carbs: car, fats: fat
        }));
        setScansToday(todaysMeals.length);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    const fetchProgressPhotos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/progress`);
        setProgressPhotos(response.data);
      } catch (error) {
        console.error("Failed to fetch progress photos:", error);
      }
    };
    fetchHistory();
    fetchProgressPhotos();
  }, []);

  const addMeal = async (meal) => {
    try {
      // Send to backend MongoDB
      const response = await axios.post(`${API_URL}/api/meals`, meal);
      const savedMeal = response.data;

      // Update UI state
      setStats(prev => ({
        ...prev,
        calories: prev.calories + savedMeal.calories,
        sugar: prev.sugar + savedMeal.sugar,
        protein: prev.protein + savedMeal.protein,
        carbs: prev.carbs + savedMeal.carbs,
        fats: prev.fats + savedMeal.fats,
      }));
      
      setHistory(prev => [savedMeal, ...prev]);
      setScansToday(prev => prev + 1);
    } catch (error) {
      console.error("Failed to save meal to database:", error);
      throw error;
    }
  };

  const addWater = () => {
    setStats(prev => ({ ...prev, water: Math.min(prev.water + 1, 8) }));
  };

  const addProgressPhoto = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/api/progress`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProgressPhotos([response.data, ...progressPhotos]);
      return response.data;
    } catch (error) {
      console.error("Error saving progress photo:", error);
      throw error;
    }
  };

  return (
    <GlobalContext.Provider value={{ 
      stats, history, progressPhotos, scansToday, streak, addMeal, addWater, addProgressPhoto,
      user, isPremium, login, logout, upgradeToPremium 
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
