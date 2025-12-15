import React from "react";
import WaterCalculator from "./WaterCalculator";

function App() {
  return (
    // Змінено bg-gray-100 на bg-slate-900 (темна тема)
    <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-bold text-emerald-400 tracking-wider">
            HYDRO<span className="text-white">METRIC</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            System Module: Mixing_Calc_v4
          </p>
        </header>
        <WaterCalculator />
      </div>
    </div>
  );
}

export default App;
