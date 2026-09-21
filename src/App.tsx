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

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { currentUser, isLoading } = useStore();
  const location = useLocation();

  console.log('=== PROTECTED ROUTE ===');
  console.log('isLoading:', isLoading);
  console.log('currentUser:', currentUser ? currentUser.nombre : 'null');
  console.log('currentUser.rol:', currentUser?.rol);
  console.log('allowedRoles:', allowedRoles);

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

  if (!allowedRoles.includes(currentUser.rol)) {
    console.log('❌ Rol no permitido:', currentUser.rol);
    console.log('Roles permitidos:', allowedRoles);
    return <Navigate to="/" replace />;
  }

  console.log('✅ Acceso permitido');
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mesas" element={<Tables />} />
          <Route path="/cocina" element={<Kitchen />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/configuracion" element={<ConfigPage />} />
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
            <ProtectedRoute allowedRoles={['admin', 'mesero', 'cocina']}>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppInitializer;
