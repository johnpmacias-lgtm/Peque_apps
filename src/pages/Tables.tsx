import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { UtensilsCrossed, Plus, Users as UsersIcon } from 'lucide-react';

export default function Tables() {
  const { mesas, pedidos, updateMesaEstado, platos, addPedido, currentUser, tema } = useStore();
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<{ platoId: number; cantidad: number; notas: string }[]>([]);
  const [notasGenerales, setNotasGenerales] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const isDark = tema === 'dark';

  const handleSelectMesa = (mesaId: number) => {
    const mesa = mesas.find(m => m.id === mesaId);
    if (mesa?.estado === 'libre' || mesa?.estado === 'ocupada') {
      setSelectedMesa(mesaId);
      setOrderItems([]);
      setNotasGenerales('');
      setShowOrderModal(true);
    }
  };

  const addItem = (platoId: number) => {
    const existing = orderItems.find(i => i.platoId === platoId);
    if (existing) {
      setOrderItems(orderItems.map(i =>
        i.platoId === platoId ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      setOrderItems([...orderItems, { platoId, cantidad: 1, notas: '' }]);
    }
  };

  const removeItem = (platoId: number) => {
    setOrderItems(orderItems.filter(i => i.platoId !== platoId));
  };

  const updateQuantity = (platoId: number, delta: number) => {
    setOrderItems(orderItems.map(i => {
      if (i.platoId === platoId) {
        const newQty = i.cantidad + delta;
        return newQty > 0 ? { ...i, cantidad: newQty } : i;
      }
      return i;
    }));
  };

  const handlePlaceOrder = () => {
    if (selectedMesa && orderItems.length > 0) {
      addPedido(selectedMesa, orderItems, notasGenerales);
      setShowOrderModal(false);
      setSelectedMesa(null);
      setOrderItems([]);
    }
  };

  const total = orderItems.reduce((sum, item) => {
    const plato = platos.find(p => p.id === item.platoId);
    return sum + (plato?.precio || 0) * item.cantidad;
  }, 0);

  const categorias = [...new Set(platos.map(p => p.categoria))];

  const getMesaPedido = (mesaId: number) => {
    return pedidos.find(p => p.mesa_id === mesaId && p.estado !== 'pagado' && p.estado !== 'cancelado');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <UtensilsCrossed className="text-amber-400" size={24} />
            Gestión de Mesas
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Selecciona una mesa libre para tomar un pedido</p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {mesas.map(mesa => {
          const pedido = getMesaPedido(mesa.id);
          return (
            <button
              key={mesa.id}
              onClick={() => handleSelectMesa(mesa.id)}
              disabled={mesa.estado === 'reservada'}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                mesa.estado === 'libre'
                  ? 'bg-green-500/5 border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50 cursor-pointer'
                  : mesa.estado === 'ocupada'
                  ? 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 cursor-pointer'
                  : 'bg-yellow-500/5 border-yellow-500/30 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${
                  mesa.estado === 'libre' ? 'text-green-400' :
                  mesa.estado === 'ocupada' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {mesa.numero}
                </span>
                <UsersIcon size={16} className={
                  mesa.estado === 'libre' ? 'text-green-500/50' :
                  mesa.estado === 'ocupada' ? 'text-red-500/50' : 'text-yellow-500/50'
                } />
              </div>
              <p className="text-xs text-gray-500">Capacidad: {mesa.capacidad}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full capitalize ${
                mesa.estado === 'libre' ? 'bg-green-500/10 text-green-400' :
                mesa.estado === 'ocupada' ? 'bg-red-500/10 text-red-400' :
                'bg-yellow-500/10 text-yellow-400'
              }`}>
                {mesa.estado}
              </span>
              {pedido && (
                <div className="mt-2 pt-2 border-t border-gray-700/30">
                  <p className="text-xs text-gray-400">{pedido.items.length} items</p>
                  <p className="text-xs text-amber-400 font-semibold">${pedido.total}</p>
                  <p className="text-xs text-blue-400 mt-1">+ Agregar pedido</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Nuevo Pedido — Mesa {mesas.find(m => m.id === selectedMesa)?.numero}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Mesero: {currentUser?.nombre}</p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className={`p-2 rounded-lg transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Menu */}
              <div className="flex-1 overflow-y-auto p-5">
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Menú</h4>
                {categorias.map(cat => (
                  <div key={cat} className="mb-4">
                    <h5 className="text-xs font-semibold text-amber-400 uppercase mb-2">{cat}</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {platos.filter(p => p.categoria === cat && p.disponible).map(plato => {
                        const inOrder = orderItems.find(i => i.platoId === plato.id);
                        return (
                          <div
                            key={plato.id}
                            className={`flex items-center justify-between p-3 rounded-xl border transition ${
                              inOrder
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : 'bg-gray-900/50 border-gray-700/30 hover:bg-gray-700/30'
                            }`}
                          >
                            <div>
                              <p className="text-sm font-medium text-white">{plato.nombre}</p>
                              <p className="text-xs text-gray-500">${plato.precio}</p>
                            </div>
                            {inOrder ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(plato.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center text-sm"
                                >
                                  -
                                </button>
                                <span className="text-sm font-bold text-white w-6 text-center">{inOrder.cantidad}</span>
                                <button
                                  onClick={() => updateQuantity(plato.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center text-sm"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addItem(plato.id)}
                                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition"
                              >
                                <Plus size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className={`w-72 border-l p-5 flex flex-col ${isDark ? 'border-gray-700/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
                <h4 className={`text-sm font-semibold uppercase mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pedido</h4>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {orderItems.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">Agrega platos al pedido</p>
                  ) : (
                    orderItems.map(item => {
                      const plato = platos.find(p => p.id === item.platoId);
                      return (
                        <div key={item.platoId} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{plato?.nombre}</p>
                            <p className="text-xs text-gray-500">x{item.cantidad} — ${(plato?.precio || 0) * item.cantidad}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.platoId)}
                            className="text-red-400 hover:text-red-300 text-xs ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <textarea
                    value={notasGenerales}
                    onChange={e => setNotasGenerales(e.target.value)}
                    placeholder="Notas generales..."
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none mb-3"
                    rows={2}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Total:</span>
                    <span className="text-xl font-bold text-white">${total}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderItems.length === 0}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                  >
                    Enviar a Cocina
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
