import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useTema } from './hooks/useTema';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Kitchen from './pages/Kitchen';
import Inventory from './pages/Inventory';
import Tables from './pages/Tables';
import Orders from './pages/Orders';
import ConfigPage from './pages/ConfigPage';
import UsersPage from './pages/UsersPage';
import MenuPage from './pages/MenuPage';
import Sidebar from './components/Sidebar';
import FacturaModal from './components/FacturaModal';

// Protected Route Component - Valida autenticación general
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useStore();
  const location = useLocation();

  console.log('=== PROTECTED ROUTE ===');
  console.log('isLoading:', isLoading);
  console.log('currentUser:', currentUser ? currentUser.nombre : 'null');

  if (isLoading) {
    console.log('⏳ Mostrando pantalla de carga...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Cargando sistema...</div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('❌ No hay usuario, redirigiendo a /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ Usuario autenticado');
  return <>{children}</>;
}

// Route Guard - Valida permisos por página específica
function RouteGuard({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  console.log('=== ROUTE GUARD ===');
  console.log('currentUser.rol:', currentUser?.rol);
  console.log('allowedRoles:', allowedRoles);

  if (!currentUser) {
    console.log('❌ No hay usuario');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.rol)) {
    console.log('❌ Rol no permitido para esta página:', currentUser.rol);
    
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
    
    console.log('🔄 Redirigiendo a:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('✅ Acceso permitido a esta página');
  return <>{children}</>;
}

// Layout with Sidebar
function AppLayout() {
  const { currentUser } = useStore();
  const { tema } = useTema();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = tema === 'dark';

  // Sync currentPage with URL
  useEffect(() => {
    const path = location.pathname.slice(1) || 'dashboard';
    setCurrentPage(path);
  }, [location]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  if (!currentUser) return null;

  // Kitchen gets a special full-screen layout
  if (currentPage === 'cocina' && currentUser.rol === 'cocina') {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Kitchen />
        <FacturaModal />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Routes>
          {/* Dashboard - Todos los roles */}
          <Route path="/" element={
            <RouteGuard allowedRoles={['admin', 'mesero', 'cocina']}>
              <Dashboard />
            </RouteGuard>
          } />
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
          
          {/* Inventario - Solo admin */}
          <Route path="/inventario" element={
            <RouteGuard allowedRoles={['admin']}>
              <Inventory />
            </RouteGuard>
          } />
          
          {/* Pedidos - Admin y mesero */}
          <Route path="/pedidos" element={
            <RouteGuard allowedRoles={['admin', 'mesero']}>
              <Orders />
            </RouteGuard>
          } />
          
          {/* Usuarios - Solo admin */}
          <Route path="/usuarios" element={
            <RouteGuard allowedRoles={['admin']}>
              <UsersPage />
            </RouteGuard>
          } />
          
          {/* Configuración - Solo admin */}
          <Route path="/configuracion" element={
            <RouteGuard allowedRoles={['admin']}>
              <ConfigPage />
            </RouteGuard>
          } />
          
          {/* Ruta no encontrada - Redirigir según rol */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <FacturaModal />
    </div>
  );
}

function AppInitializer() {
  const { initialize, generarAlertas, isLoading } = useStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      generarAlertas();
    }
  }, [isLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppInitializer;
