import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import logoSVG from '../assets/EXMC.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setAuth(data.user, data.token);
      toast.success(`¡Bienvenido ${data.user.name}!`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <img 
            src={logoSVG} 
            alt="EXMC Logo" 
            className="w-48 h-48"
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Iniciar Sesión</h1>
        <p className="text-dark-textMuted">Sistema de Gestión Comercial EXMC</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-textMuted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-12"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="label">Contraseña</label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-textMuted" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-12 pr-12"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-textMuted hover:text-white"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-dark-border">
        <p className="text-xs text-dark-textMuted text-center">
          Credenciales de prueba:<br />
          <strong>admin@exmc.com</strong> / admin123
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
