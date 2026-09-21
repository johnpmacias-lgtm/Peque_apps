// ============================================
// TIPOS DEL SISTEMA DE ADMINISTRACIÓN DE RESTAURANTES
// ============================================

export type UserRole = 'admin' | 'mesero' | 'cocina';

export interface Usuario {
  id: string;
  nombre: string;
  passwordHash: string;
  rol: UserRole;
  activo: boolean;
  avatar?: string;
}

export interface ConfiguracionRestaurante {
  id: string;
  nombre: string;
  logotipo: string;
  moneda: string;
  direccion: string;
  telefono: string;
  tema: 'light' | 'dark';
  colorPrimario: string;
}

export interface Ingrediente {
  id: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  unidad_medida: string;
  categoria: string;
}

export interface Plato {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion: string;
  disponible: boolean;
  imagen?: string;
}

export interface PlatoIngrediente {
  plato_id: string;
  ingrediente_id: string;
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
  id: string;
  plato_id: string;
  plato_nombre: string;
  cantidad: number;
  notas: string;
  estado: EstadoPedido;
}

export interface Pedido {
  id: string;
  mesa_id: number;
  mesa_numero: number;
  mesero_id: string;
  mesero_nombre: string;
  items: PedidoItem[];
  estado: EstadoPedido;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  total: number;
  notas_generales: string;
}

export interface AlertaInventario {
  id: string;
  ingrediente_id: string;
  ingrediente_nombre: string;
  stock_actual: number;
  stock_minimo: number;
  mensaje: string;
  nivel: 'warning' | 'critical';
  fecha: Date;
}
