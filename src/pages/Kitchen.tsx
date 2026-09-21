import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Clock, ChefHat, CheckCircle2, AlertCircle, Bell, Timer } from 'lucide-react';
import { EstadoPedido } from '../types';

export default function Kitchen() {
  const { pedidos, updatePedidoItemEstado, updatePedidoEstado, tema } = useStore();
  const [notification, setNotification] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const isDark = tema === 'dark';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  const handleMarkReady = (pedidoId: number, itemId: number) => {
    updatePedidoItemEstado(pedidoId, itemId, 'listo');
    setNotification(`¡Plato listo! Notificando al mesero...`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMarkAllReady = (pedidoId: number) => {
    updatePedidoEstado(pedidoId, 'listo');
    setNotification(`¡Pedido completo listo para servir!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const getColumnItems = (estado: string) => {
    return pedidosActivos.filter(p =>
      p.items.some(i => i.estado === estado)
    );
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 flex items-center justify-between ${isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
          <ChefHat className="text-amber-400" size={24} />
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Pantalla de Cocina</h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pedidos en tiempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
            <Timer size={14} className="text-amber-400" />
            <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentTime.toLocaleTimeString('es-MX')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-400">WebSocket Activo</span>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="mx-6 mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400 animate-pulse">
          <Bell size={16} />
          <span className="text-sm">{notification}</span>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {/* Column: Pendiente */}
          <KanbanColumn
            title="Pendientes"
            count={pedidosActivos.filter(p => p.items.some(i => i.estado === 'pendiente')).length}
            color="yellow"
          >
            {pedidosActivos.map(pedido => {
              const pendingItems = pedido.items.filter(i => i.estado === 'pendiente');
              if (pendingItems.length === 0) return null;
              return (
                <OrderCard
                  key={pedido.id}
                  pedido={pedido}
                  items={pendingItems}
                  elapsed={getElapsedTime(pedido.fecha_creacion)}
                  timeColor={getTimeColor(pedido.fecha_creacion)}
                  onMarkReady={handleMarkReady}
                  onMarkAllReady={handleMarkAllReady}
                  status="pendiente"
                />
              );
            })}
          </KanbanColumn>

          {/* Column: Preparando */}
          <KanbanColumn
            title="Preparando"
            count={pedidosActivos.filter(p => p.items.some(i => i.estado === 'preparando')).length}
            color="blue"
          >
            {pedidosActivos.map(pedido => {
              const preparingItems = pedido.items.filter(i => i.estado === 'preparando');
              if (preparingItems.length === 0) return null;
              return (
                <OrderCard
                  key={pedido.id}
                  pedido={pedido}
                  items={preparingItems}
                  elapsed={getElapsedTime(pedido.fecha_creacion)}
                  timeColor={getTimeColor(pedido.fecha_creacion)}
                  onMarkReady={handleMarkReady}
                  onMarkAllReady={handleMarkAllReady}
                  status="preparando"
                />
              );
            })}
          </KanbanColumn>

          {/* Column: Listo */}
          <KanbanColumn
            title="Listos"
            count={pedidosActivos.filter(p => p.items.some(i => i.estado === 'listo')).length}
            color="green"
          >
            {pedidosActivos.map(pedido => {
              const readyItems = pedido.items.filter(i => i.estado === 'listo');
              if (readyItems.length === 0) return null;
              return (
                <OrderCard
                  key={pedido.id}
                  pedido={pedido}
                  items={readyItems}
                  elapsed={getElapsedTime(pedido.fecha_creacion)}
                  timeColor={getTimeColor(pedido.fecha_creacion)}
                  onMarkReady={handleMarkReady}
                  onMarkAllReady={handleMarkAllReady}
                  status="listo"
                />
              );
            })}
          </KanbanColumn>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface KanbanColumnProps {
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

function KanbanColumn({ title, count, color, children }: KanbanColumnProps) {
  const colorClasses: Record<string, string> = {
    yellow: 'border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/5',
    green: 'border-green-500/30 bg-green-500/5 dark:bg-green-500/5',
  };
  const badgeClasses: Record<string, string> = {
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
  };

  return (
    <div className={`w-80 flex-shrink-0 rounded-2xl border ${colorClasses[color]} p-3 flex flex-col`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClasses[color]}`}>
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {children}
      </div>
    </div>
  );
}

interface OrderCardProps {
  pedido: any;
  items: any[];
  elapsed: string;
  timeColor: string;
  onMarkReady: (pedidoId: number, itemId: number) => void;
  onMarkAllReady: (pedidoId: number) => void;
  status: string;
}

function OrderCard({ pedido, items, elapsed, timeColor, onMarkReady, onMarkAllReady, status }: OrderCardProps) {
  const isUrgent = timeColor === 'text-red-400';

  return (
    <div className={`bg-gray-800 rounded-xl border p-4 shadow-lg transition-all hover:shadow-xl ${
      isUrgent ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-gray-700/50'
    }`}>
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-1 rounded-lg">
            Mesa {pedido.mesa_numero}
          </span>
          <span className={`flex items-center gap-1 text-xs ${timeColor}`}>
            <Clock size={12} />
            {elapsed}
          </span>
        </div>
        {isUrgent && <AlertCircle size={16} className="text-red-400 animate-pulse" />}
      </div>

      {/* Items */}
      <div className="space-y-2 mb-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded font-mono">
                  x{item.cantidad}
                </span>
                <span className="text-sm text-white font-medium">{item.plato_nombre}</span>
              </div>
              {item.notas && (
                <p className="text-xs text-amber-400/80 mt-0.5 ml-8 italic">
                  📝 {item.notas}
                </p>
              )}
            </div>
            {status !== 'listo' && (
              <button
                onClick={() => onMarkReady(pedido.id, item.id)}
                className="ml-2 p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition"
                title="Marcar como listo"
              >
                <CheckCircle2 size={16} />
              </button>
            )}
            {status === 'listo' && (
              <span className="ml-2 text-green-400">
                <CheckCircle2 size={16} />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Notes */}
      {pedido.notas_generales && (
        <div className="p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg mb-3">
          <p className="text-xs text-amber-400">⚠️ {pedido.notas_generales}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
        <span className="text-xs text-gray-500">Mesero: {pedido.mesero_nombre}</span>
        {status !== 'listo' && items.length > 1 && (
          <button
            onClick={() => onMarkAllReady(pedido.id)}
            className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-1 rounded-lg transition"
          >
            Todo listo ✓
          </button>
        )}
      </div>
    </div>
  );
}
