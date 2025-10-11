import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ('ADMIN' | 'VENDEDOR' | 'CONSULTA')[];
  readOnly?: boolean;
}

const ProtectedRoute = ({ children, requiredRoles, readOnly = false }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (isAuthenticated && requiredRoles && user && !requiredRoles.includes(user.role)) {
      if (!hasShownToast) {
        toast.error('No tienes permisos para acceder a esta sección');
        setHasShownToast(true);
      }
    }
  }, [isAuthenticated, requiredRoles, user, hasShownToast]);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere roles específicos y el usuario no tiene el rol requerido
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si es modo solo lectura y el usuario es CONSULTA, podría agregar lógica adicional aquí
  // Por ahora simplemente renderizamos los children
  return <>{children}</>;
};

export default ProtectedRoute;
