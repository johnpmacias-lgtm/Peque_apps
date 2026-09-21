import { Usuario, ConfiguracionRestaurante, Ingrediente, Plato, PlatoIngrediente, Mesa, Pedido, PedidoItem } from '../types';

// ============================================
// USUARIOS (contraseñas en texto plano para demo)
// ============================================
export const usuarios: Usuario[] = [
  { id: 1, nombre: 'Carlos Admin', password: 'admin123', rol: 'admin', activo: true },
  { id: 2, nombre: 'María Mesero', password: 'mesero123', rol: 'mesero', activo: true },
  { id: 3, nombre: 'Chef Roberto', password: 'cocina123', rol: 'cocina', activo: true },
  { id: 4, nombre: 'Ana López', password: 'mesero123', rol: 'mesero', activo: true },
];

// ============================================
// CONFIGURACIÓN DEL RESTAURANTE
// ============================================
export const configuracion: ConfiguracionRestaurante = {
  id: 1,
  nombre: 'La Casa del Sabor',
  logotipo: '🍽️',
  moneda: 'MXN',
  direccion: 'Av. Reforma 123, Col. Centro, CDMX',
  telefono: '+52 55 1234 5678',
  tema: 'dark',
  colorPrimario: '#f59e0b',
};

// ============================================
// INGREDIENTES
// ============================================
export const ingredientes: Ingrediente[] = [
  { id: 1, nombre: 'Carne de Res', stock_actual: 5000, stock_minimo: 2000, unidad_medida: 'g', categoria: 'Proteínas' },
  { id: 2, nombre: 'Pollo', stock_actual: 3000, stock_minimo: 1500, unidad_medida: 'g', categoria: 'Proteínas' },
  { id: 3, nombre: 'Pan Hamburguesa', stock_actual: 20, stock_minimo: 10, unidad_medida: 'pz', categoria: 'Panadería' },
  { id: 4, nombre: 'Queso Cheddar', stock_actual: 800, stock_minimo: 500, unidad_medida: 'g', categoria: 'Lácteos' },
  { id: 5, nombre: 'Lechuga', stock_actual: 500, stock_minimo: 300, unidad_medida: 'g', categoria: 'Verduras' },
  { id: 6, nombre: 'Tomate', stock_actual: 1200, stock_minimo: 500, unidad_medida: 'g', categoria: 'Verduras' },
  { id: 7, nombre: 'Cebolla', stock_actual: 600, stock_minimo: 400, unidad_medida: 'g', categoria: 'Verduras' },
  { id: 8, nombre: 'Pasta Spaghetti', stock_actual: 2000, stock_minimo: 1000, unidad_medida: 'g', categoria: 'Granos' },
  { id: 9, nombre: 'Salsa de Tomate', stock_actual: 1500, stock_minimo: 800, unidad_medida: 'ml', categoria: 'Salsas' },
  { id: 10, nombre: 'Aceite de Oliva', stock_actual: 400, stock_minimo: 200, unidad_medida: 'ml', categoria: 'Aceites' },
  { id: 11, nombre: 'Tortilla de Maíz', stock_actual: 50, stock_minimo: 30, unidad_medida: 'pz', categoria: 'Panadería' },
  { id: 12, nombre: 'Frijoles', stock_actual: 1500, stock_minimo: 800, unidad_medida: 'g', categoria: 'Granos' },
  { id: 13, nombre: 'Arroz', stock_actual: 3000, stock_minimo: 1000, unidad_medida: 'g', categoria: 'Granos' },
  { id: 14, nombre: 'Aguacate', stock_actual: 200, stock_minimo: 300, unidad_medida: 'g', categoria: 'Verduras' },
  { id: 15, nombre: 'Crema', stock_actual: 300, stock_minimo: 200, unidad_medida: 'ml', categoria: 'Lácteos' },
];

// ============================================
// PLATOS
// ============================================
export const platos: Plato[] = [
  { id: 1, nombre: 'Hamburguesa Clásica', precio: 120, categoria: 'Hamburguesas', descripcion: 'Carne 150g, queso, lechuga, tomate', disponible: true },
  { id: 2, nombre: 'Hamburguesa Doble', precio: 165, categoria: 'Hamburguesas', descripcion: 'Doble carne, doble queso, bacon', disponible: true },
  { id: 3, nombre: 'Spaghetti Bolognesa', precio: 95, categoria: 'Pastas', descripcion: 'Pasta con salsa de carne', disponible: true },
  { id: 4, nombre: 'Ensalada César', precio: 75, categoria: 'Ensaladas', descripcion: 'Lechuga, pollo, crutones, aderezo', disponible: true },
  { id: 5, nombre: 'Tacos de Pollo (3pz)', precio: 85, categoria: 'Mexicana', descripcion: 'Tortilla, pollo, cebolla, cilantro', disponible: true },
  { id: 6, nombre: 'Quesadilla Grande', precio: 70, categoria: 'Mexicana', descripcion: 'Tortilla grande con queso y pollo', disponible: true },
  { id: 7, nombre: 'Pollo a la Plancha', precio: 130, categoria: 'Platos Fuertes', descripcion: 'Pechuga con arroz y ensalada', disponible: true },
  { id: 8, nombre: 'Nachos Supremos', precio: 110, categoria: 'Entradas', descripcion: 'Nachos con queso, frijoles, crema', disponible: true },
];

// ============================================
// RECETAS (Plato-Ingrediente)
// ============================================
export const platoIngredientes: PlatoIngrediente[] = [
  // Hamburguesa Clásica
  { plato_id: 1, ingrediente_id: 1, cantidad: 150 },
  { plato_id: 1, ingrediente_id: 3, cantidad: 1 },
  { plato_id: 1, ingrediente_id: 4, cantidad: 30 },
  { plato_id: 1, ingrediente_id: 5, cantidad: 30 },
  { plato_id: 1, ingrediente_id: 6, cantidad: 40 },
  // Hamburguesa Doble
  { plato_id: 2, ingrediente_id: 1, cantidad: 300 },
  { plato_id: 2, ingrediente_id: 3, cantidad: 1 },
  { plato_id: 2, ingrediente_id: 4, cantidad: 60 },
  { plato_id: 2, ingrediente_id: 5, cantidad: 30 },
  { plato_id: 2, ingrediente_id: 6, cantidad: 40 },
  // Spaghetti Bolognesa
  { plato_id: 3, ingrediente_id: 8, cantidad: 150 },
  { plato_id: 3, ingrediente_id: 9, cantidad: 100 },
  { plato_id: 3, ingrediente_id: 1, cantidad: 80 },
  { plato_id: 3, ingrediente_id: 10, cantidad: 15 },
  // Ensalada César
  { plato_id: 4, ingrediente_id: 5, cantidad: 100 },
  { plato_id: 4, ingrediente_id: 2, cantidad: 120 },
  // Tacos de Pollo
  { plato_id: 5, ingrediente_id: 11, cantidad: 3 },
  { plato_id: 5, ingrediente_id: 2, cantidad: 150 },
  { plato_id: 5, ingrediente_id: 7, cantidad: 30 },
  // Quesadilla Grande
  { plato_id: 6, ingrediente_id: 11, cantidad: 1 },
  { plato_id: 6, ingrediente_id: 4, cantidad: 50 },
  { plato_id: 6, ingrediente_id: 2, cantidad: 100 },
  // Pollo a la Plancha
  { plato_id: 7, ingrediente_id: 2, cantidad: 250 },
  { plato_id: 7, ingrediente_id: 13, cantidad: 100 },
  { plato_id: 7, ingrediente_id: 5, cantidad: 50 },
  // Nachos Supremos
  { plato_id: 8, ingrediente_id: 11, cantidad: 5 },
  { plato_id: 8, ingrediente_id: 4, cantidad: 80 },
  { plato_id: 8, ingrediente_id: 12, cantidad: 100 },
  { plato_id: 8, ingrediente_id: 15, cantidad: 30 },
];

// ============================================
// MESAS
// ============================================
export const mesas: Mesa[] = [
  { id: 1, numero: 1, capacidad: 4, estado: 'libre' },
  { id: 2, numero: 2, capacidad: 2, estado: 'ocupada' },
  { id: 3, numero: 3, capacidad: 6, estado: 'libre' },
  { id: 4, numero: 4, capacidad: 4, estado: 'ocupada' },
  { id: 5, numero: 5, capacidad: 2, estado: 'libre' },
  { id: 6, numero: 6, capacidad: 8, estado: 'reservada' },
  { id: 7, numero: 7, capacidad: 4, estado: 'libre' },
  { id: 8, numero: 8, capacidad: 4, estado: 'ocupada' },
  { id: 9, numero: 9, capacidad: 2, estado: 'libre' },
  { id: 10, numero: 10, capacidad: 6, estado: 'libre' },
];

// ============================================
// PEDIDOS ACTIVOS
// ============================================
export const pedidosIniciales: Pedido[] = [
  {
    id: 1,
    mesa_id: 2,
    mesa_numero: 2,
    mesero_id: 2,
    mesero_nombre: 'María Mesero',
    items: [
      { id: 1, plato_id: 1, plato_nombre: 'Hamburguesa Clásica', cantidad: 2, notas: 'Sin cebolla', estado: 'pendiente' },
      { id: 2, plato_id: 3, plato_nombre: 'Spaghetti Bolognesa', cantidad: 1, notas: '', estado: 'pendiente' },
    ],
    estado: 'pendiente',
    fecha_creacion: new Date(Date.now() - 10 * 60000),
    fecha_actualizacion: new Date(Date.now() - 10 * 60000),
    total: 335,
    notas_generales: 'Cliente alérgico al marisco',
  },
  {
    id: 2,
    mesa_id: 4,
    mesa_numero: 4,
    mesero_id: 2,
    mesero_nombre: 'María Mesero',
    items: [
      { id: 3, plato_id: 7, plato_nombre: 'Pollo a la Plancha', cantidad: 1, notas: 'Término medio', estado: 'preparando' },
      { id: 4, plato_id: 4, plato_nombre: 'Ensalada César', cantidad: 1, notas: 'Sin crutones', estado: 'pendiente' },
    ],
    estado: 'pendiente',
    fecha_creacion: new Date(Date.now() - 5 * 60000),
    fecha_actualizacion: new Date(Date.now() - 3 * 60000),
    total: 205,
    notas_generales: '',
  },
  {
    id: 3,
    mesa_id: 8,
    mesa_numero: 8,
    mesero_id: 4,
    mesero_nombre: 'Ana López',
    items: [
      { id: 5, plato_id: 5, plato_nombre: 'Tacos de Pollo (3pz)', cantidad: 2, notas: 'Extra salsa verde', estado: 'pendiente' },
      { id: 6, plato_id: 8, plato_nombre: 'Nachos Supremos', cantidad: 1, notas: '', estado: 'listo' },
      { id: 7, plato_id: 2, plato_nombre: 'Hamburguesa Doble', cantidad: 1, notas: 'Sin tomate', estado: 'pendiente' },
    ],
    estado: 'pendiente',
    fecha_creacion: new Date(Date.now() - 15 * 60000),
    fecha_actualizacion: new Date(Date.now() - 8 * 60000),
    total: 420,
    notas_generales: 'Mesa celebrando cumpleaños',
  },
];
