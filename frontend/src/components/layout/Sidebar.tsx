import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiTruck,
  FiShoppingCart,
  FiUserCheck,
  FiLayers,
  FiBarChart2,
} from 'react-icons/fi';
import logoSVG from '../../assets/EXMC.svg';

const Sidebar = () => {
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiShoppingCart, label: 'Ventas', path: '/sales' },
    { icon: FiPackage, label: 'Productos', path: '/products' },
    { icon: FiLayers, label: 'Stock', path: '/stock' },
    { icon: FiUsers, label: 'Clientes', path: '/customers' },
    { icon: FiTruck, label: 'Proveedores', path: '/suppliers' },
    { icon: FiBarChart2, label: 'Reportes', path: '/reports' },
    { icon: FiUserCheck, label: 'Usuarios', path: '/users' },
  ];

  return (
    <aside className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
      <div className="border-b border-dark-border py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2 px-4"
        >
          <img 
            src={logoSVG} 
            alt="EXMC Logo" 
            className="w-24 h-24"
          />
          <div className="text-center">
            <p className="text-xs text-dark-textMuted">Sistema de Gestión Comercial</p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-dark-textSecondary hover:bg-dark-surfaceHover hover:text-white'
                }`
              }
            >
              <item.icon className="text-xl" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-border bg-dark-bg">
        <div className="text-center space-y-1">
          <p className="text-xs text-dark-textMuted">
            Desarrollado por
          </p>
          <p className="text-sm font-semibold text-white">
            Luciano Savoretti
          </p>
          <p className="text-xs text-dark-textMuted">
            Dev / Sistemas / Web
          </p>
          <a 
            href="https://www.instagram.com/devpuchito/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors mt-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @devpuchito
          </a>
          <p className="text-xs text-dark-textMuted pt-2">
            © 2025 EXMC v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
