import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { FiUser, FiLogOut, FiBell, FiSettings, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      ADMIN: 'badge-error',
      VENDEDOR: 'badge-success',
      CONSULTA: 'badge-info',
    };
    return badges[role] || 'badge-info';
  };

  return (
    <header className="h-16 bg-dark-surface border-b border-dark-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Bienvenido, {user?.name || 'Usuario'}
          </h2>
          <span className={`${getRoleBadge(user?.role || '')} text-xs`}>
            {user?.role}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-dark-surfaceHover rounded-lg transition-colors">
          <FiBell className="text-xl text-dark-textSecondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-dark-surfaceHover rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center">
              <FiUser className="text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-dark-textMuted">{user?.email}</p>
            </div>
            <FiChevronDown
              className={`text-dark-textMuted transition-transform ${
                showMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-dark-lg z-20"
                >
                  <button 
                    onClick={() => {
                      setShowMenu(false);
                      toast('Función de configuración próximamente', {
                        icon: '⚙️',
                        duration: 2000,
                      });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-surfaceHover transition-colors text-left"
                  >
                    <FiSettings className="text-dark-textSecondary" />
                    <span className="text-sm text-dark-text">Configuración</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-surfaceHover transition-colors text-left border-t border-dark-border text-error"
                  >
                    <FiLogOut />
                    <span className="text-sm">Cerrar Sesión</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
