import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'sonner';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';
import CustomersPage from './pages/CustomersPage';
import SalesPage from './pages/SalesPage';
import NewSalePage from './pages/NewSalePage';
import UsersPage from './pages/UsersPage';
import SaleDetailPage from './pages/SaleDetailPage';
import StockPage from './pages/StockPage';
import ConfigurationPage from './pages/ConfigurationPage';
import ReportsPage from './pages/ReportsPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        duration={4000}
      />
      <BrowserRouter>
        <Routes>
        {/* Rutas públicas */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
          />
        </Route>

        {/* Rutas protegidas */}
        <Route
          element={
            isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/new" element={<NewSalePage />} />
          <Route path="/sales/:id" element={<SaleDetailPage />} />
          <Route path="/users" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/config" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <ConfigurationPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Redirección por defecto */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
