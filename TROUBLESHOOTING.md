# 🔧 Guía Completa de Troubleshooting - Sistema POS

## Problema: No puedo iniciar sesión

### Causas Principales y Soluciones

---

## 1️⃣ Discrepancia entre Nombre y Propiedad de Búsqueda

### Problema
El sistema busca usuarios por `nombre` (ej: "Carlos Admin"), pero puede haber inconsistencias si:
- Se escribió "Carlos admin" (minúscula)
- Hay espacios extra al inicio o final
- El localStorage tiene datos viejos con estructura diferente

### Solución Implementada
✅ **Comparación normalizada**: El sistema ahora convierte ambos valores a minúsculas y elimina espacios:

```typescript
const normalizedUsername = username.trim().toLowerCase();
const user = state.usuarios.find(u => 
  u.nombre.trim().toLowerCase() === normalizedUsername && u.activo
);
```

### Cómo Verificar
Abre la consola del navegador (F12) y verifica los logs:
```
=== INICIO DE SESIÓN ===
Username recibido: Carlos Admin
Usuarios disponibles: [
  { nombre: 'Carlos Admin', activo: true, tieneHash: true },
  ...
]
✅ Usuario encontrado: Carlos Admin
```

---

## 2️⃣ Sensibilidad a Mayúsculas/Minúsculas en Contraseñas

### Problema
Las contraseñas deben coincidir exactamente:
- `Admin1` ✅ (correcto)
- `admin1` ❌ (incorrecto - falta mayúscula)
- `ADMIN1` ❌ (incorrecto - todo mayúsculas)

### Contraseñas Correctas
| Usuario | Contraseña Exacta |
|---------|------------------|
| Carlos Admin | `Admin1` |
| María Mesero | `Mesero1` |
| Chef Roberto | `Cocina1` |
| Ana López | `Mesero1` |

### Requisitos de Contraseña
- Mínimo 6 caracteres
- Al menos 1 letra mayúscula
- Al menos 1 número

### Cómo Verificar
En la consola del navegador:
```
🔐 Verificando contraseña con bcrypt...
✅ Contraseña correcta. Iniciando sesión...
```

Si ves:
```
❌ Contraseña incorrecta para: Carlos Admin
```
Significa que la contraseña no coincide exactamente.

---

## 3️⃣ Incompatibilidad de Roles en Rutas Protegidas

### Problema
Si el login es exitoso pero el sistema te redirige de vuelta a `/login`, puede ser por:
- Roles en mayúsculas: `'Admin'` vs `'admin'`
- Roles en inglés: `'manager'` vs `'admin'`

### Solución Implementada
✅ **Roles consistentes en minúsculas**:
- `admin` (Administrador)
- `mesero` (Mesero)
- `cocina` (Cocina)

### Cómo Verificar
En la consola del navegador:
```
=== PROTECTED ROUTE ===
isLoading: false
currentUser: Carlos Admin
currentUser.rol: admin
allowedRoles: ['admin', 'mesero', 'cocina']
✅ Acceso permitido
```

Si ves:
```
❌ Rol no permitido: Admin
Roles permitidos: ['admin', 'mesero', 'cocina']
```
Significa que hay un problema con el rol (está en mayúsculas).

---

## 4️⃣ Recarga de Página por el Formulario

### Problema
Si el formulario no tiene `e.preventDefault()`, el navegador recarga la página al enviar, perdiendo el estado de autenticación.

### Solución Implementada
✅ **e.preventDefault() en handleSubmit**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // ← Evita recarga de página
  // ... resto del código
};
```

### Cómo Verificar
En la consola del navegador:
```
=== FORMULARIO ENVIADO ===
Username: Carlos Admin
Password length: 6
e.preventDefault() ejecutado - no habrá recarga de página
```

---

## 5️⃣ Datos Antiguos en localStorage

### Problema
Si probaste versiones anteriores del código, puedes tener datos viejos que:
- No tienen `passwordHash` (contraseñas en texto plano)
- Tienen IDs numéricos en lugar de UUID
- Tienen estructura incompatible

### Solución Implementada
✅ **Migración automática**: El sistema detecta datos viejos y los recrea:
```typescript
const needsMigration = state.usuarios.length === 0 || 
  state.usuarios.some(u => !u.passwordHash || u.passwordHash === '');

if (needsMigration) {
  const defaultUsers = await createDefaultUsers();
  set({ usuarios: defaultUsers });
}
```

### Cómo Verificar
En la consola del navegador:
```
=== INICIALIZANDO STORE ===
Usuarios en localStorage: 4
¿Necesita migración? false
✅ Usuarios existentes válidos
```

Si ves:
```
¿Necesita migración? true
🔄 Creando usuarios por defecto con contraseñas hasheadas...
✅ Usuarios creados: 4
```
Significa que los datos viejos fueron reemplazados.

### Solución Manual
Si la migración automática no funciona:

**Opción 1: Botón de Reset**
1. Ve a la pantalla de login
2. Haz clic en "🔄 Resetear Datos"
3. Confirma la acción
4. La página se recargará con datos nuevos

**Opción 2: Limpiar localStorage manualmente**
```javascript
// En la consola del navegador (F12)
localStorage.removeItem('restaurante-pos-storage');
location.reload();
```

**Opción 3: Limpiar todo el almacenamiento**
1. F12 → Application → Local Storage
2. Clic derecho en la URL de tu app
3. Selecciona "Clear" o "Limpiar"
4. Recarga la página (F5)

---

## 📋 Checklist de Diagnóstico

### Paso 1: Abrir la Consola del Navegador
- Presiona **F12**
- Ve a la pestaña **Console**

### Paso 2: Intentar Iniciar Sesión
- Escribe el usuario y contraseña
- Haz clic en "Ingresar"
- Observa los logs en la consola

### Paso 3: Verificar los Logs

#### ✅ Login Exitoso
```
=== FORMULARIO ENVIADO ===
Username: Carlos Admin
Password length: 6
e.preventDefault() ejecutado - no habrá recarga de página
Llamando a login()...
=== INICIO DE SESIÓN ===
Username recibido: Carlos Admin
Usuarios disponibles: [...]
✅ Usuario encontrado: Carlos Admin
🔐 Verificando contraseña con bcrypt...
✅ Contraseña correcta. Iniciando sesión...
✅ Login exitoso. Usuario actual: Carlos Admin
Resultado de login(): true
✅ Login exitoso, el sistema debería redirigir automáticamente
=== PROTECTED ROUTE ===
isLoading: false
currentUser: Carlos Admin
currentUser.rol: admin
allowedRoles: ['admin', 'mesero', 'cocina']
✅ Acceso permitido
```

#### ❌ Login Fallido - Usuario no encontrado
```
=== INICIO DE SESIÓN ===
Username recibido: Carlos Admin
Usuarios disponibles: []
❌ Usuario no encontrado o inactivo: Carlos Admin
```
**Solución**: Usa el botón "Resetear Datos" o limpia localStorage.

#### ❌ Login Fallido - Contraseña incorrecta
```
=== INICIO DE SESIÓN ===
✅ Usuario encontrado: Carlos Admin
🔐 Verificando contraseña con bcrypt...
❌ Contraseña incorrecta para: Carlos Admin
```
**Solución**: Verifica que la contraseña sea exactamente `Admin1` (con mayúscula).

#### ❌ Login Fallido - Sin passwordHash
```
=== INICIO DE SESIÓN ===
✅ Usuario encontrado: Carlos Admin
❌ Usuario sin passwordHash: Carlos Admin
Esto indica que los datos están corruptos. Usa el botón de reset.
```
**Solución**: Usa el botón "Resetear Datos".

#### ❌ Login Fallido - Rol no permitido
```
=== PROTECTED ROUTE ===
currentUser: Carlos Admin
currentUser.rol: Admin
allowedRoles: ['admin', 'mesero', 'cocina']
❌ Rol no permitido: Admin
```
**Solución**: Usa el botón "Resetear Datos" para recrear usuarios con roles correctos.

---

## 🚀 Solución Rápida (Recomendada)

Si tienes cualquier problema, sigue estos pasos:

1. **Abre la pantalla de login**
2. **Haz clic en "🔄 Resetear Datos"**
3. **Confirma la acción**
4. **Espera a que la página se recargue**
5. **Ingresa con las credenciales**:
   - Usuario: `Carlos Admin`
   - Contraseña: `Admin1`

---

## 🔍 Diagnóstico Avanzado

### Verificar estado del store
```javascript
// En la consola del navegador
const state = JSON.parse(localStorage.getItem('restaurante-pos-storage'));
console.log('Estado completo:', state);
console.log('Usuarios:', state?.state?.usuarios);
console.log('Tiene passwordHash:', state?.state?.usuarios?.[0]?.passwordHash ? 'Sí' : 'No');
```

### Forzar reset completo
```javascript
// En la consola del navegador
localStorage.clear();
location.reload();
```

### Verificar que initialize() se ejecutó
```javascript
// En la consola del navegador
const state = JSON.parse(localStorage.getItem('restaurante-pos-storage'));
console.log('Usuarios:', state?.state?.usuarios?.length);
console.log('Primer usuario:', state?.state?.usuarios?.[0]);
```

---

## 📞 Soporte

Si después de seguir todos los pasos el problema persiste:

1. **Toma una captura de pantalla** de la consola del navegador (F12 → Console)
2. **Copia todos los logs** que aparecen al intentar iniciar sesión
3. **Verifica el navegador**: Usa Chrome, Firefox o Edge recientes
4. **Prueba en modo incógnito**: Para descartar problemas de caché
5. **Verifica JavaScript**: Asegúrate de que esté habilitado

---

## 📝 Resumen de Cambios Implementados

✅ **Comparación normalizada**: Case-insensitive y trim de espacios  
✅ **Logs detallados**: Para debuggear cada paso del proceso  
✅ **Migración automática**: Detecta y reemplaza datos viejos  
✅ **e.preventDefault()**: Evita recarga de página  
✅ **Roles consistentes**: Todos en minúsculas  
✅ **Contraseñas hasheadas**: Con bcrypt para seguridad  
✅ **Botón de reset**: Para limpiar datos corruptos  
✅ **Manejo de errores**: Try-catch en todas las operaciones async  

---

**Última actualización**: 2026  
**Versión del sistema**: 2.0.0  
**Estado**: ✅ Todos los problemas conocidos resueltos
