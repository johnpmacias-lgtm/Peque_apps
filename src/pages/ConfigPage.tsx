import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings, Save, Check } from 'lucide-react';

export default function ConfigPage() {
  const { restauranteConfig, updateConfig } = useStore();
  const [form, setForm] = useState(restauranteConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="text-amber-400" size={24} />
          Configuración del Restaurante
        </h1>
        <p className="text-gray-400 mt-1">Personaliza la información de tu negocio</p>
      </div>

      {/* Form */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 space-y-5">
        {/* Logo Preview */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-900/50 rounded-2xl flex items-center justify-center text-5xl border border-gray-700/50">
            {form.logotipo}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Logotipo (Emoji)</label>
            <input
              type="text"
              value={form.logotipo}
              onChange={e => setForm({ ...form, logotipo: e.target.value })}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-32"
              maxLength={2}
            />
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre del Restaurante</label>
          <input
            type="text"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Dirección</label>
          <input
            type="text"
            value={form.direccion}
            onChange={e => setForm({ ...form, direccion: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Teléfono y Moneda */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Teléfono</label>
            <input
              type="text"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Moneda</label>
            <select
              value={form.moneda}
              onChange={e => setForm({ ...form, moneda: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="ARS">ARS - Peso Argentino</option>
            </select>
          </div>
        </div>

        {/* Tema */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Tema</label>
          <div className="flex gap-3">
            <button
              onClick={() => setForm({ ...form, tema: 'dark' })}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                form.tema === 'dark'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-gray-700/50 border-gray-600/30 text-gray-400'
              }`}
            >
              🌙 Oscuro
            </button>
            <button
              onClick={() => setForm({ ...form, tema: 'light' })}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                form.tema === 'light'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-gray-700/50 border-gray-600/30 text-gray-400'
              }`}
            >
              ☀️ Claro
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-700/50">
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
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Vista Previa</h3>
        <div className="bg-gray-900/50 rounded-xl p-6 text-center border border-gray-700/30">
          <span className="text-5xl">{form.logotipo}</span>
          <h2 className="text-xl font-bold text-white mt-2">{form.nombre}</h2>
          <p className="text-sm text-gray-400 mt-1">{form.direccion}</p>
          <p className="text-sm text-gray-400">{form.telefono}</p>
          <p className="text-xs text-amber-400 mt-2">Moneda: {form.moneda}</p>
        </div>
      </div>
    </div>
  );
}
