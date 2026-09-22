# 🔧 Solución de Problemas de Login

## Problema: "Verificando..." y no ingresa al sistema

### Causa
El sistema tiene datos antiguos en el localStorage del navegador que no son compatibles con la nueva versión que usa contraseñas encriptadas con bcrypt.

### Solución Rápida

#### Opción 1: Usar el botón de reset (Recomendado)
1. Ve a la pantalla de login
2. Busca el botón **"🔄 Resetear Datos (si no puedes entrar)"** al final de la página
3. Haz clic y confirma la acción
4. La página se recargará automáticamente
5. Ahora podrás ingresar con las credenciales por defecto

#### Opción 2: Limpiar localStorage manualmente
1. Abre las herramientas de desarrollador del navegador (F12)
2. Ve a la pestaña **Application** (Chrome) o **Storage** (Firefox)
3. En el panel izquierdo, expande **Local Storage**
4. Haz clic en la URL de tu aplicación
5. Busca la clave `restaurante-pos-storage`
6. Haz clic derecho y selecciona **Delete** o **Eliminar**
7. Recarga la página (F5)

#### Opción 3: Limpiar todo el almacenamiento
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Application** (Chrome) o **Storage** (Firefox)
3. En el panel izquierdo, haz clic derecho en **Local Storage**
4. Selecciona **Clear** o **Limpiar**
5. Recarga la página (F5)

---

## Credenciales por Defecto

Después de resetear, usa estas credenciales:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| **Carlos Admin** | `Admin1` | Administrador |
| **María Mesero** | `Mesero1` | Mesero |
| **Chef Roberto** | `Cocina1` | Cocina |
| **Ana López** | `Mesero1` | Mesero |

### Requisitos de Contraseña
- Mínimo 6 caracteres
- Al menos 1 letra mayúscula
- Al menos 1 número

---

## Verificación en Consola

Si el problema persiste, abre la consola del navegador (F12 → Console) y verifica:

1. **¿Aparecen errores en rojo?**
   - Copia el mensaje de error completo
   - Esto ayudará a diagnosticar el problema

2. **¿El estado de carga se queda en "Cargando sistema..."?**
   - Esto indica que la inicialización falló
   - Usa la Opción 2 o 3 de arriba

3. **¿Puedes ver los usuarios en localStorage?**
   - Ve a Application → Local Storage
   - Busca `restaurante-pos-storage`
   - Verifica que los usuarios tengan `passwordHash` (no `password`)

---

## Diagnóstico Avanzado

Si necesitas más información, ejecuta esto en la consola del navegador:

```javascript
// Ver estado del store
const state = JSON.parse(localStorage.getItem('restaurante-pos-storage'));
console.log('Usuarios:', state?.state?.usuarios);
console.log('Tiene passwordHash:', state?.state?.usuarios?.[0]?.passwordHash ? 'Sí' : 'No');

// Forzar reset
localStorage.removeItem('restaurante-pos-storage');
location.reload();
```

---

## ¿Por qué pasa esto?

El sistema fue actualizado para usar contraseñas encriptadas con bcrypt por seguridad. Los usuarios antiguos tenían contraseñas en texto plano, lo cual no es compatible con el nuevo sistema de autenticación.

El botón de reset:
1. Elimina todos los datos antiguos
2. Crea nuevos usuarios con contraseñas encriptadas
3. Restablece el inventario, menú y pedidos a los valores por defecto

---

## Soporte

Si después de intentar todas las opciones el problema persiste:

1. Toma una captura de pantalla de la consola del navegador (F12 → Console)
2. Verifica que el navegador sea compatible (Chrome, Firefox, Edge recientes)
3. Intenta en modo incógnito para descartar problemas de caché
4. Verifica que JavaScript esté habilitado en el navegador

---

**Última actualización**: 2026
**Versión del sistema**: 2.0.0
