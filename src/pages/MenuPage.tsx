import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { BookOpen, Plus, Edit2, Trash2, X, Save, Coffee, Cake, UtensilsCrossed } from 'lucide-react';
import { validatePrecio } from '../services/authService';

export default function MenuPage() {
  const { platos, addPlato, updatePlato, deletePlato, tema } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingPlato, setEditingPlato] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [errors, setErrors] = useState<{ nombre?: string; precio?: string }>({});
  const isDark = tema === 'dark';

  const [form, setForm] = useState({
    nombre: '',
    precio: 0,
    categoria: 'Comida Rápida',
    descripcion: '',
    disponible: true,
  });

  const categorias = ['Comida Rápida', 'Pastas', 'Ensaladas', 'Mexicana', 'Platos Fuertes', 'Entradas', 'Merienda', 'Café', 'Té', 'Bebidas', 'Postres'];

  const filteredPlatos = filter === 'all' ? platos : platos.filter(p => p.categoria === filter);

  const openNewPlato = () => {
    setEditingPlato(null);
    setForm({ nombre: '', precio: 0, categoria: 'Comida Rápida', descripcion: '', disponible: true });
    setErrors({});
    setShowModal(true);
  };

  const openEditPlato = (id: string) => {
    const plato = platos.find(p => p.id === id);
    if (!plato) return;
    setEditingPlato(id);
    setForm({ nombre: plato.nombre, precio: plato.precio, categoria: plato.categoria, descripcion: plato.descripcion, disponible: plato.disponible });
    setErrors({});
    setShowModal(true);
  };

  const validate = (): boolean => {
    const newErrors: { nombre?: string; precio?: string } = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (form.nombre.length > 100) newErrors.nombre = 'Máximo 100 caracteres';
    const precioValidation = validatePrecio(form.precio);
    if (!precioValidation.valid) newErrors.precio = precioValidation.error;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingPlato) {
      updatePlato(editingPlato, form);
    } else {
      addPlato(form);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deletePlato(id);
    setConfirmDelete(null);
  };

  const toggleDisponible = (id: string) => {
    const plato = platos.find(p => p.id === id);
    if (plato) {
      updatePlato(id, { disponible: !plato.disponible });
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    if (categoria === 'Café' || categoria === 'Té' || categoria === 'Bebidas') return <Coffee size={14} />;
    if (categoria === 'Merienda' || categoria === 'Postres') return <Cake size={14} />;
    return <UtensilsCrossed size={14} />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <BookOpen className="text-amber-400" size={24} />
            Gestión de Menú
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Administra los platos y categorías del restaurante
          </p>
        </div>
        <button
          onClick={openNewPlato}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Plus size={16} />
          Nuevo Plato
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            filter === 'all' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : isDark ? 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-gray-900'
          }`}
        >
          Todos
        </button>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              filter === cat ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : isDark ? 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-gray-900'
            }`}
          >
            {getCategoriaIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Platos</p>
          <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{platos.length}</p>
        </div>
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Disponibles</p>
          <p className="text-3xl font-bold mt-1 text-green-400">{platos.filter(p => p.disponible).length}</p>
        </div>
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No Disponibles</p>
          <p className="text-3xl font-bold mt-1 text-red-400">{platos.filter(p => !p.disponible).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlatos.map(plato => (
          <div
            key={plato.id}
            className={`rounded-2xl p-5 border transition-all ${isDark ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow'} ${!plato.disponible ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {plato.categoria}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${plato.disponible ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {plato.disponible ? '✓ Disponible' : '✗ No disponible'}
                  </span>
                </div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{plato.nombre}</h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{plato.descripcion}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className={`text-2xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>${plato.precio}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleDisponible(plato.id)} className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${plato.disponible ? 'text-green-400' : 'text-gray-400'}`} title={plato.disponible ? 'Desactivar' : 'Activar'}>
                  {plato.disponible ? '✓' : '✗'}
                </button>
                <button onClick={() => openEditPlato(plato.id)} className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} title="Editar">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setConfirmDelete(plato.id)} className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-red-500/10 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`} title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{editingPlato ? 'Editar Plato' : 'Nuevo Plato'}</h3>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nombre del Plato</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'} ${errors.nombre ? 'border-red-500' : ''}`}
                  placeholder="Ej: Café Americano"
                  maxLength={100}
                  required
                />
                {errors.nombre && <p className="text-xs text-red-400 mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Precio</label>
                <input
                  type="number"
                  value={form.precio || ''}
                  onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'} ${errors.precio ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
                {errors.precio && <p className="text-xs text-red-400 mt-1">{errors.precio}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Categoría</label>
                <select
                  value={form.categoria}
                  onChange={e => setForm({ ...form, categoria: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'}`}
                >
                  {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none ${isDark ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'}`}
                  placeholder="Descripción del plato..."
                  rows={3}
                  maxLength={300}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Estado:</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, disponible: !form.disponible })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${form.disponible ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                >
                  {form.disponible ? '✓ Disponible' : '✗ No disponible'}
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm transition flex items-center justify-center gap-2">
                  <Save size={14} />
                  {editingPlato ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>¿Eliminar plato?</h3>
            <p className={`text-sm mb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              El plato <strong>{platos.find(p => p.id === confirmDelete)?.nombre}</strong> será eliminado permanentemente.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm transition">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
