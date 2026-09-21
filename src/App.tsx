import React, { useState, useEffect } from 'react';
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
import Sidebar from './components/Sidebar';
import FacturaModal from './components/FacturaModal';

function App() {
  const { currentUser, generarAlertas, ultimaFactura } = useStore();
  const { tema } = useTema();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Generate alerts on load
  useEffect(() => {
    generarAlertas();
  }, []);

  // Redirect based on role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.rol === 'cocina' && currentPage === 'dashboard') {
        setCurrentPage('cocina');
      }
    }
  }, [currentUser]);

  // Not logged in
  if (!currentUser) {
    return <Login />;
  }

  const isDark = tema === 'dark';

  // Render page based on role and selection
  const renderPage = () => {
    const rolePages: Record<string, string[]> = {
      admin: ['dashboard', 'mesas', 'cocina', 'inventario', 'pedidos', 'usuarios', 'configuracion'],
      mesero: ['dashboard', 'mesas', 'pedidos'],
      cocina: ['dashboard', 'cocina'],
    };

    const allowed = rolePages[currentUser.rol] || ['dashboard'];
    const page = allowed.includes(currentPage) ? currentPage : 'dashboard';

    switch (page) {
      case 'dashboard':
        return <Dashboard />;
      case 'cocina':
        return <Kitchen />;
      case 'inventario':
        return <Inventory />;
      case 'mesas':
        return <Tables />;
      case 'pedidos':
        return <Orders />;
      case 'configuracion':
        return <ConfigPage />;
      case 'usuarios':
        return <UsersPage />;
      default:
        return <Dashboard />;
    }
  };

  // Kitchen gets a special full-screen layout
  if (currentPage === 'cocina' && currentUser.rol === 'cocina') {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Kitchen />
        {ultimaFactura && <FacturaModal />}
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto min-h-screen">
        {renderPage()}
      </main>
      {ultimaFactura && <FacturaModal />}
    </div>
  );
}

export default App;
