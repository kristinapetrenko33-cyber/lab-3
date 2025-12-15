import React, { useState } from "react";
import axios from "axios";

const WaterCalculator = () => {
  const [formData, setFormData] = useState({
    riverName: "Dnipro_Station_1",
    Cbg: "",
    Cd: "",
    Qr: "",
    Qd: "",
    n: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const generateSyntheticData = () => {
    const random = (min, max) => Math.random() * (max - min) + min;

    setFormData({
      riverName: "River_Obj_" + Math.floor(Math.random() * 999),
      Cbg: random(0, 1).toFixed(3),
      Cd: random(0.1, 50).toFixed(2),
      Qr: random(1, 1000).toFixed(1),
      Qd: random(0.01, 5).toFixed(3),
      n: random(1, 5).toFixed(2),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const payload = {
        riverName: formData.riverName,
        Cbg: parseFloat(formData.Cbg),
        Cd: parseFloat(formData.Cd),
        Qr: parseFloat(formData.Qr),
        Qd: parseFloat(formData.Qd),
        n: parseFloat(formData.n),
      };

      const response = await axios.post(
        "http://localhost:5000/api/water/calc",
        payload
      );
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Calculation Error");
    }
  };

  // Стилі для input, щоб не дублювати код
  const inputClass =
    "w-full bg-slate-900 border border-slate-700 text-emerald-300 p-2 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm";
  const labelClass =
    "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ЛІВА ЧАСТИНА - ФОРМА */}
      <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 shadow-xl relative overflow-hidden">
        {/* Декоративна смужка зліва */}
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Input Parameters</h2>
          <button
            type="button"
            onClick={generateSyntheticData}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-emerald-400 px-3 py-1 border border-slate-600 transition"
          >
            [ Auto-Fill Data ]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>River Identifier</label>
            <input
              name="riverName"
              value={formData.riverName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>C_bg (Backgr. Conc)</label>
              <input
                type="number"
                step="any"
                name="Cbg"
                value={formData.Cbg}
                onChange={handleChange}
                className={inputClass}
                required
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelClass}>C_d (Discharge Conc)</label>
              <input
                type="number"
                step="any"
                name="Cd"
                value={formData.Cd}
                onChange={handleChange}
                className={inputClass}
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Q_r (River Flow)</label>
              <input
                type="number"
                step="any"
                name="Qr"
                value={formData.Qr}
                onChange={handleChange}
                className={inputClass}
                required
                placeholder="m³/s"
              />
            </div>
            <div>
              <label className={labelClass}>Q_d (Discharge Flow)</label>
              <input
                type="number"
                step="any"
                name="Qd"
                value={formData.Qd}
                onChange={handleChange}
                className={inputClass}
                required
                placeholder="m³/s"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Mixing Coeff (n)</label>
            <input
              type="number"
              step="any"
              name="n"
              value={formData.n}
              onChange={handleChange}
              className={inputClass}
              required
              placeholder="1 - 100"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(5,150,105,0.4)]"
          >
            Execute Calculation
          </button>
        </form>
      </div>

      {/* ПРАВА ЧАСТИНА - РЕЗУЛЬТАТ (КОНСОЛЬ) */}
      <div className="lg:col-span-1 space-y-4">
        {/* Блок статусу */}
        <div className="bg-black p-4 border border-slate-800 font-mono text-sm h-full min-h-[200px] flex flex-col">
          <div className="border-b border-slate-800 pb-2 mb-2 text-slate-600 text-xs">
            /// SYSTEM_OUTPUT_LOG ///
          </div>

          {!result && !error && (
            <div className="text-slate-600 flex-grow flex items-center justify-center italic">
              Waiting for input data...
            </div>
          )}

          {error && (
            <div className="text-red-500 bg-red-900/20 p-2 border-l-2 border-red-500">
              <span className="font-bold">ERROR:</span> {error}
            </div>
          )}

          {result && (
            <div className="animate-pulse-once">
              <div className="text-emerald-500 mb-2">
                Calculation successful.
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Target:</span>
                  <span className="text-slate-300">{result.riverName}</span>
                </div>

                <div className="my-4">
                  <span className="text-slate-500 block text-xs">
                    RESULT (C_max):
                  </span>
                  <span className="text-3xl font-bold text-emerald-400">
                    {Number(result.Cmax).toFixed(4)}
                  </span>
                  <span className="text-emerald-700 ml-2 text-sm">mg/L</span>
                </div>

                <div className="text-xs text-slate-600 pt-4">
                  TIMESTAMP: <br />
                  {new Date(result.createdAt).toISOString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Додаткова інфо-панелька для "ваги" дизайну */}
        <div className="bg-slate-800 p-4 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase">System Status</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm text-slate-300">Server Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterCalculator;
