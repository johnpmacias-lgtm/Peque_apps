import { create } from 'zustand';
import { Usuario, ConfiguracionRestaurante, Ingrediente, Plato, Mesa, Pedido, PedidoItem, EstadoPedido, AlertaInventario } from '../types';
import { usuarios as usuariosInit, configuracion, ingredientes as ingredientesInit, platos as platosInit, mesas as mesasInit, pedidosIniciales, platoIngredientes } from '../data/mockData';

type Tema = 'light' | 'dark';

interface AppState {
  // Auth
  currentUser: Usuario | null;
  usuarios: Usuario[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<Usuario, 'id'>) => void;
  updateUser: (id: number, data: Partial<Usuario>) => void;
  deleteUser: (id: number) => void;

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
  addPedido: (mesaId: number, items: { platoId: number; cantidad: number; notas: string }[], notas: string) => void;
  updatePedidoItemEstado: (pedidoId: number, itemId: number, estado: EstadoPedido) => void;
  updatePedidoEstado: (pedidoId: number, estado: EstadoPedido) => void;
  updateMesaEstado: (mesaId: number, estado: Mesa['estado']) => void;
  addIngrediente: (ingrediente: Omit<Ingrediente, 'id'>) => void;
  updateIngredienteStock: (id: number, cantidad: number) => void;
  addPlato: (plato: Omit<Plato, 'id'>) => void;
  updatePlato: (id: number, data: Partial<Plato>) => void;
  deletePlato: (id: number) => void;
  descontarInventario: (pedidoId: number) => void;
  generarAlertas: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  usuarios: usuariosInit,
  login: (username: string, password: string) => {
    const user = get().usuarios.find(u => u.nombre === username && u.password === password && u.activo);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },
  logout: () => set({ currentUser: null, ultimaFactura: null }),
  
  addUser: (userData) => {
    set(state => ({
      usuarios: [...state.usuarios, { ...userData, id: Date.now() }]
    }));
  },
  
  updateUser: (id, data) => {
    set(state => ({
      usuarios: state.usuarios.map(u => u.id === id ? { ...u, ...data } : u)
    }));
  },
  
  deleteUser: (id) => {
    set(state => ({
      usuarios: state.usuarios.filter(u => u.id !== id)
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
  ingredientes: ingredientesInit,
  platos: platosInit,
  mesas: mesasInit,
  pedidos: pedidosIniciales,
  alertas: [],

  // Factura
  ultimaFactura: null,
  setUltimaFactura: (pedido) => set({ ultimaFactura: pedido }),

  // Acciones
  addPedido: (mesaId, items, notas) => {
    const state = get();
    const mesa = state.mesas.find(m => m.id === mesaId);
    if (!mesa || !state.currentUser) return;

    const newItems: PedidoItem[] = items.map((item, idx) => {
      const plato = state.platos.find(p => p.id === item.platoId);
      return {
        id: Date.now() + idx,
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
      id: Date.now(),
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
      ingredientes: [...state.ingredientes, { ...ingrediente, id: Date.now() }],
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
      platos: [...state.platos, { ...plato, id: Date.now() }],
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
}));
