import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { FiUser, FiLogOut, FiBell, FiSettings, FiChevronDown, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    toast.success('Sesión cerrada exitosamente');
    logout();
  };

  const handleGoToConfig = () => {
    setShowMenu(false);
    navigate('/config');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
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
        {/* Botón de Notificaciones */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-dark-surfaceHover rounded-lg transition-colors"
          >
            <FiBell className="text-xl text-dark-textSecondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center text-xs text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown de Notificaciones */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-96 bg-dark-surface border border-dark-border rounded-lg shadow-dark-lg z-20 max-h-[500px] overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-dark-border flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-primary hover:text-primary-hover transition-colors"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>

                  {/* Lista de notificaciones */}
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <FiBell className="text-4xl text-dark-textMuted mx-auto mb-2" />
                        <p className="text-dark-textMuted text-sm">No hay notificaciones</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-dark-border hover:bg-dark-surfaceHover transition-colors ${
                            !notification.read ? 'bg-dark-surfaceHover/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
                                <button
                                  onClick={() => removeNotification(notification.id)}
                                  className="text-dark-textMuted hover:text-error transition-colors flex-shrink-0"
                                >
                                  <FiX className="text-lg" />
                                </button>
                              </div>
                              <p className="text-xs text-dark-textMuted mt-1">{notification.message}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-dark-textMuted">{formatTimestamp(notification.timestamp)}</span>
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-primary hover:text-primary-hover transition-colors"
                                  >
                                    Marcar como leída
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Menú de Usuario */}
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
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-dark-lg z-20"
                >
                  <button 
                    onClick={handleGoToConfig}
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
