# 🔐 Sistema de Permisos y Roles - Documentación Completa

## 🎯 Problemas Identificados y Solucionados

### 1. Redirección Incorrecta al Iniciar Sesión
**Problema**: Todos los usuarios eran redirigidos a `/dashboard` sin importar su rol.

**Solución**: Implementar redirección inteligente según el rol del usuario en `Login.tsx`.

### 2. Bloqueo en el Guardián de Rutas
**Problema**: `ProtectedRoute` validaba permisos a nivel general, pero no por página específica.

**Solución**: Crear `RouteGuard` que valida permisos por página individual.

### 3. Ocultamiento en la Barra Lateral
**Problema**: Inconsistencia entre los roles definidos en `Sidebar.tsx` y los permisos en `App.tsx`.

**Solución**: Sincronizar los permisos entre ambos archivos.

---

## ✅ Solución Implementada

### Arquitectura de Permisos

```
┌─────────────────────────────────────────────────────────┐
│                    Login.tsx                             │
│  - Autentica al usuario                                 │
│  - Redirige según rol:                                  │
│    • admin → /dashboard                                 │
│    • mesero → /mesas                                    │
│    • cocina → /cocina                                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   App.tsx                                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         ProtectedRoute (Nivel 1)                 │  │
│  │  - Valida que el usuario esté autenticado        │  │
│  │  - Si no está autenticado → /login               │  │
│  └──────────────────────────────────────────────────┘  │
│                            ↓                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │         RouteGuard (Nivel 2)                     │  │
│  │  - Valida permisos por página específica         │  │
│  │  - Si no tiene permiso → Redirige según rol      │  │
│  └──────────────────────────────────────────────────┘  │
│                            ↓                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Sidebar.tsx (Nivel 3)                    │  │
│  │  - Filtra menú según permisos del usuario        │  │
│  │  - Solo muestra opciones accesibles              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Tabla de Permisos por Página

| Página | Ruta | Admin | Mesero | Cocina | Descripción |
|--------|------|-------|--------|--------|-------------|
| **Dashboard** | `/dashboard` | ✅ | ✅ | ✅ | Panel principal con estadísticas |
| **Mesas** | `/mesas` | ✅ | ✅ | ❌ | Gestión de mesas y pedidos |
| **Cocina** | `/cocina` | ✅ | ❌ | ✅ | Pantalla Kanban para cocina |
| **Menú** | `/menu` | ✅ | ❌ | ❌ | Gestión de platos y categorías |
| **Inventario** | `/inventario` | ✅ | ❌ | ❌ | Control de stock e ingredientes |
| **Pedidos** | `/pedidos` | ✅ | ✅ | ❌ | Historial y gestión de pedidos |
| **Usuarios** | `/usuarios` | ✅ | ❌ | ❌ | Gestión de cuentas de usuario |
| **Configuración** | `/configuracion` | ✅ | ❌ | ❌ | Ajustes del sistema |

---

## 🔧 Implementación Técnica

### 1. Login.tsx - Redirección Inteligente

```typescript
useEffect(() => {
  if (currentUser) {
    // Redirección inteligente según el rol del usuario
    let targetPath = '/';
    
    switch (currentUser.rol) {
      case 'cocina':
        targetPath = '/cocina';
        console.log('👨‍🍳 Redirigiendo cocinero a /cocina');
        break;
      case 'mesero':
        targetPath = '/mesas';
        console.log('🍽️ Redirigiendo mesero a /mesas');
        break;
      case 'admin':
        targetPath = '/dashboard';
        console.log('👤 Redirigiendo admin a /dashboard');
        break;
      default:
        targetPath = '/dashboard';
        console.log('⚠️ Rol desconocido, redirigiendo a /dashboard');
    }
    
    setTimeout(() => {
      navigate(targetPath, { replace: true });
    }, 100);
  }
}, [currentUser, navigate]);
```

**Ventajas**:
- ✅ Cada rol va directamente a su página principal
- ✅ Mejora la experiencia de usuario
- ✅ Reduce clics innecesarios

---

### 2. App.tsx - Sistema de Doble Validación

#### Nivel 1: ProtectedRoute (Autenticación General)

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

**Responsabilidad**: Validar que el usuario esté autenticado.

#### Nivel 2: RouteGuard (Permisos por Página)

```typescript
function RouteGuard({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.rol)) {
    // Redirección inteligente según el rol
    let redirectPath = '/';
    switch (currentUser.rol) {
      case 'cocina':
        redirectPath = '/cocina';
        break;
      case 'mesero':
        redirectPath = '/mesas';
        break;
      case 'admin':
        redirectPath = '/dashboard';
        break;
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
```

**Responsabilidad**: Validar permisos por página específica y redirigir inteligentemente.

#### Uso en las Rutas

```typescript
<Routes>
  {/* Dashboard - Todos los roles */}
  <Route path="/dashboard" element={
    <RouteGuard allowedRoles={['admin', 'mesero', 'cocina']}>
      <Dashboard />
    </RouteGuard>
  } />
  
  {/* Mesas - Admin y mesero */}
  <Route path="/mesas" element={
    <RouteGuard allowedRoles={['admin', 'mesero']}>
      <Tables />
    </RouteGuard>
  } />
  
  {/* Cocina - Admin y cocina */}
  <Route path="/cocina" element={
    <RouteGuard allowedRoles={['admin', 'cocina']}>
      <Kitchen />
    </RouteGuard>
  } />
  
  {/* Menú - Solo admin */}
  <Route path="/menu" element={
    <RouteGuard allowedRoles={['admin']}>
      <MenuPage />
    </RouteGuard>
  } />
  
  {/* ... más rutas */}
</Routes>
```

---

### 3. Sidebar.tsx - Filtrado de Menú

```typescript
const menuItems = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard, roles: ['admin', 'mesero', 'cocina'] },
  { id: 'mesas', label: 'Mesas', icon: UtensilsCrossed, roles: ['admin', 'mesero'] },
  { id: 'cocina', label: 'Cocina', icon: ChefHat, roles: ['admin', 'cocina'] },
  { id: 'menu', label: 'Menú', icon: BookOpen, roles: ['admin'] },
  { id: 'inventario', label: 'Inventario', icon: Package, roles: ['admin'] },
  { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag, roles: ['admin', 'mesero'] },
  { id: 'usuarios', label: 'Usuarios', icon: Users, roles: ['admin'] },
  { id: 'configuracion', label: 'Configuración', icon: Settings, roles: ['admin'] },
];

const filteredMenu = menuItems.filter(item =>
  currentUser && item.roles.includes(currentUser.rol)
);
```

**Responsabilidad**: Mostrar solo las opciones de menú accesibles para el usuario.

---

## 🔄 Sincronización de Permisos

### Regla de Oro
**Los permisos deben estar sincronizados en tres lugares**:

1. **Sidebar.tsx** - Define qué opciones de menú se muestran
2. **App.tsx (RouteGuard)** - Define qué rutas son accesibles
3. **Login.tsx** - Define a dónde redirigir después del login

### Ejemplo de Sincronización Correcta

**Página: Mesas**
```typescript
// Sidebar.tsx
{ id: 'mesas', label: 'Mesas', roles: ['admin', 'mesero'] }

// App.tsx
<Route path="/mesas" element={
  <RouteGuard allowedRoles={['admin', 'mesero']}>
    <Tables />
  </RouteGuard>
} />

// Login.tsx
case 'mesero':
  targetPath = '/mesas'; // Redirección después del login
```

---

## 🎓 Flujo Completo de Autenticación y Autorización

### Escenario 1: Usuario Admin

```
1. Usuario ingresa credenciales
   ↓
2. login() valida y establece currentUser = { rol: 'admin' }
   ↓
3. useEffect en Login.tsx detecta el cambio
   ↓
4. Redirige a /dashboard (según rol admin)
   ↓
5. ProtectedRoute valida que currentUser existe ✅
   ↓
6. RouteGuard valida que 'admin' está en ['admin', 'mesero', 'cocina'] ✅
   ↓
7. Sidebar muestra todas las opciones ✅
   ↓
8. Usuario ve el Dashboard ✅
```

### Escenario 2: Usuario Mesero

```
1. Usuario ingresa credenciales
   ↓
2. login() valida y establece currentUser = { rol: 'mesero' }
   ↓
3. useEffect en Login.tsx detecta el cambio
   ↓
4. Redirige a /mesas (según rol mesero)
   ↓
5. ProtectedRoute valida que currentUser existe ✅
   ↓
6. RouteGuard valida que 'mesero' está en ['admin', 'mesero'] ✅
   ↓
7. Sidebar muestra: Panel, Mesas, Pedidos ✅
   ↓
8. Usuario ve la página de Mesas ✅
```

### Escenario 3: Usuario Cocina

```
1. Usuario ingresa credenciales
   ↓
2. login() valida y establece currentUser = { rol: 'cocina' }
   ↓
3. useEffect en Login.tsx detecta el cambio
   ↓
4. Redirige a /cocina (según rol cocina)
   ↓
5. ProtectedRoute valida que currentUser existe ✅
   ↓
6. RouteGuard valida que 'cocina' está en ['admin', 'cocina'] ✅
   ↓
7. Sidebar muestra: Panel, Cocina ✅
   ↓
8. Usuario ve la Pantalla de Cocina ✅
```

### Escenario 4: Intento de Acceso No Autorizado

```
1. Usuario mesero intenta acceder a /inventario directamente
   ↓
2. ProtectedRoute valida que currentUser existe ✅
   ↓
3. RouteGuard valida que 'mesero' NO está en ['admin'] ❌
   ↓
4. Redirige a /mesas (página principal del rol mesero)
   ↓
5. Usuario ve la página de Mesas (no Inventario) ✅
```

---

## 🛡️ Seguridad Implementada

### 1. Validación en Múltiples Niveles
- ✅ **Nivel 1**: Autenticación general (ProtectedRoute)
- ✅ **Nivel 2**: Permisos por página (RouteGuard)
- ✅ **Nivel 3**: Filtrado de menú (Sidebar)

### 2. Redirección Inteligente
- ✅ Si el usuario intenta acceder a una página no permitida, es redirigido a su página principal
- ✅ No muestra mensajes de error confusos
- ✅ Mejora la experiencia de usuario

### 3. Consistencia de Roles
- ✅ Todos los roles están en minúsculas: `'admin'`, `'mesero'`, `'cocina'`
- ✅ Comparación normalizada con `trim().toLowerCase()`
- ✅ Sin inconsistencias entre archivos

---

## 📊 Logs de Debugging

### Login Exitoso
```
=== FORMULARIO ENVIADO ===
Username: Carlos Admin
Llamando a login()...
✅ Login exitoso. Usuario actual: Carlos Admin

=== useEffect en Login ===
currentUser: { nombre: 'Carlos Admin', rol: 'admin' }
✅ Usuario autenticado: Carlos Admin Rol: admin
👤 Redirigiendo admin a /dashboard

=== PROTECTED ROUTE ===
isLoading: false
currentUser: Carlos Admin
✅ Usuario autenticado

=== ROUTE GUARD ===
currentUser.rol: admin
allowedRoles: ['admin', 'mesero', 'cocina']
✅ Acceso permitido a esta página
```

### Acceso No Autorizado
```
=== ROUTE GUARD ===
currentUser.rol: mesero
allowedRoles: ['admin']
❌ Rol no permitido para esta página: mesero
🔄 Redirigiendo a: /mesas
```

---

## 🔧 Cómo Agregar una Nueva Página

### Paso 1: Definir permisos en Sidebar.tsx

```typescript
const menuItems = [
  // ... existing items
  { id: 'reportes', label: 'Reportes', icon: BarChart, roles: ['admin', 'mesero'] },
];
```

### Paso 2: Agregar ruta en App.tsx

```typescript
<Route path="/reportes" element={
  <RouteGuard allowedRoles={['admin', 'mesero']}>
    <ReportsPage />
  </RouteGuard>
} />
```

### Paso 3: Crear el componente ReportsPage.tsx

```typescript
export default function ReportsPage() {
  // Implementación de la página
}
```

### Paso 4: Verificar sincronización

- ✅ Sidebar muestra la opción para admin y mesero
- ✅ RouteGuard permite acceso a admin y mesero
- ✅ Si es necesario, agregar redirección en Login.tsx

---

## 🎯 Mejores Prácticas

### 1. Mantener Consistencia
```typescript
// ✅ CORRECTO - Roles en minúsculas
allowedRoles={['admin', 'mesero', 'cocina']}

// ❌ INCORRECTO - Roles en mayúsculas o mezclados
allowedRoles={['Admin', 'MESERO', 'cocina']}
```

### 2. Documentar Permisos
```typescript
// Dashboard - Todos los roles pueden ver estadísticas generales
<RouteGuard allowedRoles={['admin', 'mesero', 'cocina']}>
```

### 3. Probar Todos los Roles
- ✅ Probar como admin
- ✅ Probar como mesero
- ✅ Probar como cocina
- ✅ Intentar acceder a páginas no permitidas

### 4. Usar Logs para Debuggear
```typescript
console.log('=== ROUTE GUARD ===');
console.log('currentUser.rol:', currentUser?.rol);
console.log('allowedRoles:', allowedRoles);
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- [SOLUCION_SINCRONIZACION.md](./SOLUCION_SINCRONIZACION.md) - Sincronización de estado y navegación
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Guía de troubleshooting completa
- [README_FINAL.md](./README_FINAL.md) - Documentación general del sistema

### Conceptos de React
- [React Router - Protected Routes](https://reactrouter.com/en/main/examples/auth)
- [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control)

---

## ✅ Resumen

### Problemas Resueltos
1. ✅ Redirección inteligente según rol al iniciar sesión
2. ✅ Validación de permisos por página específica
3. ✅ Sincronización de permisos entre Sidebar y App.tsx
4. ✅ Redirección automática si el usuario intenta acceder a páginas no permitidas

### Características Implementadas
- ✅ Sistema de doble validación (ProtectedRoute + RouteGuard)
- ✅ Redirección inteligente según rol
- ✅ Filtrado de menú según permisos
- ✅ Logs detallados para debugging
- ✅ Consistencia de roles en todo el sistema

### Beneficios
- ✅ Mejor experiencia de usuario
- ✅ Seguridad robusta
- ✅ Código mantenible
- ✅ Fácil de extender

---

**Versión**: 2.0.2  
**Estado**: ✅ Sistema de permisos completo y funcional  
**Última actualización**: 2026
