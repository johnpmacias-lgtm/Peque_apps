import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Usuario, ConfiguracionRestaurante, Ingrediente, Plato, Mesa, Pedido, PedidoItem, EstadoPedido, AlertaInventario, Reserva, Caja, MovimientoCaja } from '../types';
import { hashPassword, verifyPassword } from '../services/authService';
import { configuracion, platos as platosInit, mesas as mesasInit, pedidosIniciales, platoIngredientes } from '../data/mockData';

// Formato de números para Ecuador (USD)
export const formatoEcuador = {
  moneda: (valor: number): string => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  },
  numero: (valor: number): string => {
    return new Intl.NumberFormat('es-EC', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(valor);
  },
  telefono: (valor: string): string => {
    // Formato ecuatoriano: +593 XX XXX XXXX
    const limpio = valor.replace(/\D/g, '');
    if (limpio.length === 9) {
      return `+593 ${limpio.slice(0, 2)} ${limpio.slice(2, 5)} ${limpio.slice(5)}`;
    }
    return valor;
  }
};

type Tema = 'light' | 'dark';

interface AppState {
  // Auth
  currentUser: Usuario | null;
  usuarios: Usuario[];
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: { nombre: string; password: string; rol: 'admin' | 'mesero' | 'cocina'; activo: boolean }) => Promise<void>;
  updateUser: (id: string, data: Partial<Omit<Usuario, 'id'>>) => Promise<void>;
  deleteUser: (id: string) => void;
  changePassword: (id: string, newPassword: string) => Promise<void>;
  resetAllData: () => Promise<void>;

  // Tema
  tema: Tema;
  toggleTema: () => void;
  setTema: (tema: Tema) => void;

  // Config
  restauranteConfig: ConfiguracionRestaurante;
  updateConfig: (config: Partial<ConfiguracionRestaurante>) => void;

  // Inventario
  ingredientes: Ingrediente[];
  platos: Plato[];
  mesas: Mesa[];
  pedidos: Pedido[];
  alertas: AlertaInventario[];

  // Factura
  ultimaFactura: Pedido | null;
  setUltimaFactura: (pedido: Pedido | null) => void;

  // Acciones
  addPedido: (mesaId: number, items: { platoId: string; cantidad: number; notas: string }[], notas: string) => void;
  updatePedidoItemEstado: (pedidoId: string, itemId: string, estado: EstadoPedido) => void;
  updatePedidoEstado: (pedidoId: string, estado: EstadoPedido) => void;
  updateMesaEstado: (mesaId: number, estado: Mesa['estado']) => void;
  updateMesa: (mesaId: number, data: Partial<Mesa>) => void;
  addIngrediente: (ingrediente: Omit<Ingrediente, 'id'>) => void;
  updateIngredienteStock: (id: string, cantidad: number) => void;
  addPlato: (plato: Omit<Plato, 'id'>) => void;
  updatePlato: (id: string, data: Partial<Plato>) => void;
  deletePlato: (id: string) => void;
  descontarInventario: (pedidoId: string) => void;
  generarAlertas: () => void;
  limpiarPedidosListosAntiguos: () => void;

  // Reservas
  reservas: Reserva[];
  addReserva: (reserva: Omit<Reserva, 'id' | 'estado'>) => void;
  updateReserva: (id: string, data: Partial<Reserva>) => void;
  cancelReserva: (id: string) => void;

  // Caja
  caja: Caja;
  abrirCaja: (montoInicial: number) => void;
  cerrarCaja: () => void;
  addMovimientoCaja: (tipo: 'ingreso' | 'egreso', concepto: string, monto: number, mesa?: number, mesero?: string, items?: any[]) => void;
  registrarVentaAutomatica: (pedido: Pedido) => void;

  // Historial de cocina
  historialCocina: Array<{
    id: string;
    pedido: Pedido;
    fecha_entrega: Date;
    entregado_por: string;
  }>;
  agregarAHistorialCocina: (pedido: Pedido) => void;
  contadorVentas: number;

  // Notificaciones
  notificaciones: Array<{ id: string; mensaje: string; tipo: 'info' | 'success' | 'warning' | 'error'; fecha: Date; leida: boolean }>;
  addNotificacion: (mensaje: string, tipo: 'info' | 'success' | 'warning' | 'error') => void;
  marcarNotificacionLeida: (id: string) => void;
  limpiarNotificacionesLeidas: () => void;
}

// Contraseñas por defecto
const DEFAULT_USERS = [
  { nombre: 'Carlos Admin', password: 'Admin1', rol: 'admin' as const, activo: true },
  { nombre: 'María Mesero', password: 'Mesero1', rol: 'mesero' as const, activo: true },
  { nombre: 'Chef Roberto', password: 'Cocina1', rol: 'cocina' as const, activo: true },
  { nombre: 'Ana López', password: 'Mesero1', rol: 'mesero' as const, activo: true },
];

// Función para crear usuarios por defecto con contraseñas hasheadas
async function createDefaultUsers(): Promise<Usuario[]> {
  const users: Usuario[] = [];
  for (const user of DEFAULT_USERS) {
    const passwordHash = await hashPassword(user.password);
    users.push({
      id: uuidv4(),
      nombre: user.nombre,
      passwordHash,
      rol: user.rol,
      activo: user.activo,
    });
  }
  return users;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      usuarios: [],
      isLoading: false,

      initialize: async () => {
        const state = get();
        
        console.log('=== INICIALIZANDO STORE ===');
        console.log('Usuarios en localStorage:', state.usuarios.length);
        console.log('isLoading:', state.isLoading);
        
        // Si ya está cargando, no hacer nada
        if (state.isLoading) {
          console.log('⚠️ Ya está cargando, saltando...');
          return;
        }
        
        set({ isLoading: true });
        
        try {
          // Verificar si los usuarios necesitan migración (no tienen passwordHash)
          const needsMigration = state.usuarios.length === 0 || 
            state.usuarios.some(u => !u.passwordHash || u.passwordHash === '');
          
          console.log('¿Necesita migración?', needsMigration);
          
          if (needsMigration) {
            console.log('🔄 Creando usuarios por defecto con contraseñas hasheadas...');
            // Crear usuarios por defecto con contraseñas hasheadas
            const defaultUsers = await createDefaultUsers();
            console.log('✅ Usuarios creados:', defaultUsers.length);
            console.log('Usuarios:', defaultUsers.map(u => u.nombre));
            
            set({ 
              usuarios: defaultUsers, 
              isLoading: false 
            });
          } else {
            console.log('✅ Usuarios existentes válidos');
            console.log('Usuarios:', state.usuarios.map(u => u.nombre));
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('❌ Error initializing store:', error);
          set({ isLoading: false });
        }
      },

      login: async (username: string, password: string) => {
        const state = get();
        
        console.log('=== INICIO DE SESIÓN ===');
        console.log('Username recibido:', username);
        console.log('Usuarios disponibles:', state.usuarios.map(u => ({ nombre: u.nombre, activo: u.activo, tieneHash: !!u.passwordHash })));
        
        // Normalizar el username (trim y case-insensitive)
        const normalizedUsername = username.trim().toLowerCase();
        
        // Buscar usuario por nombre (case-insensitive)
        const user = state.usuarios.find(u => 
          u.nombre.trim().toLowerCase() === normalizedUsername && u.activo
        );
        
        if (!user) {
          console.error('❌ Usuario no encontrado o inactivo:', username);
          console.error('Usuarios activos:', state.usuarios.filter(u => u.activo).map(u => u.nombre));
          return false;
        }
        
        console.log('✅ Usuario encontrado:', user.nombre);
        
        // Verificar que tenga passwordHash
        if (!user.passwordHash || user.passwordHash === '') {
          console.error('❌ Usuario sin passwordHash:', user.nombre);
          console.error('Esto indica que los datos están corruptos. Usa el botón de reset.');
          return false;
        }
        
        try {
          console.log('🔐 Verificando contraseña con bcrypt...');
          // Verificación segura con bcrypt
          const isValid = await verifyPassword(password, user.passwordHash);
          
          if (!isValid) {
            console.error('❌ Contraseña incorrecta para:', user.nombre);
            return false;
          }
          
          console.log('✅ Contraseña correcta. Iniciando sesión...');
          set({ currentUser: user });
          console.log('✅ Login exitoso. Usuario actual:', user.nombre);
          return true;
        } catch (error) {
          console.error('❌ Error en login:', error);
          return false;
        }
      },

      logout: () => set({ currentUser: null, ultimaFactura: null }),

      resetAllData: async () => {
        set({ isLoading: true });
        try {
          const defaultUsers = await createDefaultUsers();
          set({
            usuarios: defaultUsers,
            currentUser: null,
            ingredientes: [],
            platos: platosInit.map(p => ({ ...p, id: uuidv4() })),
            mesas: mesasInit,
            pedidos: pedidosIniciales.map(p => ({
              ...p,
              id: uuidv4(),
              items: p.items.map(i => ({ ...i, id: uuidv4() }))
            })),
            alertas: [],
            ultimaFactura: null,
            restauranteConfig: configuracion,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error resetting data:', error);
          set({ isLoading: false });
        }
      },

      addUser: async (userData) => {
        const passwordHash = await hashPassword(userData.password);
        set(state => ({
          usuarios: [...state.usuarios, {
            id: uuidv4(),
            nombre: userData.nombre,
            rol: userData.rol,
            activo: userData.activo,
            passwordHash
          }]
        }));
      },

      updateUser: async (id, data) => {
        let updateData = { ...data };
        // Si se proporciona nueva contraseña (en el campo passwordHash), hashearla
        if ((data as any).passwordHash && typeof (data as any).passwordHash === 'string') {
          updateData.passwordHash = await hashPassword((data as any).passwordHash);
        }
        set(state => ({
          usuarios: state.usuarios.map(u => u.id === id ? { ...u, ...updateData } : u)
        }));
      },

      deleteUser: (id) => {
        set(state => ({
          usuarios: state.usuarios.filter(u => u.id !== id)
        }));
      },

      changePassword: async (id, newPassword) => {
        const passwordHash = await hashPassword(newPassword);
        set(state => ({
          usuarios: state.usuarios.map(u => u.id === id ? { ...u, passwordHash } : u)
        }));
      },

      // Tema
      tema: 'dark',
      toggleTema: () => set(state => ({ tema: state.tema === 'dark' ? 'light' : 'dark' })),
      setTema: (tema) => set({ tema }),

      // Config
      restauranteConfig: configuracion,
      updateConfig: (config) => set(state => ({
        restauranteConfig: { ...state.restauranteConfig, ...config }
      })),

      // Data
      ingredientes: [],
      platos: platosInit.map(p => ({ ...p, id: uuidv4() })),
      mesas: mesasInit,
      pedidos: pedidosIniciales.map(p => ({
        ...p,
        id: uuidv4(),
        items: p.items.map(i => ({ ...i, id: uuidv4() }))
      })),
      alertas: [],

      // Factura
      ultimaFactura: null,
      setUltimaFactura: (pedido) => set({ ultimaFactura: pedido }),

      // Acciones
      addPedido: (mesaId, items, notas) => {
        const state = get();
        const mesa = state.mesas.find(m => m.id === mesaId);
        if (!mesa || !state.currentUser) return;

        const newItems: PedidoItem[] = items.map((item) => {
          const plato = state.platos.find(p => p.id === item.platoId);
          return {
            id: uuidv4(),
            plato_id: item.platoId,
            plato_nombre: plato?.nombre || '',
            cantidad: item.cantidad,
            notas: item.notas,
            estado: 'pendiente' as EstadoPedido,
          };
        });

        const total = items.reduce((sum, item) => {
          const plato = state.platos.find(p => p.id === item.platoId);
          return sum + (plato?.precio || 0) * item.cantidad;
        }, 0);

        const newPedido: Pedido = {
          id: uuidv4(),
          mesa_id: mesaId,
          mesa_numero: mesa.numero,
          mesero_id: state.currentUser.id,
          mesero_nombre: state.currentUser.nombre,
          items: newItems,
          estado: 'pendiente',
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
          total,
          notas_generales: notas,
        };

        set(state => ({
          pedidos: [...state.pedidos, newPedido],
          mesas: state.mesas.map(m => m.id === mesaId ? { ...m, estado: 'ocupada' as const } : m),
        }));
      },

      updatePedidoItemEstado: (pedidoId, itemId, estado) => {
        set(state => ({
          pedidos: state.pedidos.map(p => {
            if (p.id !== pedidoId) return p;
            const newItems = p.items.map(item =>
              item.id === itemId ? { ...item, estado } : item
            );
            const allListo = newItems.every(i => i.estado === 'listo' || i.estado === 'servido' || i.estado === 'pagado');
            return {
              ...p,
              items: newItems,
              estado: allListo ? 'listo' : p.estado,
              fecha_actualizacion: new Date(),
            };
          }),
        }));
      },

      updatePedidoEstado: (pedidoId, estado) => {
        const state = get();
        const pedido = state.pedidos.find(p => p.id === pedidoId);

        set(state => ({
          pedidos: state.pedidos.map(p =>
            p.id === pedidoId
              ? { ...p, estado, fecha_actualizacion: new Date(), items: p.items.map(i => ({ ...i, estado })) }
              : p
          ),
        }));

        // Si el pedido pasa a estado 'servido', archivarlo automáticamente en el historial de cocina
        if (estado === 'servido' && pedido) {
          get().agregarAHistorialCocina(pedido);
        }

        if (estado === 'pagado' && pedido) {
          get().descontarInventario(pedidoId);
          get().setUltimaFactura(pedido);
          get().registrarVentaAutomatica(pedido);

          // Liberar automáticamente la mesa asociada al pedido pagado
          set(state => ({
            mesas: state.mesas.map(m =>
              m.id === pedido.mesa_id ? { ...m, estado: 'libre' as const } : m
            ),
          }));
        }
      },

      updateMesaEstado: (mesaId, estado) => {
        set(state => ({
          mesas: state.mesas.map(m => m.id === mesaId ? { ...m, estado } : m),
        }));
      },

      updateMesa: (mesaId, data) => {
        set(state => ({
          mesas: state.mesas.map(m => m.id === mesaId ? { ...m, ...data } : m),
        }));
      },

      addIngrediente: (ingrediente) => {
        set(state => ({
          ingredientes: [...state.ingredientes, { ...ingrediente, id: uuidv4() }],
        }));
        get().generarAlertas();
      },

      updateIngredienteStock: (id, cantidad) => {
        set(state => ({
          ingredientes: state.ingredientes.map(i =>
            i.id === id ? { ...i, stock_actual: i.stock_actual + cantidad } : i
          ),
        }));
        get().generarAlertas();
      },

      addPlato: (plato) => {
        set(state => ({
          platos: [...state.platos, { ...plato, id: uuidv4() }],
        }));
      },

      updatePlato: (id, data) => {
        set(state => ({
          platos: state.platos.map(p => p.id === id ? { ...p, ...data } : p)
        }));
      },

      deletePlato: (id) => {
        set(state => ({
          platos: state.platos.filter(p => p.id !== id)
        }));
      },

      descontarInventario: (pedidoId) => {
        const state = get();
        const pedido = state.pedidos.find(p => p.id === pedidoId);
        if (!pedido) return;

        const nuevosIngredientes = [...state.ingredientes];

        pedido.items.forEach(item => {
          const receta = platoIngredientes.filter(pi => pi.plato_id === item.plato_id);
          receta.forEach(r => {
            const idx = nuevosIngredientes.findIndex(i => i.id === r.ingrediente_id);
            if (idx !== -1) {
              nuevosIngredientes[idx] = {
                ...nuevosIngredientes[idx],
                stock_actual: Math.max(0, nuevosIngredientes[idx].stock_actual - (r.cantidad * item.cantidad)),
              };
            }
          });
        });

        set({ ingredientes: nuevosIngredientes });
        get().generarAlertas();
      },

      generarAlertas: () => {
        const state = get();
        const alertas: AlertaInventario[] = [];

        state.ingredientes.forEach(ing => {
          if (ing.stock_actual <= ing.stock_minimo) {
            const nivel = ing.stock_actual <= ing.stock_minimo * 0.3 ? 'critical' : 'warning';
            alertas.push({
              id: ing.id,
              ingrediente_id: ing.id,
              ingrediente_nombre: ing.nombre,
              stock_actual: ing.stock_actual,
              stock_minimo: ing.stock_minimo,
              mensaje: `Stock bajo: ${ing.nombre} (${ing.stock_actual}${ing.unidad_medida} / mín: ${ing.stock_minimo}${ing.unidad_medida})`,
              nivel,
              fecha: new Date(),
            });
          }
        });

        set({ alertas });
      },

      limpiarPedidosListosAntiguos: () => {
        const state = get();
        const ahora = new Date();
        const dosMinutosAtras = new Date(ahora.getTime() - 2 * 60 * 1000);

        const pedidosFiltrados = state.pedidos.filter(pedido => {
          // Mantener pedidos que NO estén listos o que estén listos pero hace menos de 2 minutos
          if (pedido.estado !== 'listo') return true;
          return new Date(pedido.fecha_actualizacion) > dosMinutosAtras;
        });

        if (pedidosFiltrados.length !== state.pedidos.length) {
          console.log('🧹 Limpiando pedidos listos antiguos:', state.pedidos.length - pedidosFiltrados.length, 'pedidos');
          set({ pedidos: pedidosFiltrados });
        }
      },

      // Reservas
      reservas: [],
      
      addReserva: (reserva) => {
        const state = get();
        const nuevaReserva: Reserva = {
          ...reserva,
          id: uuidv4(),
          estado: 'confirmada'
        };
        
        set(state => ({
          reservas: [...state.reservas, nuevaReserva],
          mesas: state.mesas.map(m => 
            m.id === reserva.mesa_id ? { ...m, estado: 'reservada' as const, reserva: nuevaReserva } : m
          )
        }));
        
        get().addNotificacion(`Nueva reserva para Mesa ${reserva.mesa_id} - ${reserva.nombre_cliente}`, 'info');
      },

      updateReserva: (id, data) => {
        set(state => ({
          reservas: state.reservas.map(r => r.id === id ? { ...r, ...data } : r)
        }));
      },

      cancelReserva: (id) => {
        const state = get();
        const reserva = state.reservas.find(r => r.id === id);
        
        if (reserva) {
          set(state => ({
            reservas: state.reservas.map(r => r.id === id ? { ...r, estado: 'cancelada' as const } : r),
            mesas: state.mesas.map(m => 
              m.reserva?.id === id ? { ...m, estado: 'libre' as const, reserva: undefined } : m
            )
          }));
          
          get().addNotificacion(`Reserva cancelada - Mesa ${reserva.mesa_id}`, 'warning');
        }
      },

      // Caja
      caja: {
        id: uuidv4(),
        estado: 'cerrada',
        fecha_apertura: null,
        fecha_cierre: null,
        monto_inicial: 0,
        monto_final: 0,
        movimientos: [],
        usuario_apertura: '',
        usuario_cierre: ''
      },

      abrirCaja: (montoInicial) => {
        const state = get();
        if (!state.currentUser) return;

        set({
          caja: {
            id: uuidv4(),
            estado: 'abierta',
            fecha_apertura: new Date(),
            fecha_cierre: null,
            monto_inicial: montoInicial,
            monto_final: montoInicial,
            movimientos: [],
            usuario_apertura: state.currentUser.nombre,
            usuario_cierre: ''
          }
        });

        get().addNotificacion(`Caja abierta por ${state.currentUser.nombre} con $${montoInicial.toFixed(2)}`, 'success');
      },

      cerrarCaja: () => {
        const state = get();
        if (!state.currentUser) return;

        const movimientos = state.caja.movimientos;
        const totalIngresos = movimientos
          .filter(m => m.tipo === 'ingreso')
          .reduce((sum, m) => sum + m.monto, 0);
        const totalEgresos = movimientos
          .filter(m => m.tipo === 'egreso')
          .reduce((sum, m) => sum + m.monto, 0);
        
        const montoFinal = state.caja.monto_inicial + totalIngresos - totalEgresos;

        set(state => ({
          caja: {
            ...state.caja,
            estado: 'cerrada',
            fecha_cierre: new Date(),
            monto_final: montoFinal,
            usuario_cierre: state.currentUser!.nombre
          }
        }));

        get().addNotificacion(
          `Caja cerrada por ${state.currentUser.nombre}. Total: $${montoFinal.toFixed(2)}`,
          'success'
        );
      },

      addMovimientoCaja: (tipo, concepto, monto, mesa, mesero, items) => {
        const state = get();
        if (!state.currentUser || state.caja.estado !== 'abierta') return;

        const nuevoMovimiento: MovimientoCaja = {
          id: uuidv4(),
          tipo,
          concepto,
          monto,
          fecha: new Date(),
          usuario_id: state.currentUser.id,
          usuario_nombre: state.currentUser.nombre,
          mesa,
          mesero,
          items
        } as any;

        set(state => ({
          caja: {
            ...state.caja,
            movimientos: [nuevoMovimiento, ...state.caja.movimientos] // Al inicio de la lista
          }
        }));

        get().addNotificacion(
          `${tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} registrado: $${monto.toFixed(2)} - ${concepto}`,
          tipo === 'ingreso' ? 'success' : 'warning'
        );
      },

      registrarVentaAutomatica: (pedido) => {
        const state = get();
        if (state.caja.estado !== 'abierta') return;

        state.contadorVentas++;
        const numeroVenta = state.contadorVentas;

        const concepto = `Venta #${numeroVenta} - Mesa ${pedido.mesa_numero} - ${pedido.mesero_nombre}`;
        
        get().addMovimientoCaja(
          'ingreso',
          concepto,
          pedido.total,
          pedido.mesa_numero,
          pedido.mesero_nombre,
          pedido.items
        );
      },

      // Historial de cocina
      historialCocina: [],
      contadorVentas: 0,

      agregarAHistorialCocina: (pedido) => {
        const state = get();
        if (!state.currentUser) return;

        const entrada = {
          id: uuidv4(),
          pedido,
          fecha_entrega: new Date(),
          entregado_por: state.currentUser.nombre
        };

        set(state => ({
          historialCocina: [entrada, ...state.historialCocina].slice(0, 100) // Máximo 100 entradas
        }));
      },

      // Notificaciones
      notificaciones: [],

      addNotificacion: (mensaje, tipo) => {
        const nuevaNotificacion = {
          id: uuidv4(),
          mensaje,
          tipo,
          fecha: new Date(),
          leida: false
        };

        set(state => ({
          notificaciones: [nuevaNotificacion, ...state.notificaciones].slice(0, 50) // Máximo 50 notificaciones
        }));
      },

      marcarNotificacionLeida: (id) => {
        set(state => ({
          notificaciones: state.notificaciones.map(n => 
            n.id === id ? { ...n, leida: true } : n
          )
        }));
      },

      limpiarNotificacionesLeidas: () => {
        set(state => ({
          notificaciones: state.notificaciones.filter(n => !n.leida)
        }));
      },
    }),
    {
      name: 'restaurante-pos-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        usuarios: state.usuarios,
        tema: state.tema,
        restauranteConfig: state.restauranteConfig,
        ingredientes: state.ingredientes,
        platos: state.platos,
        mesas: state.mesas,
        pedidos: state.pedidos,
        reservas: state.reservas,
        caja: state.caja,
        notificaciones: state.notificaciones,
      }),
    }
  )
);
