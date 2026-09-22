import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings, Save, Check } from 'lucide-react';

export default function ConfigPage() {
  const { restauranteConfig, updateConfig, tema } = useStore();
  const [form, setForm] = useState(restauranteConfig);
  const [saved, setSaved] = useState(false);
  const isDark = tema === 'dark';

  const handleSave = () => {
    updateConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Settings className="text-amber-400" size={24} />
          Configuración del Restaurante
        </h1>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Personaliza la información de tu negocio</p>
      </div>

      {/* Form */}
      <div className={`rounded-2xl p-6 space-y-5 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        {/* Logo Preview */}
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl border ${
            isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'
          }`}>
            {form.logotipo}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Logotipo (Emoji)
            </label>
            <input
              type="text"
              value={form.logotipo}
              onChange={e => setForm({ ...form, logotipo: e.target.value })}
              className={`px-4 py-2 rounded-xl text-sm w-32 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'
              }`}
              maxLength={2}
            />
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Nombre del Restaurante
          </label>
          <input
            type="text"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
              isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Dirección */}
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Dirección
          </label>
          <input
            type="text"
            value={form.direccion}
            onChange={e => setForm({ ...form, direccion: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
              isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Teléfono y Moneda */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Teléfono
            </label>
            <input
              type="text"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Moneda
            </label>
            <select
              value={form.moneda}
              onChange={e => setForm({ ...form, moneda: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'
              }`}
            >
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="ARS">ARS - Peso Argentino</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className={`pt-4 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
          <button
            onClick={handleSave}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/20'
            }`}
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? '¡Guardado!' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className={`rounded-2xl p-6 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`text-sm font-semibold uppercase mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Vista Previa
        </h3>
        <div className={`rounded-xl p-6 text-center border ${isDark ? 'bg-gray-900/50 border-gray-700/30' : 'bg-gray-50 border-gray-200'}`}>
          <span className="text-5xl">{form.logotipo}</span>
          <h2 className={`text-xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{form.nombre}</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{form.direccion}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{form.telefono}</p>
          <p className="text-xs text-amber-400 mt-2">Moneda: {form.moneda}</p>
        </div>
      </div>
    </div>
  );
}
