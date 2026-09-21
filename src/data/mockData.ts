import { v4 as uuidv4 } from 'uuid';
import { Usuario, ConfiguracionRestaurante, Ingrediente, Plato, PlatoIngrediente, Mesa, Pedido } from '../types';

// ============================================
// CONFIGURACIÓN DEL RESTAURANTE
// ============================================
export const configuracion: ConfiguracionRestaurante = {
  id: uuidv4(),
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
  { id: uuidv4(), nombre: 'Carne de Res', stock_actual: 5000, stock_minimo: 2000, unidad_medida: 'g', categoria: 'Proteínas' },
  { id: uuidv4(), nombre: 'Pollo', stock_actual: 3000, stock_minimo: 1500, unidad_medida: 'g', categoria: 'Proteínas' },
  { id: uuidv4(), nombre: 'Pan Hamburguesa', stock_actual: 20, stock_minimo: 10, unidad_medida: 'pz', categoria: 'Panadería' },
  { id: uuidv4(), nombre: 'Queso Cheddar', stock_actual: 800, stock_minimo: 500, unidad_medida: 'g', categoria: 'Lácteos' },
  { id: uuidv4(), nombre: 'Lechuga', stock_actual: 500, stock_minimo: 300, unidad_medida: 'g', categoria: 'Verduras' },
  { id: uuidv4(), nombre: 'Tomate', stock_actual: 1200, stock_minimo: 500, unidad_medida: 'g', categoria: 'Verduras' },
  { id: uuidv4(), nombre: 'Cebolla', stock_actual: 600, stock_minimo: 400, unidad_medida: 'g', categoria: 'Verduras' },
  { id: uuidv4(), nombre: 'Pasta Spaghetti', stock_actual: 2000, stock_minimo: 1000, unidad_medida: 'g', categoria: 'Granos' },
  { id: uuidv4(), nombre: 'Salsa de Tomate', stock_actual: 1500, stock_minimo: 800, unidad_medida: 'ml', categoria: 'Salsas' },
  { id: uuidv4(), nombre: 'Aceite de Oliva', stock_actual: 400, stock_minimo: 200, unidad_medida: 'ml', categoria: 'Aceites' },
  { id: uuidv4(), nombre: 'Tortilla de Maíz', stock_actual: 50, stock_minimo: 30, unidad_medida: 'pz', categoria: 'Panadería' },
  { id: uuidv4(), nombre: 'Frijoles', stock_actual: 1500, stock_minimo: 800, unidad_medida: 'g', categoria: 'Granos' },
  { id: uuidv4(), nombre: 'Arroz', stock_actual: 3000, stock_minimo: 1000, unidad_medida: 'g', categoria: 'Granos' },
  { id: uuidv4(), nombre: 'Aguacate', stock_actual: 200, stock_minimo: 300, unidad_medida: 'g', categoria: 'Verduras' },
  { id: uuidv4(), nombre: 'Crema', stock_actual: 300, stock_minimo: 200, unidad_medida: 'ml', categoria: 'Lácteos' },
];

// ============================================
// PLATOS
// ============================================
export const platos: Plato[] = [
  { id: uuidv4(), nombre: 'Hamburguesa Clásica', precio: 120, categoria: 'Comida Rápida', descripcion: 'Carne 150g, queso, lechuga, tomate', disponible: true },
  { id: uuidv4(), nombre: 'Hamburguesa Doble', precio: 165, categoria: 'Comida Rápida', descripcion: 'Doble carne, doble queso, bacon', disponible: true },
  { id: uuidv4(), nombre: 'Spaghetti Bolognesa', precio: 95, categoria: 'Pastas', descripcion: 'Pasta con salsa de carne', disponible: true },
  { id: uuidv4(), nombre: 'Ensalada César', precio: 75, categoria: 'Ensaladas', descripcion: 'Lechuga, pollo, crutones, aderezo', disponible: true },
  { id: uuidv4(), nombre: 'Tacos de Pollo (3pz)', precio: 85, categoria: 'Mexicana', descripcion: 'Tortilla, pollo, cebolla, cilantro', disponible: true },
  { id: uuidv4(), nombre: 'Quesadilla Grande', precio: 70, categoria: 'Mexicana', descripcion: 'Tortilla grande con queso y pollo', disponible: true },
  { id: uuidv4(), nombre: 'Pollo a la Plancha', precio: 130, categoria: 'Platos Fuertes', descripcion: 'Pechuga con arroz y ensalada', disponible: true },
  { id: uuidv4(), nombre: 'Nachos Supremos', precio: 110, categoria: 'Entradas', descripcion: 'Nachos con queso, frijoles, crema', disponible: true },
  { id: uuidv4(), nombre: 'Café Americano', precio: 35, categoria: 'Café', descripcion: 'Café de grano recién molido', disponible: true },
  { id: uuidv4(), nombre: 'Café Latte', precio: 45, categoria: 'Café', descripcion: 'Espresso con leche vaporizada', disponible: true },
  { id: uuidv4(), nombre: 'Café Cappuccino', precio: 50, categoria: 'Café', descripcion: 'Espresso, leche y espuma', disponible: true },
  { id: uuidv4(), nombre: 'Té Verde', precio: 30, categoria: 'Té', descripcion: 'Té verde orgánico', disponible: true },
  { id: uuidv4(), nombre: 'Té de Manzanilla', precio: 30, categoria: 'Té', descripcion: 'Infusión de manzanilla natural', disponible: true },
  { id: uuidv4(), nombre: 'Té Chai Latte', precio: 45, categoria: 'Té', descripcion: 'Té chai con leche y especias', disponible: true },
  { id: uuidv4(), nombre: 'Panqué con Mermelada', precio: 55, categoria: 'Merienda', descripcion: 'Panqué casero con mermelada artesanal', disponible: true },
  { id: uuidv4(), nombre: 'Sándwich de Jamón', precio: 65, categoria: 'Merienda', descripcion: 'Jamón, queso, lechuga y tomate', disponible: true },
  { id: uuidv4(), nombre: 'Croissant', precio: 40, categoria: 'Merienda', descripcion: 'Croissant de mantequilla', disponible: true },
  { id: uuidv4(), nombre: 'Cheesecake', precio: 70, categoria: 'Postres', descripcion: 'Cheesecake de frutos rojos', disponible: true },
  { id: uuidv4(), nombre: 'Pastel de Chocolate', precio: 75, categoria: 'Postres', descripcion: 'Pastel de chocolate con ganache', disponible: true },
  { id: uuidv4(), nombre: 'Limonada Natural', precio: 35, categoria: 'Bebidas', descripcion: 'Limonada fresca con hierbabuena', disponible: true },
  { id: uuidv4(), nombre: 'Jugo de Naranja', precio: 40, categoria: 'Bebidas', descripcion: 'Jugo de naranja natural', disponible: true },
];

// ============================================
// RECETAS (Plato-Ingrediente) - referencias por nombre para mantener consistencia
// ============================================
export const platoIngredientes: PlatoIngrediente[] = [];

// Helper para crear recetas usando nombres
function addReceta(platoNombre: string, ingredienteNombre: string, cantidad: number) {
  const plato = platos.find(p => p.nombre === platoNombre);
  const ingrediente = ingredientes.find(i => i.nombre === ingredienteNombre);
  if (plato && ingrediente) {
    platoIngredientes.push({
      plato_id: plato.id,
      ingrediente_id: ingrediente.id,
      cantidad,
    });
  }
}

// Hamburguesa Clásica
addReceta('Hamburguesa Clásica', 'Carne de Res', 150);
addReceta('Hamburguesa Clásica', 'Pan Hamburguesa', 1);
addReceta('Hamburguesa Clásica', 'Queso Cheddar', 30);
addReceta('Hamburguesa Clásica', 'Lechuga', 30);
addReceta('Hamburguesa Clásica', 'Tomate', 40);
// Hamburguesa Doble
addReceta('Hamburguesa Doble', 'Carne de Res', 300);
addReceta('Hamburguesa Doble', 'Pan Hamburguesa', 1);
addReceta('Hamburguesa Doble', 'Queso Cheddar', 60);
addReceta('Hamburguesa Doble', 'Lechuga', 30);
addReceta('Hamburguesa Doble', 'Tomate', 40);
// Spaghetti
addReceta('Spaghetti Bolognesa', 'Pasta Spaghetti', 150);
addReceta('Spaghetti Bolognesa', 'Salsa de Tomate', 100);
addReceta('Spaghetti Bolognesa', 'Carne de Res', 80);
addReceta('Spaghetti Bolognesa', 'Aceite de Oliva', 15);
// Ensalada César
addReceta('Ensalada César', 'Lechuga', 100);
addReceta('Ensalada César', 'Pollo', 120);
// Tacos
addReceta('Tacos de Pollo (3pz)', 'Tortilla de Maíz', 3);
addReceta('Tacos de Pollo (3pz)', 'Pollo', 150);
addReceta('Tacos de Pollo (3pz)', 'Cebolla', 30);
// Quesadilla
addReceta('Quesadilla Grande', 'Tortilla de Maíz', 1);
addReceta('Quesadilla Grande', 'Queso Cheddar', 50);
addReceta('Quesadilla Grande', 'Pollo', 100);
// Pollo a la Plancha
addReceta('Pollo a la Plancha', 'Pollo', 250);
addReceta('Pollo a la Plancha', 'Arroz', 100);
addReceta('Pollo a la Plancha', 'Lechuga', 50);
// Nachos
addReceta('Nachos Supremos', 'Tortilla de Maíz', 5);
addReceta('Nachos Supremos', 'Queso Cheddar', 80);
addReceta('Nachos Supremos', 'Frijoles', 100);
addReceta('Nachos Supremos', 'Crema', 30);

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
    id: uuidv4(),
    mesa_id: 2,
    mesa_numero: 2,
    mesero_id: 'mesero-1',
    mesero_nombre: 'María Mesero',
    items: [
      { id: uuidv4(), plato_id: platos[0].id, plato_nombre: 'Hamburguesa Clásica', cantidad: 2, notas: 'Sin cebolla', estado: 'pendiente' },
      { id: uuidv4(), plato_id: platos[2].id, plato_nombre: 'Spaghetti Bolognesa', cantidad: 1, notas: '', estado: 'pendiente' },
    ],
    estado: 'pendiente',
    fecha_creacion: new Date(Date.now() - 10 * 60000),
    fecha_actualizacion: new Date(Date.now() - 10 * 60000),
    total: 335,
    notas_generales: 'Cliente alérgico al marisco',
  },
  {
    id: uuidv4(),
    mesa_id: 4,
    mesa_numero: 4,
    mesero_id: 'mesero-1',
    mesero_nombre: 'María Mesero',
    items: [
      { id: uuidv4(), plato_id: platos[6].id, plato_nombre: 'Pollo a la Plancha', cantidad: 1, notas: 'Término medio', estado: 'preparando' },
      { id: uuidv4(), plato_id: platos[3].id, plato_nombre: 'Ensalada César', cantidad: 1, notas: 'Sin crutones', estado: 'pendiente' },
    ],
    estado: 'pendiente',
    fecha_creacion: new Date(Date.now() - 5 * 60000),
    fecha_actualizacion: new Date(Date.now() - 3 * 60000),
    total: 205,
    notas_generales: '',
  },
  {
    id: uuidv4(),
    mesa_id: 8,
    mesa_numero: 8,
    mesero_id: 'mesero-2',
    mesero_nombre: 'Ana López',
    items: [
      { id: uuidv4(), plato_id: platos[4].id, plato_nombre: 'Tacos de Pollo (3pz)', cantidad: 2, notas: 'Extra salsa verde', estado: 'pendiente' },
      { id: uuidv4(), plato_id: platos[7].id, plato_nombre: 'Nachos Supremos', cantidad: 1, notas: '', estado: 'listo' },
      { id: uuidv4(), plato_id: platos[1].id, plato_nombre: 'Hamburguesa Doble', cantidad: 1, notas: 'Sin tomate', estado: 'pendiente' },
    ],
    estado: 'pendiente',
    fecha_creacion: new Date(Date.now() - 15 * 60000),
    fecha_actualizacion: new Date(Date.now() - 8 * 60000),
    total: 420,
    notas_generales: 'Mesa celebrando cumpleaños',
  },
];
