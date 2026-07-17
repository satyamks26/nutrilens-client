# NutriLens Client 📸🥗

Welcome to the frontend of **NutriLens**, a modern web application designed to scan, analyze, and track your daily nutrition using AI. The frontend is built using **React**, **Vite**, and styled with custom UI components.

## 🚀 Features Implemented

-   **AI Scanner (`Scanner.jsx`)**: Snap or upload photos of your meals to get instant nutritional breakdown powered by Gemini AI.
-   **Dashboard (`Dashboard.jsx`)**: View your daily calorie budget, macronutrient progress (carbs, protein, fats), and logged meals.
-   **History View (`HistoryView.jsx`)**: Review your past meals and calorie trends over time.
-   **Progress Tracker (`ProgressView.jsx`)**: Upload and compare progress photos to visualize physical changes.
-   **Profile Settings (`Profile.jsx`)**: Personalize your daily target calories and macros.
-   **Pro Tier (`ProUpgrade.jsx`)**: Premium features display, custom goals, and advanced metrics.

---

## 🛠️ Technology Stack

-   **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/)
-   **Routing**: [React Router DOM v7](https://reactrouter.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **HTTP Client**: [Axios](https://axios-http.com/)

---

## 💻 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1.  Navigate to the `client/` folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app will run locally at `http://localhost:5173`.

### Building for Production

To build the static files for production (output will be in the `dist/` directory):

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
