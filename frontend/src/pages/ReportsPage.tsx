import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiDownload, FiCalendar, FiTrendingUp, FiPackage, FiDollarSign, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { dashboardApi } from '../api/dashboard';
import { toast } from 'sonner';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', dateRange],
    queryFn: () => dashboardApi.getStats(),
  });

  // Query para reporte de ventas (preparado para uso futuro)
  const { isLoading: isLoadingReport } = useQuery({
    queryKey: ['sales-report', dateRange],
    queryFn: () => dashboardApi.getSalesReport(dateRange),
  });

  const handleExportPDF = () => {
    toast.error('Función de exportación a PDF en desarrollo');
  };

  const handleExportExcel = () => {
    toast.error('Función de exportación a Excel en desarrollo');
  };

  // Configuración de gráficos
  const salesChartData = {
    labels: stats?.dailySales?.map((d: any) => d.date) || [],
    datasets: [
      {
        label: 'Ventas Diarias',
        data: stats?.dailySales?.map((d: any) => d.total) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const topProductsChartData = {
    labels: stats?.topProducts?.slice(0, 10).map((p: any) => p.name) || [],
    datasets: [
      {
        label: 'Cantidad Vendida',
        data: stats?.topProducts?.slice(0, 10).map((p: any) => p.totalQuantity) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
      },
    ],
  };

  const paymentMethodsChartData = {
    labels: stats?.salesByPaymentMethod?.map((s: any) => s.paymentMethod) || [],
    datasets: [
      {
        data: stats?.salesByPaymentMethod?.map((s: any) => s._sum.total) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
        },
      },
    },
  };

  if (isLoading || isLoadingReport) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Cargando reportes...</div>
      </div>
    );
  }

  const totalSales = stats?.dailySales?.reduce((sum: number, d: any) => sum + d.total, 0) || 0;
  const avgSale = stats?.dailySales?.length ? totalSales / stats.dailySales.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reportes Avanzados</h1>
          <p className="text-dark-textSecondary">
            Análisis detallado de ventas y productos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="btn-secondary flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Exportar PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="btn-primary flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Filtros de Fecha */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="flex items-center gap-4">
          <FiFilter className="text-dark-textSecondary" />
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-dark-textSecondary" />
              <label className="text-sm text-dark-text">Desde:</label>
              <input
                type="date"
                className="input"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-dark-text">Hasta:</label>
              <input
                type="date"
                className="input"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FiDollarSign className="text-primary w-5 h-5" />
            </div>
            <span className="text-sm text-dark-textSecondary">Total Ventas</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${totalSales.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <FiTrendingUp className="text-success w-5 h-5" />
            </div>
            <span className="text-sm text-dark-textSecondary">Promedio Diario</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${avgSale.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <FiPackage className="text-warning w-5 h-5" />
            </div>
            <span className="text-sm text-dark-textSecondary">Productos Vendidos</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats?.topProducts?.reduce((sum: number, p: any) => sum + p.totalQuantity, 0) || 0}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <FiDollarSign className="text-info w-5 h-5" />
            </div>
            <span className="text-sm text-dark-textSecondary">Ticket Promedio</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${stats?.dailySales?.length ? (totalSales / (stats?.month?.count || 1)).toFixed(2) : '0.00'}
          </p>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ventas en el Tiempo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4">Evolución de Ventas</h2>
          <div style={{ height: '300px' }}>
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Gráfico de Métodos de Pago */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4">Ventas por Método de Pago</h2>
          <div style={{ height: '300px' }}>
            <Pie data={paymentMethodsChartData} options={pieChartOptions} />
          </div>
        </motion.div>

        {/* Gráfico de Productos Más Vendidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-bold text-white mb-4">Top 10 Productos Más Vendidos</h2>
          <div style={{ height: '400px' }}>
            <Bar data={topProductsChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Tabla de Productos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden"
      >
        <div className="p-6 border-b border-dark-border">
          <h2 className="text-lg font-bold text-white">Detalle de Productos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase">Producto</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-dark-textSecondary uppercase">Cantidad</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-dark-textSecondary uppercase">Ingresos</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-dark-textSecondary uppercase">% Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {stats?.topProducts?.map((product: any, index: number) => (
                <tr key={product.id} className="hover:bg-dark-bg transition-colors">
                  <td className="px-6 py-4 text-white">#{index + 1}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-xs text-dark-textMuted">Código: {product.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-white font-bold">
                    {product.totalQuantity}
                  </td>
                  <td className="px-6 py-4 text-right text-success font-bold">
                    ${product.totalRevenue?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-primary font-medium">
                    {((product.totalRevenue / totalSales) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
