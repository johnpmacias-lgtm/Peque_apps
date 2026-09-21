import bcrypt from 'bcryptjs';

/**
 * Servicio de autenticación.
 * Simula un backend real: las contraseñas se almacenan como hashes bcrypt
 * y la verificación se hace comparando hashes, nunca texto plano.
 * 
 * En producción, estas funciones vivirían en el servidor Go/Node
 * y el cliente solo enviaría credenciales vía HTTPS.
 */

const SALT_ROUNDS = 10;

export interface AuthUser {
  id: string;
  nombre: string;
  passwordHash: string;
  rol: 'admin' | 'mesero' | 'cocina';
  activo: boolean;
}

// Hash de contraseñas (solo para inicialización)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verificación segura de contraseña
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Validación de fortaleza de contraseña
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 6) errors.push('Mínimo 6 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
  if (!/[0-9]/.test(password)) errors.push('Al menos un número');
  return { valid: errors.length === 0, errors };
}

// Validación de nombre de usuario
export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'El nombre de usuario es obligatorio' };
  }
  if (username.length < 3) {
    return { valid: false, error: 'Mínimo 3 caracteres' };
  }
  if (username.length > 30) {
    return { valid: false, error: 'Máximo 30 caracteres' };
  }
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(username)) {
    return { valid: false, error: 'Solo letras, números y espacios' };
  }
  return { valid: true };
}

// Validación de email
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email) return { valid: false, error: 'El email es obligatorio' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email inválido' };
  }
  return { valid: true };
}

// Validación de precio
export function validatePrecio(precio: number): {
  valid: boolean;
  error?: string;
} {
  if (isNaN(precio) || precio < 0) {
    return { valid: false, error: 'El precio debe ser un número positivo' };
  }
  if (precio > 999999) {
    return { valid: false, error: 'Precio demasiado alto' };
  }
  return { valid: true };
}

// Validación de cantidad de stock
export function validateStock(stock: number): {
  valid: boolean;
  error?: string;
} {
  if (isNaN(stock) || stock < 0) {
    return { valid: false, error: 'El stock debe ser un número positivo' };
  }
  if (stock > 9999999) {
    return { valid: false, error: 'Cantidad demasiado alta' };
  }
  return { valid: true };
}
