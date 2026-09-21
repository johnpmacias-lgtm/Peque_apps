import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Usuario, ConfiguracionRestaurante, Ingrediente, Plato, Mesa, Pedido, PedidoItem, EstadoPedido, AlertaInventario } from '../types';
import { hashPassword, verifyPassword } from '../services/authService';
import { configuracion, platos as platosInit, mesas as mesasInit, pedidosIniciales, platoIngredientes } from '../data/mockData';

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
  addIngrediente: (ingrediente: Omit<Ingrediente, 'id'>) => void;
  updateIngredienteStock: (id: string, cantidad: number) => void;
  addPlato: (plato: Omit<Plato, 'id'>) => void;
  updatePlato: (id: string, data: Partial<Plato>) => void;
  deletePlato: (id: string) => void;
  descontarInventario: (pedidoId: string) => void;
  generarAlertas: () => void;
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
        
        // Si ya está cargando, no hacer nada
        if (state.isLoading) return;
        
        set({ isLoading: true });
        
        try {
          // Verificar si los usuarios necesitan migración (no tienen passwordHash)
          const needsMigration = state.usuarios.length === 0 || 
            state.usuarios.some(u => !u.passwordHash || u.passwordHash === '');
          
          if (needsMigration) {
            // Crear usuarios por defecto con contraseñas hasheadas
            const defaultUsers = await createDefaultUsers();
            set({ 
              usuarios: defaultUsers, 
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Error initializing store:', error);
          set({ isLoading: false });
        }
      },

      login: async (username: string, password: string) => {
        const state = get();
        
        // Buscar usuario por nombre
        const user = state.usuarios.find(u => u.nombre === username && u.activo);
        if (!user) {
          console.log('Usuario no encontrado o inactivo:', username);
          return false;
        }
        
        // Verificar que tenga passwordHash
        if (!user.passwordHash) {
          console.error('Usuario sin passwordHash:', username);
          return false;
        }
        
        try {
          // Verificación segura con bcrypt
          const isValid = await verifyPassword(password, user.passwordHash);
          if (!isValid) {
            console.log('Contraseña incorrecta para:', username);
            return false;
          }
          
          set({ currentUser: user });
          return true;
        } catch (error) {
          console.error('Error en login:', error);
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

        if (estado === 'pagado' && pedido) {
          get().descontarInventario(pedidoId);
          get().setUltimaFactura(pedido);
        }
      },

      updateMesaEstado: (mesaId, estado) => {
        set(state => ({
          mesas: state.mesas.map(m => m.id === mesaId ? { ...m, estado } : m),
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
      }),
    }
  )
);
