# Mejoras en Flujo de Cobro y Liberación de Mesas

## Resumen de Cambios

Se implementaron mejoras críticas en el flujo de cobro y liberación de mesas para centralizar la lógica y prevenir inconsistencias en el estado del sistema.

## Problemas Resueltos

### 1. Mesas Bloqueadas Después de Cobrar
**Problema:** Cuando se cobraba un pedido desde diferentes pantallas (Mesas, Pedidos), la mesa no se liberaba automáticamente, quedando bloqueada en estado "ocupada".

**Solución:** Centralizar la lógica de liberación de mesa en el store. Ahora cuando un pedido se marca como "pagado", el store automáticamente libera la mesa asociada.

### 2. Botón "Cobrar" Restringido
**Problema:** El botón "Cobrar" solo aparecía cuando el pedido estaba en estado "servido", limitando la flexibilidad del flujo de trabajo.

**Solución:** El botón "Cobrar" ahora está disponible en múltiples estados (preparando, listo, servido), permitiendo cobrar en cualquier momento del flujo.

### 3. Pedidos "Fantasma" al Liberar Mesa
**Problema:** Cuando un administrador liberaba manualmente una mesa, el pedido asociado quedaba en estado activo, creando pedidos "fantasma" en el sistema.

**Solución:** Al liberar una mesa manualmente, ahora se cancela automáticamente el pedido activo asociado, manteniendo la consistencia del sistema.

## Cambios Técnicos

### 1. Store (`src/store/useStore.ts`)

#### Función `updatePedidoEstado`
```typescript
if (estado === 'pagado' && pedido) {
  get().descontarInventario(pedidoId);
  get().setUltimaFactura(pedido);
  get().registrarVentaAutomatica(pedido);

  // NUEVO: Liberar automáticamente la mesa asociada
  set(state => ({
    mesas: state.mesas.map(m =>
      m.id === pedido.mesa_id ? { ...m, estado: 'libre' as const } : m
    ),
  }));
}
```

**Beneficios:**
- Centraliza la lógica de liberación
- Previene mesas bloqueadas
- No depende de que cada pantalla recuerde liberar la mesa
- Más seguro y mantenible

### 2. Página de Mesas (`src/pages/Tables.tsx`)

#### Botón "Cobrar" Siempre Visible
```typescript
// ANTES: Solo visible cuando estado === 'servido'
{pedido.estado === 'servido' && (
  <button onClick={() => handleCobrarYLiberar(mesa.id)}>
    Cobrar
  </button>
)}

// AHORA: Siempre visible cuando hay pedido activo
<button onClick={() => handleCobrarYLiberar(mesa.id)}>
  Cobrar
</button>
```

#### Función `handleLiberarMesa` Mejorada
```typescript
const handleLiberarMesa = (mesaId: number) => {
  const pedido = getMesaPedido(mesaId);
  const mensaje = pedido 
    ? '¿Está seguro de liberar esta mesa? El pedido activo será cancelado.'
    : '¿Está seguro de liberar esta mesa?';
  
  if (confirm(mensaje)) {
    // Cancelar pedido activo si existe
    if (pedido) {
      updatePedidoEstado(pedido.id, 'cancelado');
    }
    // Liberar la mesa
    updateMesaEstado(mesaId, 'libre');
  }
};
```

**Beneficios:**
- Previene pedidos "fantasma"
- Mensaje de confirmación más claro
- Mantiene consistencia del sistema

#### Función `handleCobrarYLiberar` Simplificada
```typescript
const handleCobrarYLiberar = (mesaId: number) => {
  const pedido = getMesaPedido(mesaId);
  if (!pedido) return;
  
  if (confirm(`¿Cobrar ${formatoEcuador.moneda(pedido.total)} y liberar la mesa?`)) {
    // El store ya se encarga de liberar la mesa automáticamente
    updatePedidoEstado(pedido.id, 'pagado');
  }
};
```

**Beneficios:**
- Código más simple
- No necesita llamar a `updateMesaEstado` manualmente
- El store maneja toda la lógica

### 3. Página de Pedidos (`src/pages/Orders.tsx`)

#### Botón "Cobrar / Pagado" en Múltiples Estados
```typescript
// ANTES: Solo en estado 'servido'
{pedido.estado === 'servido' && (
  <button onClick={() => handleUpdateEstado(pedido.id, 'pagado')}>
    Cobrar / Pagado
  </button>
)}

// AHORA: En estados 'servido', 'listo' y 'preparando'
{(pedido.estado === 'servido' || pedido.estado === 'listo' || pedido.estado === 'preparando') && (
  <button onClick={() => handleUpdateEstado(pedido.id, 'pagado')}>
    Cobrar / Pagado
  </button>
)}
```

**Beneficios:**
- Mayor flexibilidad en el flujo de trabajo
- Permite cobrar antes de que el pedido esté completamente servido
- Útil para casos especiales (clientes que se van antes, etc.)

## Flujos de Trabajo Mejorados

### Flujo 1: Cobro Normal desde Mesas
1. Mesa ocupada con pedido activo
2. Usuario hace clic en "Cobrar" (disponible en cualquier estado)
3. Confirmación de cobro
4. Store marca pedido como "pagado"
5. Store automáticamente libera la mesa
6. Mesa queda disponible para nuevo pedido

### Flujo 2: Cobro desde Pedidos
1. Usuario ve lista de pedidos
2. Hace clic en "Cobrar / Pagado" (disponible en preparando, listo o servido)
3. Store marca pedido como "pagado"
4. Store automáticamente libera la mesa asociada
5. Mesa queda disponible

### Flujo 3: Liberación Manual por Admin
1. Admin ve mesa ocupada
2. Hace clic en "Liberar"
3. Sistema detecta pedido activo
4. Muestra mensaje: "¿Está seguro de liberar esta mesa? El pedido activo será cancelado."
5. Si confirma:
   - Pedido se marca como "cancelado"
   - Mesa se libera
6. Sistema mantiene consistencia

## Ventajas de la Solución

### 1. Centralización de Lógica
- Toda la lógica de liberación de mesa está en el store
- No hay duplicación de código
- Más fácil de mantener y debuggear

### 2. Prevención de Errores
- No es posible olvidar liberar una mesa
- No se crean pedidos "fantasma"
- Estado del sistema siempre consistente

### 3. Flexibilidad
- Se puede cobrar en cualquier momento del flujo
- Admin puede liberar mesas manualmente cuando sea necesario
- Flujo de trabajo adaptable a diferentes situaciones

### 4. Mantenibilidad
- Código más simple y claro
- Menos dependencias entre componentes
- Fácil de extender en el futuro

## Casos de Uso

### Caso 1: Cliente se va antes de tiempo
- Pedido en estado "preparando" o "listo"
- Mesero puede cobrar directamente desde Mesas o Pedidos
- Mesa se libera automáticamente
- No necesita esperar a que cocina marque como "servido"

### Caso 2: Error en pedido
- Admin necesita liberar mesa urgentemente
- Hace clic en "Liberar"
- Sistema cancela pedido automáticamente
- Mesa queda disponible
- No quedan pedidos "fantasma"

### Caso 3: Cobro rápido
- Mesa ocupada, pedido en cualquier estado
- Mesero hace clic en "Cobrar"
- Confirmación y cobro inmediato
- Mesa liberada automáticamente
- Flujo rápido y eficiente

## Testing Recomendado

### Pruebas Unitarias
1. Verificar que `updatePedidoEstado` con estado "pagado" libera la mesa
2. Verificar que `handleLiberarMesa` cancela el pedido activo
3. Verificar que el botón "Cobrar" aparece en los estados correctos

### Pruebas de Integración
1. Cobrar desde página de Mesas → verificar liberación automática
2. Cobrar desde página de Pedidos → verificar liberación automática
3. Liberar manualmente → verificar cancelación de pedido
4. Verificar que no quedan mesas bloqueadas después de múltiples operaciones

### Pruebas de Usuario
1. Flujo completo: tomar pedido → cocina → cobrar → mesa libre
2. Flujo alternativo: tomar pedido → cobrar antes → mesa libre
3. Flujo admin: liberar mesa con pedido activo → verificar cancelación

## Conclusión

Estas mejoras centralizan la lógica de negocio, previenen errores comunes y proporcionan mayor flexibilidad en el flujo de trabajo. El sistema ahora es más robusto, mantenible y adaptable a diferentes situaciones del mundo real.
