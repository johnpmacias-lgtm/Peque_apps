import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';

describe('Store - Lógica de Negocio', () => {
  beforeEach(() => {
    // Reset store state
    useStore.setState({
      pedidos: [],
      ingredientes: [],
      alertas: [],
    });
  });

  describe('addPedido - Cálculo de totales', () => {
    it('debería calcular correctamente el total de un pedido', async () => {
      // Setup
      await useStore.getState().initialize();
      useStore.setState({
        currentUser: {
          id: 'test-user',
          nombre: 'Test User',
          passwordHash: 'hash',
          rol: 'mesero',
          activo: true,
        },
      });

      const platos = useStore.getState().platos;
      const primerPlato = platos[0];

      // Action
      useStore.getState().addPedido(
        1,
        [{ platoId: primerPlato.id, cantidad: 2, notas: '' }],
        ''
      );

      // Assert
      const pedidos = useStore.getState().pedidos;
      expect(pedidos).toHaveLength(1);
      expect(pedidos[0].total).toBe(primerPlato.precio * 2);
      expect(pedidos[0].mesa_numero).toBe(1);
      expect(pedidos[0].estado).toBe('pendiente');
    });

    it('debería calcular el total con múltiples items', async () => {
      await useStore.getState().initialize();
      useStore.setState({
        currentUser: {
          id: 'test-user',
          nombre: 'Test User',
          passwordHash: 'hash',
          rol: 'mesero',
          activo: true,
        },
      });

      const platos = useStore.getState().platos;

      useStore.getState().addPedido(
        1,
        [
          { platoId: platos[0].id, cantidad: 1, notas: '' },
          { platoId: platos[1].id, cantidad: 2, notas: '' },
        ],
        ''
      );

      const pedidos = useStore.getState().pedidos;
      const expectedTotal = platos[0].precio * 1 + platos[1].precio * 2;
      expect(pedidos[0].total).toBe(expectedTotal);
    });

    it('debería actualizar el estado de la mesa a ocupada', async () => {
      await useStore.getState().initialize();
      useStore.setState({
        currentUser: {
          id: 'test-user',
          nombre: 'Test User',
          passwordHash: 'hash',
          rol: 'mesero',
          activo: true,
        },
      });

      const platos = useStore.getState().platos;
      const mesasAntes = useStore.getState().mesas;
      const mesaLibre = mesasAntes.find(m => m.estado === 'libre');

      useStore.getState().addPedido(
        mesaLibre!.id,
        [{ platoId: platos[0].id, cantidad: 1, notas: '' }],
        ''
      );

      const mesasDespues = useStore.getState().mesas;
      const mesaActualizada = mesasDespues.find(m => m.id === mesaLibre!.id);
      expect(mesaActualizada?.estado).toBe('ocupada');
    });
  });

  describe('generarAlertas - Stock bajo', () => {
    it('debería generar alertas para ingredientes con stock bajo', () => {
      useStore.setState({
        ingredientes: [
          { id: '1', nombre: 'Ingrediente A', stock_actual: 50, stock_minimo: 100, unidad_medida: 'g', categoria: 'Test' },
          { id: '2', nombre: 'Ingrediente B', stock_actual: 200, stock_minimo: 100, unidad_medida: 'g', categoria: 'Test' },
        ],
      });

      useStore.getState().generarAlertas();

      const alertas = useStore.getState().alertas;
      expect(alertas).toHaveLength(1);
      expect(alertas[0].ingrediente_nombre).toBe('Ingrediente A');
    });

    it('debería marcar alertas críticas cuando stock es muy bajo', () => {
      useStore.setState({
        ingredientes: [
          { id: '1', nombre: 'Ingrediente Crítico', stock_actual: 10, stock_minimo: 100, unidad_medida: 'g', categoria: 'Test' },
        ],
      });

      useStore.getState().generarAlertas();

      const alertas = useStore.getState().alertas;
      expect(alertas[0].nivel).toBe('critical');
    });

    it('debería marcar alertas warning cuando stock es bajo pero no crítico', () => {
      useStore.setState({
        ingredientes: [
          { id: '1', nombre: 'Ingrediente Bajo', stock_actual: 80, stock_minimo: 100, unidad_medida: 'g', categoria: 'Test' },
        ],
      });

      useStore.getState().generarAlertas();

      const alertas = useStore.getState().alertas;
      expect(alertas[0].nivel).toBe('warning');
    });

    it('no debería generar alertas si todo está en stock', () => {
      useStore.setState({
        ingredientes: [
          { id: '1', nombre: 'Ingrediente OK', stock_actual: 500, stock_minimo: 100, unidad_medida: 'g', categoria: 'Test' },
        ],
      });

      useStore.getState().generarAlertas();

      const alertas = useStore.getState().alertas;
      expect(alertas).toHaveLength(0);
    });
  });

  describe('updateIngredienteStock', () => {
    it('debería aumentar el stock correctamente', () => {
      useStore.setState({
        ingredientes: [
          { id: '1', nombre: 'Test', stock_actual: 100, stock_minimo: 50, unidad_medida: 'g', categoria: 'Test' },
        ],
      });

      useStore.getState().updateIngredienteStock('1', 50);

      const ingredientes = useStore.getState().ingredientes;
      expect(ingredientes[0].stock_actual).toBe(150);
    });

    it('debería generar alertas después de actualizar stock', () => {
      useStore.setState({
        ingredientes: [
          { id: '1', nombre: 'Test', stock_actual: 100, stock_minimo: 50, unidad_medida: 'g', categoria: 'Test' },
        ],
      });

      useStore.getState().updateIngredienteStock('1', -80);

      const alertas = useStore.getState().alertas;
      expect(alertas).toHaveLength(1);
    });
  });

  describe('updatePedidoEstado', () => {
    it('debería actualizar el estado del pedido', () => {
      useStore.setState({
        pedidos: [
          {
            id: '1',
            mesa_id: 1,
            mesa_numero: 1,
            mesero_id: 'user-1',
            mesero_nombre: 'Test',
            items: [{ id: 'i1', plato_id: 'p1', plato_nombre: 'Test', cantidad: 1, notas: '', estado: 'pendiente' }],
            estado: 'pendiente',
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date(),
            total: 100,
            notas_generales: '',
          },
        ],
      });

      useStore.getState().updatePedidoEstado('1', 'preparando');

      const pedidos = useStore.getState().pedidos;
      expect(pedidos[0].estado).toBe('preparando');
    });
  });
});
