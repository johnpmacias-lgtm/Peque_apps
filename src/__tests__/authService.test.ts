import { describe, it, expect } from 'vitest';
import { validateUsername, validatePasswordStrength, validatePrecio, validateStock, validateEmail } from '../services/authService';

describe('AuthService - Validaciones', () => {
  describe('validateUsername', () => {
    it('debería aceptar nombres válidos', () => {
      expect(validateUsername('Carlos Admin').valid).toBe(true);
      expect(validateUsername('María').valid).toBe(true);
      expect(validateUsername('Chef Roberto').valid).toBe(true);
    });

    it('debería rechazar nombres vacíos', () => {
      expect(validateUsername('').valid).toBe(false);
      expect(validateUsername('   ').valid).toBe(false);
    });

    it('debería rechazar nombres muy cortos', () => {
      const result = validateUsername('AB');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('3 caracteres');
    });

    it('debería rechazar nombres muy largos', () => {
      const longName = 'A'.repeat(31);
      const result = validateUsername(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('30 caracteres');
    });

    it('debería rechazar caracteres especiales', () => {
      const result = validateUsername('user@name');
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('debería aceptar contraseñas fuertes', () => {
      const result = validatePasswordStrength('Admin123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debería rechazar contraseñas muy cortas', () => {
      const result = validatePasswordStrength('Ab1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Mínimo 6 caracteres');
    });

    it('debería requerir al menos una mayúscula', () => {
      const result = validatePasswordStrength('admin123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Al menos una mayúscula');
    });

    it('debería requerir al menos un número', () => {
      const result = validatePasswordStrength('Adminabc');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Al menos un número');
    });

    it('debería reportar múltiples errores', () => {
      const result = validatePasswordStrength('abc');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validatePrecio', () => {
    it('debería aceptar precios válidos', () => {
      expect(validatePrecio(0).valid).toBe(true);
      expect(validatePrecio(100).valid).toBe(true);
      expect(validatePrecio(999.99).valid).toBe(true);
    });

    it('debería rechazar precios negativos', () => {
      const result = validatePrecio(-10);
      expect(result.valid).toBe(false);
    });

    it('debería rechazar precios demasiado altos', () => {
      const result = validatePrecio(10000000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('demasiado alto');
    });

    it('debería rechazar NaN', () => {
      const result = validatePrecio(NaN);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateStock', () => {
    it('debería aceptar cantidades válidas', () => {
      expect(validateStock(0).valid).toBe(true);
      expect(validateStock(100).valid).toBe(true);
    });

    it('debería rechazar cantidades negativas', () => {
      const result = validateStock(-5);
      expect(result.valid).toBe(false);
    });

    it('debería rechazar cantidades excesivas', () => {
      const result = validateStock(100000000);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('debería aceptar emails válidos', () => {
      expect(validateEmail('test@example.com').valid).toBe(true);
      expect(validateEmail('user.name@domain.co').valid).toBe(true);
    });

    it('debería rechazar emails inválidos', () => {
      expect(validateEmail('notanemail').valid).toBe(false);
      expect(validateEmail('missing@domain').valid).toBe(false);
      expect(validateEmail('@nodomain.com').valid).toBe(false);
    });

    it('debería rechazar emails vacíos', () => {
      expect(validateEmail('').valid).toBe(false);
    });
  });
});
