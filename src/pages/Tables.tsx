import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatoEcuador } from '../store/useStore';
import { UtensilsCrossed, Plus, Users as UsersIcon, Calendar, Phone, X, CheckCircle } from 'lucide-react';

export default function Tables() {
  const { mesas, pedidos, updateMesaEstado, platos, addPedido, currentUser, tema, addReserva, cancelReserva, reservas } = useStore();
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<{ platoId: string; cantidad: number; notas: string }[]>([]);
  const [notasGenerales, setNotasGenerales] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    nombre_cliente: '',
    telefono: '',
    numero_personas: 1,
    fecha_reserva: new Date().toISOString().split('T')[0],
    hora_reserva: '19:00',
    notas: ''
  });
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

  const handleReserveMesa = (mesaId: number) => {
    setSelectedMesa(mesaId);
    setShowReservationModal(true);
  };

  const handleCreateReservation = () => {
    if (!selectedMesa || !reservationForm.nombre_cliente || !reservationForm.telefono) return;
    
    addReserva({
      mesa_id: selectedMesa,
      nombre_cliente: reservationForm.nombre_cliente,
      telefono: reservationForm.telefono,
      numero_personas: reservationForm.numero_personas,
      fecha_reserva: new Date(reservationForm.fecha_reserva),
      hora_reserva: reservationForm.hora_reserva,
      notas: reservationForm.notas
    });

    setShowReservationModal(false);
    setSelectedMesa(null);
    setReservationForm({
      nombre_cliente: '',
      telefono: '',
      numero_personas: 1,
      fecha_reserva: new Date().toISOString().split('T')[0],
      hora_reserva: '19:00',
      notas: ''
    });
  };

  const handleCancelReservation = (reservaId: string) => {
    if (confirm('¿Está seguro de cancelar esta reserva?')) {
      cancelReserva(reservaId);
    }
  };

  const addItem = (platoId: string) => {
    const existing = orderItems.find(i => i.platoId === platoId);
    if (existing) {
      setOrderItems(orderItems.map(i =>
        i.platoId === platoId ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      setOrderItems([...orderItems, { platoId, cantidad: 1, notas: '' }]);
    }
  };

  const removeItem = (platoId: string) => {
    setOrderItems(orderItems.filter(i => i.platoId !== platoId));
  };

  const updateQuantity = (platoId: string, delta: number) => {
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

  const getMesaReserva = (mesaId: number) => {
    return reservas.find(r => r.mesa_id === mesaId && r.estado === 'confirmada');
  };

  const isAdmin = currentUser?.rol === 'admin';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <UtensilsCrossed className="text-amber-400" size={24} />
            Gestión de Mesas
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isAdmin ? 'Administra mesas, pedidos y reservas' : 'Selecciona una mesa para tomar un pedido'}
          </p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {mesas.map(mesa => {
          const pedido = getMesaPedido(mesa.id);
          const reserva = getMesaReserva(mesa.id);
          
          return (
            <div
              key={mesa.id}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 ${
                mesa.estado === 'libre'
                  ? isDark
                    ? 'bg-green-500/5 border-green-500/30 hover:bg-green-500/10'
                    : 'bg-green-50 border-green-300 hover:bg-green-100'
                  : mesa.estado === 'ocupada'
                  ? isDark
                    ? 'bg-red-500/5 border-red-500/30'
                    : 'bg-red-50 border-red-300'
                  : isDark
                    ? 'bg-yellow-500/5 border-yellow-500/30'
                    : 'bg-yellow-50 border-yellow-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${
                  mesa.estado === 'libre'
                    ? isDark ? 'text-green-400' : 'text-green-600'
                    : mesa.estado === 'ocupada'
                    ? isDark ? 'text-red-400' : 'text-red-600'
                    : isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  {mesa.numero}
                </span>
                <UsersIcon size={16} className={
                  mesa.estado === 'libre'
                    ? isDark ? 'text-green-500/50' : 'text-green-600/50'
                    : mesa.estado === 'ocupada'
                    ? isDark ? 'text-red-500/50' : 'text-red-600/50'
                    : isDark ? 'text-yellow-500/50' : 'text-yellow-600/50'
                } />
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Capacidad: {mesa.capacidad}
              </p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full capitalize ${
                mesa.estado === 'libre'
                  ? isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'
                  : mesa.estado === 'ocupada'
                  ? isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700'
                  : isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {mesa.estado}
              </span>
              
              {pedido && (
                <div className={`mt-2 pt-2 border-t ${isDark ? 'border-gray-700/30' : 'border-gray-200'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{pedido.items.length} items</p>
                  <p className={`text-xs font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    {formatoEcuador.moneda(pedido.total)}
                  </p>
                </div>
              )}

              {reserva && (
                <div className={`mt-2 pt-2 border-t ${isDark ? 'border-gray-700/30' : 'border-gray-200'}`}>
                  <p className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    📅 {reserva.nombre_cliente}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {reserva.hora_reserva} - {reserva.numero_personas} pers.
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="mt-3 flex gap-1">
                {mesa.estado === 'libre' && (
                  <>
                    <button
                      onClick={() => handleSelectMesa(mesa.id)}
                      className={`flex-1 text-xs py-1.5 rounded-lg transition ${
                        isDark
                          ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                      }`}
                    >
                      + Pedido
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleReserveMesa(mesa.id)}
                        className={`flex-1 text-xs py-1.5 rounded-lg transition ${
                          isDark
                            ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400'
                            : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        📅 Reservar
                      </button>
                    )}
                  </>
                )}
                {mesa.estado === 'ocupada' && pedido && (
                  <button
                    onClick={() => handleSelectMesa(mesa.id)}
                    className={`flex-1 text-xs py-1.5 rounded-lg transition ${
                      isDark
                        ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                    }`}
                  >
                    + Agregar
                  </button>
                )}
                {mesa.estado === 'reservada' && reserva && isAdmin && (
                  <button
                    onClick={() => handleCancelReservation(reserva.id)}
                    className={`flex-1 text-xs py-1.5 rounded-lg transition ${
                      isDark
                        ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                    }`}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
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
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Menu */}
              <div className="flex-1 overflow-y-auto p-5">
                <h4 className={`text-sm font-semibold uppercase mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Menú</h4>
                {categorias.map(cat => (
                  <div key={cat} className="mb-4">
                    <h5 className={`text-xs font-semibold uppercase mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{cat}</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {platos.filter(p => p.categoria === cat && p.disponible).map(plato => {
                        const inOrder = orderItems.find(i => i.platoId === plato.id);
                        return (
                          <div
                            key={plato.id}
                            className={`flex items-center justify-between p-3 rounded-xl border transition ${
                              inOrder
                                ? isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-300'
                                : isDark ? 'bg-gray-900/50 border-gray-700/30 hover:bg-gray-700/30' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div>
                              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{plato.nombre}</p>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{formatoEcuador.moneda(plato.precio)}</p>
                            </div>
                            {inOrder ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(plato.id, -1)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                  }`}
                                >
                                  -
                                </button>
                                <span className={`text-sm font-bold w-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{inOrder.cantidad}</span>
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
                                className={`p-2 rounded-lg transition ${
                                  isDark ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400' : 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                }`}
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
                    <p className={`text-sm text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Agrega platos al pedido</p>
                  ) : (
                    orderItems.map(item => {
                      const plato = platos.find(p => p.id === item.platoId);
                      return (
                        <div key={item.platoId} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{plato?.nombre}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>x{item.cantidad} — {formatoEcuador.moneda((plato?.precio || 0) * item.cantidad)}</p>
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
                <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                  <textarea
                    value={notasGenerales}
                    onChange={e => setNotasGenerales(e.target.value)}
                    placeholder="Notas generales..."
                    className={`w-full px-3 py-2 rounded-lg text-sm resize-none mb-3 ${
                      isDark
                        ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500'
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    rows={2}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total:</span>
                    <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatoEcuador.moneda(total)}</span>
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

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Reservar Mesa {mesas.find(m => m.id === selectedMesa)?.numero}
              </h3>
              <button
                onClick={() => {
                  setShowReservationModal(false);
                  setSelectedMesa(null);
                }}
                className={`p-2 rounded-lg transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  value={reservationForm.nombre_cliente}
                  onChange={e => setReservationForm({ ...reservationForm, nombre_cliente: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${
                    isDark
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={reservationForm.telefono}
                  onChange={e => setReservationForm({ ...reservationForm, telefono: e.target.value })}
                  placeholder="0991234567"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${
                    isDark
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Número de Personas
                </label>
                <input
                  type="number"
                  value={reservationForm.numero_personas}
                  onChange={e => setReservationForm({ ...reservationForm, numero_personas: parseInt(e.target.value) || 1 })}
                  min="1"
                  max={mesas.find(m => m.id === selectedMesa)?.capacidad || 10}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${
                    isDark
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white'
                      : 'bg-gray-50 border border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={reservationForm.fecha_reserva}
                    onChange={e => setReservationForm({ ...reservationForm, fecha_reserva: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${
                      isDark
                        ? 'bg-gray-700/50 border border-gray-600/50 text-white'
                        : 'bg-gray-50 border border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Hora
                  </label>
                  <input
                    type="time"
                    value={reservationForm.hora_reserva}
                    onChange={e => setReservationForm({ ...reservationForm, hora_reserva: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${
                      isDark
                        ? 'bg-gray-700/50 border border-gray-600/50 text-white'
                        : 'bg-gray-50 border border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notas
                </label>
                <textarea
                  value={reservationForm.notas}
                  onChange={e => setReservationForm({ ...reservationForm, notas: e.target.value })}
                  placeholder="Alguna solicitud especial..."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm resize-none ${
                    isDark
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowReservationModal(false);
                    setSelectedMesa(null);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateReservation}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
