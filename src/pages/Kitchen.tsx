import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatoEcuador } from '../store/useStore';
import { Clock, ChefHat, CheckCircle2, AlertCircle, Bell, Timer, LogOut, Play, CheckCheck } from 'lucide-react';
import { EstadoPedido } from '../types';

export default function Kitchen() {
  const { pedidos, updatePedidoItemEstado, updatePedidoEstado, tema, logout, addNotificacion, limpiarPedidosListosAntiguos } = useStore();
  const [notification, setNotification] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const isDark = tema === 'dark';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Limpiar pedidos listos antiguos cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      limpiarPedidosListosAntiguos();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const pedidosActivos = pedidos.filter(p =>
    p.estado !== 'pagado' && p.estado !== 'cancelado'
  ).sort((a, b) => a.fecha_creacion.getTime() - b.fecha_creacion.getTime());

  const getElapsedTime = (date: Date) => {
    const diff = Math.floor((currentTime.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Ahora';
    if (diff < 60) return `${diff} min`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const getTimeColor = (date: Date) => {
    const diff = Math.floor((currentTime.getTime() - date.getTime()) / 60000);
    if (diff >= 20) return 'text-red-400';
    if (diff >= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Pasar de Pendiente a Preparando
  const handleStartPreparing = (pedidoId: string, itemId: string) => {
    updatePedidoItemEstado(pedidoId, itemId, 'preparando');
    setNotification(`🔥 Empezando a preparar plato...`);
    setTimeout(() => setNotification(null), 2000);
  };

  // Pasar de Preparando a Listo
  const handleMarkReady = (pedidoId: string, itemId: string) => {
    updatePedidoItemEstado(pedidoId, itemId, 'listo');
    setNotification(`✅ ¡Plato listo! Notificando al mesero para recoger...`);
    addNotificacion(`Plato listo para recoger en cocina`, 'success');
    setTimeout(() => setNotification(null), 3000);
  };

  // Marcar todo el pedido como listo
  const handleMarkAllReady = (pedidoId: string) => {
    updatePedidoEstado(pedidoId, 'listo');
    setNotification(`✅ ¡Pedido completo listo! Mesero notificado para recoger.`);
    addNotificacion(`Pedido completo listo para recoger en cocina`, 'success');
    setTimeout(() => setNotification(null), 3000);
  };

  // Marcar todo el pedido como preparando
  const handleStartAllPreparing = (pedidoId: string) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;
    
    pedido.items.forEach(item => {
      if (item.estado === 'pendiente') {
        updatePedidoItemEstado(pedidoId, item.id, 'preparando');
      }
    });
    setNotification(`🔥 Empezando a preparar todo el pedido...`);
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 flex items-center justify-between ${isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
          <ChefHat className="text-amber-400" size={24} />
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Pantalla de Cocina</h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Flujo: Pendiente → Preparando → Listo</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
            <Timer size={14} className="text-amber-400" />
            <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentTime.toLocaleTimeString('es-EC')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-400">En Línea</span>
          </div>
          <button
            onClick={logout}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              isDark 
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' 
                : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
            }`}
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="mx-6 mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400 animate-pulse">
          <Bell size={16} />
          <span className="text-sm">{notification}</span>
        </div>
      )}

      {/* Kanban Board - 3 Columnas */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          
          {/* Columna 1: PENDIENTE */}
          <div className={`w-96 flex-shrink-0 rounded-2xl border p-4 flex flex-col ${
            isDark ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-yellow-300 bg-yellow-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg flex items-center gap-2 ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                <Clock size={20} />
                PENDIENTE
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {pedidosActivos.filter(p => p.items.some(i => i.estado === 'pendiente')).length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {pedidosActivos.map(pedido => {
                const pendingItems = pedido.items.filter(i => i.estado === 'pendiente');
                if (pendingItems.length === 0) return null;
                
                return (
                  <div key={pedido.id} className={`rounded-xl border p-4 shadow-lg ${
                    isDark ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-200'
                  }`}>
                    {/* Header de tarjeta */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                        }`}>
                          Mesa {pedido.mesa_numero}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${getTimeColor(pedido.fecha_creacion)}`}>
                          <Clock size={12} />
                          {getElapsedTime(pedido.fecha_creacion)}
                        </span>
                      </div>
                    </div>

                    {/* Items pendientes */}
                    <div className="space-y-2 mb-3">
                      {pendingItems.map(item => (
                        <div key={item.id} className={`flex items-center justify-between p-2 rounded-lg ${
                          isDark ? 'bg-gray-900/50' : 'bg-gray-50'
                        }`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}>
                                x{item.cantidad}
                              </span>
                              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {item.plato_nombre}
                              </span>
                            </div>
                            {item.notas && (
                              <p className={`text-xs mt-1 ml-8 italic ${isDark ? 'text-amber-400/80' : 'text-amber-600'}`}>
                                📝 {item.notas}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleStartPreparing(pedido.id, item.id)}
                            className={`ml-2 p-2 rounded-lg transition ${
                              isDark 
                                ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400' 
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                            }`}
                            title="Empezar a preparar"
                          >
                            <Play size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Notas generales */}
                    {pedido.notas_generales && (
                      <div className={`p-2 rounded-lg mb-3 ${
                        isDark ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                          ⚠️ {pedido.notas_generales}
                        </p>
                      </div>
                    )}

                    {/* Footer con acciones */}
                    <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {pedido.mesero_nombre}
                      </span>
                      {pendingItems.length > 1 && (
                        <button
                          onClick={() => handleStartAllPreparing(pedido.id)}
                          className={`text-xs px-2 py-1 rounded-lg transition ${
                            isDark 
                              ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400' 
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                          }`}
                        >
                          ▶ Preparar Todo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {pedidosActivos.filter(p => p.items.some(i => i.estado === 'pendiente')).length === 0 && (
                <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Clock size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No hay pedidos pendientes</p>
                </div>
              )}
            </div>
          </div>

          {/* Columna 2: PREPARANDO */}
          <div className={`w-96 flex-shrink-0 rounded-2xl border p-4 flex flex-col ${
            isDark ? 'border-blue-500/30 bg-blue-500/5' : 'border-blue-300 bg-blue-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                <ChefHat size={20} />
                PREPARANDO
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-200 text-blue-800'
              }`}>
                {pedidosActivos.filter(p => p.items.some(i => i.estado === 'preparando')).length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {pedidosActivos.map(pedido => {
                const preparingItems = pedido.items.filter(i => i.estado === 'preparando');
                if (preparingItems.length === 0) return null;
                
                return (
                  <div key={pedido.id} className={`rounded-xl border p-4 shadow-lg ${
                    isDark ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                        }`}>
                          Mesa {pedido.mesa_numero}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${getTimeColor(pedido.fecha_creacion)}`}>
                          <Clock size={12} />
                          {getElapsedTime(pedido.fecha_creacion)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      {preparingItems.map(item => (
                        <div key={item.id} className={`flex items-center justify-between p-2 rounded-lg ${
                          isDark ? 'bg-gray-900/50' : 'bg-gray-50'
                        }`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}>
                                x{item.cantidad}
                              </span>
                              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {item.plato_nombre}
                              </span>
                            </div>
                            {item.notas && (
                              <p className={`text-xs mt-1 ml-8 italic ${isDark ? 'text-amber-400/80' : 'text-amber-600'}`}>
                                📝 {item.notas}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleMarkReady(pedido.id, item.id)}
                            className={`ml-2 p-2 rounded-lg transition ${
                              isDark 
                                ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' 
                                : 'bg-green-50 hover:bg-green-100 text-green-600'
                            }`}
                            title="Marcar como listo"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {pedido.notas_generales && (
                      <div className={`p-2 rounded-lg mb-3 ${
                        isDark ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                          ⚠️ {pedido.notas_generales}
                        </p>
                      </div>
                    )}

                    <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {pedido.mesero_nombre}
                      </span>
                      {preparingItems.length > 1 && (
                        <button
                          onClick={() => handleMarkAllReady(pedido.id)}
                          className={`text-xs px-2 py-1 rounded-lg transition flex items-center gap-1 ${
                            isDark 
                              ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' 
                              : 'bg-green-50 hover:bg-green-100 text-green-600'
                          }`}
                        >
                          <CheckCheck size={14} />
                          Todo Listo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {pedidosActivos.filter(p => p.items.some(i => i.estado === 'preparando')).length === 0 && (
                <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <ChefHat size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No hay pedidos en preparación</p>
                </div>
              )}
            </div>
          </div>

          {/* Columna 3: LISTO */}
          <div className={`w-96 flex-shrink-0 rounded-2xl border p-4 flex flex-col ${
            isDark ? 'border-green-500/30 bg-green-500/5' : 'border-green-300 bg-green-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                <CheckCircle2 size={20} />
                LISTO
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-200 text-green-800'
              }`}>
                {pedidosActivos.filter(p => p.estado === 'listo').length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {pedidosActivos.filter(p => p.estado === 'listo').map(pedido => (
                <div key={pedido.id} className={`rounded-xl border p-4 shadow-lg ${
                  isDark ? 'bg-gray-800 border-green-500/30' : 'bg-white border-green-300'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}>
                        Mesa {pedido.mesa_numero}
                      </span>
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Listo para recoger
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {pedido.items.map(item => (
                      <div key={item.id} className={`flex items-center justify-between p-2 rounded-lg ${
                        isDark ? 'bg-green-500/5' : 'bg-green-50'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            x{item.cantidad}
                          </span>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {item.plato_nombre}
                          </span>
                        </div>
                        <CheckCircle2 size={16} className="text-green-400" />
                      </div>
                    ))}
                  </div>

                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-100 border border-green-200'
                  }`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      🔔 Mesero notificado para recoger
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Se eliminará automáticamente en 2 minutos
                    </p>
                  </div>

                  <div className={`flex items-center justify-between pt-2 mt-3 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {pedido.mesero_nombre}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {formatoEcuador.moneda(pedido.total)}
                    </span>
                  </div>
                </div>
              ))}
              {pedidosActivos.filter(p => p.estado === 'listo').length === 0 && (
                <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <CheckCircle2 size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No hay pedidos listos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
