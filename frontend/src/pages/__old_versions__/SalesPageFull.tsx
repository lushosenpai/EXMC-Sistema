import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEye, FiDollarSign, FiX, FiCalendar, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/client';

interface SaleItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: {
    id: string;
    name: string;
    code: string;
  };
}

interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  createdAt: string;
  customer: { 
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
  total: number;
  paymentMethod: string;
  status: string;
  items: SaleItem[];
}

const salesApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/sales?limit=100');
    return data;
  },
};

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAll,
  });

  const sales: Sale[] = response?.data || [];

  const filteredSales = sales.filter((sale: Sale) =>
    sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todaySales = sales.filter((s: Sale) => {
    const today = new Date().toISOString().split('T')[0];
    const saleDate = new Date(s.createdAt).toISOString().split('T')[0];
    return saleDate === today;
  });

  const todayTotal = todaySales.reduce((sum: number, s: Sale) => sum + s.total, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
      CUENTA_CORRIENTE: 'Cta. Cte.',
    };
    return labels[method] || method;
  };

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setTimeout(() => setSelectedSale(null), 300);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Error al cargar ventas</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary mt-4"
        >
          Reintentar
        </button>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Pago</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredSales.map((sale: Sale) => (
                  <motion.tr 
                    key={sale.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="hover:bg-dark-bg/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-sm font-medium text-white">{sale.saleNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{formatDate(sale.createdAt)}</div>
                      <div className="text-xs text-dark-textSecondary">{formatTime(sale.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{sale.customer.name}</div>
                      <div className="text-xs text-dark-textSecondary">Vendedor: {sale.user.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-success">{formatCurrency(sale.total)}</div>
                      <div className="text-xs text-dark-textSecondary">{sale.items.length} items</div>
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
                        onClick={() => handleViewDetails(sale)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Ver detalles"
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

      {/* Modal de detalles */}
      <AnimatePresence>
        {showDetailsModal && selectedSale && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-dark-surface rounded-2xl shadow-dark-lg border border-dark-border z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-dark-surface border-b border-dark-border px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-white">Detalles de Venta</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-dark-textSecondary" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Información general */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-dark-textSecondary mb-1">Número de Venta</div>
                    <div className="text-lg font-semibold text-white">{selectedSale.saleNumber}</div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-dark-textSecondary mb-1">Fecha</div>
                    <div className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      {formatDate(selectedSale.createdAt)} {formatTime(selectedSale.createdAt)}
                    </div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-dark-textSecondary mb-1">Cliente</div>
                    <div className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      {selectedSale.customer.name}
                    </div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-dark-textSecondary mb-1">Vendedor</div>
                    <div className="text-lg font-semibold text-white">{selectedSale.user.name}</div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-dark-textSecondary mb-1">Método de Pago</div>
                    <div className="text-lg font-semibold text-white">{getPaymentMethodLabel(selectedSale.paymentMethod)}</div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-dark-textSecondary mb-1">Estado</div>
                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedSale.status)}`}>
                      {selectedSale.status}
                    </span>
                  </div>
                </div>

                {/* Items de la venta */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Productos</h3>
                  <div className="bg-dark-bg rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-dark-surface border-b border-dark-border">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-dark-textSecondary uppercase">Producto</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-dark-textSecondary uppercase">Cantidad</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-dark-textSecondary uppercase">Precio Unit.</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-dark-textSecondary uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border">
                        {selectedSale.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div className="text-sm text-white font-medium">{item.product.name}</div>
                              <div className="text-xs text-dark-textSecondary">{item.product.code}</div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-white">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-sm text-white">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-success">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-dark-surface border-t-2 border-primary">
                        <tr>
                          <td colSpan={3} className="px-4 py-4 text-right text-lg font-bold text-white">
                            TOTAL
                          </td>
                          <td className="px-4 py-4 text-right text-xl font-bold text-success">
                            {formatCurrency(selectedSale.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesPage;
