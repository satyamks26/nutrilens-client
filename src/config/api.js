// NutriLens API Configuration
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slashes if present
export const API_URL = rawApiUrl.trim().replace(/\/+$/, '');

// Helper to check if connected to local vs production
export const isLocalApi = API_URL.includes('localhost') || API_URL.includes('127.0.0.1');

console.log(`[NutriLens] API Base URL configured to: ${API_URL}`);
