import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Package, AlertTriangle, Plus, Search, TrendingDown,
  TrendingUp, Filter, RefreshCw
} from 'lucide-react';

export default function Inventory() {
  const { ingredientes, updateIngredienteStock, addIngrediente, alertas, platos, generarAlertas, tema } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [restockId, setRestockId] = useState<number | null>(null);
  const [restockAmount, setRestockAmount] = useState('');
  const isDark = tema === 'dark';

  const categories = [...new Set(ingredientes.map(i => i.categoria))];

  const filtered = ingredientes.filter(i => {
    const matchSearch = i.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || i.categoria === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleRestock = () => {
    if (restockId && restockAmount) {
      updateIngredienteStock(restockId, parseInt(restockAmount));
      setRestockId(null);
      setRestockAmount('');
    }
  };

  const getStockPercentage = (actual: number, minimo: number) => {
    return Math.min(100, (actual / (minimo * 3)) * 100);
  };

  const getStockColor = (actual: number, minimo: number) => {
    if (actual <= minimo * 0.3) return 'bg-red-500';
    if (actual <= minimo) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-amber-400" size={24} />
            Control de Inventario
          </h1>
          <p className="text-gray-400 mt-1">Gestión de ingredientes y stock</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => generarAlertas()}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-xl text-sm flex items-center gap-2 transition"
          >
            <RefreshCw size={14} />
            Actualizar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
          >
            <Plus size={14} />
            Nuevo Ingrediente
          </button>
        </div>
      </div>

      {/* Alerts Summary */}
      {alertas.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-400" size={18} />
            <h3 className="text-sm font-semibold text-red-400">
              {alertas.length} ingrediente{alertas.length > 1 ? 's' : ''} con stock bajo
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertas.map(a => (
              <span key={a.id} className={`text-xs px-2 py-1 rounded-lg ${
                a.nivel === 'critical'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}>
                {a.ingrediente_nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ingrediente..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
              isDark ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className={`px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
            isDark ? 'bg-gray-800/50 border border-gray-700/50 text-gray-300' : 'bg-white border border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">Todas las categorías</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                <th className={`text-left px-5 py-3 text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ingrediente</th>
                <th className={`text-left px-5 py-3 text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Categoría</th>
                <th className={`text-right px-5 py-3 text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Stock Actual</th>
                <th className={`text-right px-5 py-3 text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Stock Mínimo</th>
                <th className={`text-left px-5 py-3 text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Nivel</th>
                <th className={`text-center px-5 py-3 text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ing => (
                <tr key={ing.id} className={`border-b transition ${isDark ? 'border-gray-700/30 hover:bg-gray-700/20' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="px-5 py-3">
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{ing.nombre}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{ing.categoria}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-mono font-semibold ${
                      ing.stock_actual <= ing.stock_minimo * 0.3 ? 'text-red-400' :
                      ing.stock_actual <= ing.stock_minimo ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {ing.stock_actual.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">{ing.unidad_medida}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm text-gray-400 font-mono">{ing.stock_minimo.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{ing.unidad_medida}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getStockColor(ing.stock_actual, ing.stock_minimo)}`}
                          style={{ width: `${getStockPercentage(ing.stock_actual, ing.stock_minimo)}%` }}
                        />
                      </div>
                      {ing.stock_actual <= ing.stock_minimo && (
                        <TrendingDown size={14} className="text-red-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => setRestockId(ing.id)}
                      className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs transition"
                    >
                      + Reabastecer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Reabastecer Stock</h3>
            <p className="text-sm text-gray-400 mb-4">
              Ingrediente: <span className="text-white font-medium">
                {ingredientes.find(i => i.id === restockId)?.nombre}
              </span>
            </p>
            <input
              type="number"
              value={restockAmount}
              onChange={e => setRestockAmount(e.target.value)}
              placeholder="Cantidad a agregar"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setRestockId(null); setRestockAmount(''); }}
                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestock}
                className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm transition"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Ingredient Modal */}
      {showAddModal && <AddIngredientModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

function AddIngredientModal({ onClose }: { onClose: () => void }) {
  const { addIngrediente } = useStore();
  const [form, setForm] = useState({
    nombre: '',
    stock_actual: 0,
    stock_minimo: 0,
    unidad_medida: 'g',
    categoria: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIngrediente(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Nuevo Ingrediente</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            placeholder="Nombre del ingrediente"
            className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={form.stock_actual || ''}
              onChange={e => setForm({ ...form, stock_actual: parseInt(e.target.value) || 0 })}
              placeholder="Stock actual"
              className="px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
              required
            />
            <input
              type="number"
              value={form.stock_minimo || ''}
              onChange={e => setForm({ ...form, stock_minimo: parseInt(e.target.value) || 0 })}
              placeholder="Stock mínimo"
              className="px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.unidad_medida}
              onChange={e => setForm({ ...form, unidad_medida: e.target.value })}
              className="px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="g">Gramos (g)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="pz">Piezas (pz)</option>
              <option value="kg">Kilogramos (kg)</option>
              <option value="L">Litros (L)</option>
            </select>
            <input
              type="text"
              value={form.categoria}
              onChange={e => setForm({ ...form, categoria: e.target.value })}
              placeholder="Categoría"
              className="px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
