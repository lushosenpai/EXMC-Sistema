import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiAlertCircle,
  FiTrendingUp,
  FiPackage,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-dark-textMuted">Cargando estadísticas...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Ventas Hoy',
      value: `$${stats?.today.total.toLocaleString() || 0}`,
      subtitle: `${stats?.today.count || 0} transacciones`,
      icon: FiDollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Ventas del Mes',
      value: `$${stats?.month.total.toLocaleString() || 0}`,
      subtitle: `${stats?.month.count || 0} ventas`,
      icon: FiTrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Stock Bajo',
      value: stats?.lowStockProducts || 0,
      subtitle: 'productos críticos',
      icon: FiAlertCircle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Clientes Activos',
      value: stats?.activeCustomers || 0,
      subtitle: 'clientes registrados',
      icon: FiUsers,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-dark-textSecondary">
          Resumen de actividades y estadísticas
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-sm text-dark-textSecondary mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-dark-textMuted">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Gráfico de ventas diarias */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">Ventas de los Últimos 7 Días</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats?.dailySales || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Total"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Productos más vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FiPackage className="text-primary" />
            Top Productos del Mes
          </h2>
          <div className="space-y-4">
            {stats?.topProducts.slice(0, 5).map((product: any, index: number) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-dark-bg rounded-lg"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{product.name}</p>
                  <p className="text-xs text-dark-textMuted">
                    {product.totalQuantity} vendidos
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-success">
                    ${product.totalRevenue?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FiShoppingCart className="text-primary" />
            Ventas por Método de Pago
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.salesByPaymentMethod || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="paymentMethod" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="_sum.total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
