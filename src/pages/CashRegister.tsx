import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatoEcuador } from '../store/useStore';
import { 
  DollarSign, TrendingUp, TrendingDown, Plus, 
  X, CheckCircle, AlertCircle, Clock, User
} from 'lucide-react';

export default function CashRegister() {
  const { caja, currentUser, abrirCaja, cerrarCaja, addMovimientoCaja, pedidos } = useStore();
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementType, setMovementType] = useState<'ingreso' | 'egreso'>('ingreso');
  const [montoInicial, setMontoInicial] = useState('');
  const [movimientoForm, setMovimientoForm] = useState({
    concepto: '',
    monto: ''
  });

  const isOpen = caja.estado === 'abierta';

  // Calcular totales
  const totalIngresos = caja.movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalEgresos = caja.movimientos
    .filter(m => m.tipo === 'egreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const totalVentas = pedidos
    .filter(p => p.estado === 'pagado' && caja.fecha_apertura && new Date(p.fecha_actualizacion) >= new Date(caja.fecha_apertura))
    .reduce((sum, p) => sum + p.total, 0);

  const montoActual = caja.monto_inicial + totalIngresos - totalEgresos + totalVentas;

  const handleOpenCash = () => {
    if (!montoInicial || parseFloat(montoInicial) < 0) return;
    abrirCaja(parseFloat(montoInicial));
    setShowOpenModal(false);
    setMontoInicial('');
  };

  const handleCloseCash = () => {
    cerrarCaja();
    setShowCloseModal(false);
  };

  const handleAddMovement = () => {
    if (!movimientoForm.concepto || !movimientoForm.monto || parseFloat(movimientoForm.monto) <= 0) return;
    addMovimientoCaja(movementType, movimientoForm.concepto, parseFloat(movimientoForm.monto));
    setShowMovementModal(false);
    setMovimientoForm({ concepto: '', monto: '' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="text-green-400" size={24} />
            Gestión de Caja
          </h1>
          <p className="text-gray-400 mt-1">Control de ingresos, egresos y ventas</p>
        </div>
        {!isOpen ? (
          <button
            onClick={() => setShowOpenModal(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-green-500/20 flex items-center gap-2"
          >
            <Plus size={16} />
            Abrir Caja
          </button>
        ) : (
          <button
            onClick={() => setShowCloseModal(true)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-red-500/20 flex items-center gap-2"
          >
            <X size={16} />
            Cerrar Caja
          </button>
        )}
      </div>

      {/* Status Card */}
      <div className={`rounded-2xl p-6 border ${
        isOpen 
          ? 'bg-green-500/5 border-green-500/20' 
          : 'bg-gray-800/50 border-gray-700/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isOpen ? 'bg-green-500/10' : 'bg-gray-700/50'
            }`}>
              <DollarSign className={isOpen ? 'text-green-400' : 'text-gray-400'} size={24} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isOpen ? 'text-green-400' : 'text-gray-400'}`}>
                {isOpen ? 'Caja Abierta' : 'Caja Cerrada'}
              </h3>
              {isOpen && caja.fecha_apertura && (
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Clock size={14} />
                  Apertura: {new Date(caja.fecha_apertura).toLocaleString('es-EC')}
                </p>
              )}
            </div>
          </div>
          {isOpen && (
            <button
              onClick={() => {
                setMovementType('ingreso');
                setShowMovementModal(true);
              }}
              className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl text-sm transition flex items-center gap-2"
            >
              <TrendingUp size={16} />
              Registrar Ingreso
            </button>
          )}
        </div>

        {isOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Monto Inicial</p>
              <p className="text-2xl font-bold text-white">{formatoEcuador.moneda(caja.monto_inicial)}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-400">{formatoEcuador.moneda(totalIngresos)}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Total Egresos</p>
              <p className="text-2xl font-bold text-red-400">{formatoEcuador.moneda(totalEgresos)}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-xl p-4 border border-amber-500/20">
              <p className="text-sm text-amber-400 mb-1">Monto Actual</p>
              <p className="text-2xl font-bold text-amber-400">{formatoEcuador.moneda(montoActual)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Movements List */}
      {isOpen && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Movimientos del Día</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMovementType('ingreso');
                  setShowMovementModal(true);
                }}
                className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm transition flex items-center gap-1"
              >
                <TrendingUp size={14} />
                Ingreso
              </button>
              <button
                onClick={() => {
                  setMovementType('egreso');
                  setShowMovementModal(true);
                }}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition flex items-center gap-1"
              >
                <TrendingDown size={14} />
                Egreso
              </button>
            </div>
          </div>

          {caja.movimientos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DollarSign size={48} className="mx-auto mb-3 opacity-30" />
              <p>No hay movimientos registrados</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {caja.movimientos.map((mov, index) => {
                const esVenta = mov.mesa !== undefined && mov.items !== undefined;
                const numeroVenta = esVenta ? caja.movimientos.filter(m => m.mesa !== undefined).length - index : null;
                
                return (
                  <div
                    key={mov.id}
                    className={`p-3 rounded-xl border ${
                      mov.tipo === 'ingreso'
                        ? esVenta
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-blue-500/5 border-blue-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          mov.tipo === 'ingreso' 
                            ? esVenta ? 'bg-green-500/10' : 'bg-blue-500/10'
                            : 'bg-red-500/10'
                        }`}>
                          {mov.tipo === 'ingreso' ? (
                            esVenta ? <DollarSign className="text-green-400" size={20} /> : <TrendingUp className="text-blue-400" size={20} />
                          ) : (
                            <TrendingDown className="text-red-400" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {esVenta && numeroVenta && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                                Venta #{numeroVenta}
                              </span>
                            )}
                            <p className="text-sm font-medium text-white">{mov.concepto}</p>
                          </div>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <User size={12} />
                            {mov.usuario_nombre} • {new Date(mov.fecha).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <p className={`text-lg font-bold ${
                        mov.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {mov.tipo === 'ingreso' ? '+' : '-'}{formatoEcuador.moneda(mov.monto)}
                      </p>
                    </div>
                    
                    {/* Detalles de venta */}
                    {esVenta && (
                      <div className="mt-3 pt-3 border-t border-gray-700/30">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs text-amber-400 font-medium">
                            🍽️ Mesa {mov.mesa}
                          </span>
                          <span className="text-xs text-gray-400">
                            👤 Mesero: {mov.mesero}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {(mov.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">
                                <span className="font-mono text-gray-500">x{item.cantidad}</span> {item.plato_nombre}
                              </span>
                              {item.notas && (
                                <span className="text-amber-400/70 italic text-xs">
                                  📝 {item.notas}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Open Cash Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Abrir Caja</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Monto Inicial (USD)
                </label>
                <input
                  type="number"
                  value={montoInicial}
                  onChange={e => setMontoInicial(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowOpenModal(false);
                    setMontoInicial('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleOpenCash}
                  className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Abrir Caja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Cash Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Cerrar Caja</h3>
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Monto Inicial:</span>
                  <span className="text-white font-semibold">{formatoEcuador.moneda(caja.monto_inicial)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Ingresos:</span>
                  <span className="text-green-400 font-semibold">{formatoEcuador.moneda(totalIngresos)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Egresos:</span>
                  <span className="text-red-400 font-semibold">{formatoEcuador.moneda(totalEgresos)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ventas del Día:</span>
                  <span className="text-blue-400 font-semibold">{formatoEcuador.moneda(totalVentas)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between">
                  <span className="text-amber-400 font-semibold">Monto Final:</span>
                  <span className="text-amber-400 font-bold text-lg">{formatoEcuador.moneda(montoActual)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCloseCash}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Cerrar Caja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movement Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Registrar {movementType === 'ingreso' ? 'Ingreso' : 'Egreso'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Concepto
                </label>
                <input
                  type="text"
                  value={movimientoForm.concepto}
                  onChange={e => setMovimientoForm({ ...movimientoForm, concepto: e.target.value })}
                  placeholder={movementType === 'ingreso' ? 'Ej: Venta de productos' : 'Ej: Pago de proveedores'}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Monto (USD)
                </label>
                <input
                  type="number"
                  value={movimientoForm.monto}
                  onChange={e => setMovimientoForm({ ...movimientoForm, monto: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowMovementModal(false);
                    setMovimientoForm({ concepto: '', monto: '' });
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddMovement}
                  className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm transition flex items-center justify-center gap-2 ${
                    movementType === 'ingreso'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {movementType === 'ingreso' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
