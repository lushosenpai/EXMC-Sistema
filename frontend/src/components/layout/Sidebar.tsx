import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiTruck,
  FiShoppingCart,
} from 'react-icons/fi';
import logoSVG from '../../assets/EXMC.svg';

const Sidebar = () => {
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiShoppingCart, label: 'Ventas', path: '/sales' },
    { icon: FiPackage, label: 'Productos', path: '/products' },
    { icon: FiUsers, label: 'Clientes', path: '/customers' },
    { icon: FiTruck, label: 'Proveedores', path: '/suppliers' },
  ];

  return (
    <aside className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
      <div className="border-b border-dark-border py-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-2"
        >
          <img 
            src={logoSVG} 
            alt="EXMC Logo" 
            className="w-32 h-32"
          />
          <div>
            <h1 className="text-xl font-bold text-white">EXMC</h1>
            <p className="text-xs text-dark-textMuted">Gestión Comercial</p>
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

      <div className="p-4 border-t border-dark-border">
        <div className="text-xs text-dark-textMuted text-center">
          © 2025 EXMC v1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
