// ============================================
// TIPOS DEL SISTEMA DE ADMINISTRACIÓN DE RESTAURANTES
// ============================================

export type UserRole = 'admin' | 'mesero' | 'cocina';

export interface Usuario {
  id: number;
  nombre: string;
  password: string; // En producción: bcrypt hash
  rol: UserRole;
  activo: boolean;
  avatar?: string;
}

export interface ConfiguracionRestaurante {
  id: number;
  nombre: string;
  logotipo: string;
  moneda: string;
  direccion: string;
  telefono: string;
  tema: 'light' | 'dark';
  colorPrimario: string;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  unidad_medida: string;
  categoria: string;
}

export interface Plato {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion: string;
  disponible: boolean;
  imagen?: string;
}

export interface PlatoIngrediente {
  plato_id: number;
  ingrediente_id: number;
  cantidad: number;
}

export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  estado: 'libre' | 'ocupada' | 'reservada';
}

export type EstadoPedido = 'pendiente' | 'preparando' | 'listo' | 'servido' | 'pagado' | 'cancelado';

export interface PedidoItem {
  id: number;
  plato_id: number;
  plato_nombre: string;
  cantidad: number;
  notas: string;
  estado: EstadoPedido;
}

export interface Pedido {
  id: number;
  mesa_id: number;
  mesa_numero: number;
  mesero_id: number;
  mesero_nombre: string;
  items: PedidoItem[];
  estado: EstadoPedido;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  total: number;
  notas_generales: string;
}

export interface AlertaInventario {
  id: number;
  ingrediente_id: number;
  ingrediente_nombre: string;
  stock_actual: number;
  stock_minimo: number;
  mensaje: string;
  nivel: 'warning' | 'critical';
  fecha: Date;
}
