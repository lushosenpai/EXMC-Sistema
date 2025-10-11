import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEye, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import apiClient from '../api/client';

interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  customer: { name: string };
  total: number;
  paymentMethod: string;
  status: string;
  items: Array<{ product: { name: string }; quantity: number; unitPrice: number }>;
}

const salesApi = {
  getAll: () => apiClient.get<Sale[]>('/sales'),
};

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['sales'],
    queryFn: () => salesApi.getAll(),
  });

  const sales = response?.data || [];

  const filteredSales = sales.filter((sale: Sale) =>
    sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todaySales = sales.filter((s: Sale) => {
    const today = new Date().toISOString().split('T')[0];
    const saleDate = s.date.split('T')[0];
    return saleDate === today;
  });

  const todayTotal = todaySales.reduce((sum: number, s: Sale) => sum + s.total, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETADA': return 'bg-success/20 text-success';
      case 'PENDIENTE': return 'bg-warning/20 text-warning';
      case 'CANCELADA': return 'bg-error/20 text-error';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      EFECTIVO: 'Efectivo',
      TRANSFERENCIA: 'Transferencia',
      TARJETA: 'Tarjeta',
      CUENTA_CORRIENTE: 'Cuenta Corriente',
    };
    return labels[method] || method;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Error al cargar ventas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ventas</h1>
          <p className="text-dark-textSecondary">
            Historial de ventas ({filteredSales.length} registros)
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => window.location.href = '/nueva-venta'}
        >
          <FiPlus className="w-5 h-5" />
          Nueva Venta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-dark-textSecondary text-sm mb-1">Ventas Hoy</div>
          <div className="text-2xl font-bold text-white">{todaySales.length}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-dark-textSecondary text-sm mb-1">Total Hoy</div>
          <div className="text-2xl font-bold text-success">{formatCurrency(todayTotal)}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-dark-textSecondary text-sm mb-1">Total Ventas</div>
          <div className="text-2xl font-bold text-primary">{sales.length}</div>
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-textSecondary w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por número de venta o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-dark-textSecondary">Cargando ventas...</p>
          </div>
        ) : filteredSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-dark-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Nº Venta</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Método de Pago</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredSales.map((sale: Sale) => (
                  <motion.tr key={sale.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-sm font-medium text-white">{sale.saleNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {new Date(sale.date).toLocaleDateString('es-AR')}
                      </div>
                      <div className="text-xs text-dark-textSecondary">
                        {new Date(sale.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{sale.customer.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-success">{formatCurrency(sale.total)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{getPaymentMethodLabel(sale.paymentMethod)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => alert(`Detalles de venta:\n${sale.items.map(i => `- ${i.product.name} x${i.quantity} = ${formatCurrency(i.unitPrice * i.quantity)}`).join('\n')}`)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiDollarSign className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No hay ventas registradas</h3>
            <p className="text-dark-textSecondary mb-4">Crea tu primera venta</p>
            <button className="btn-primary" onClick={() => window.location.href = '/nueva-venta'}>
              Nueva Venta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
