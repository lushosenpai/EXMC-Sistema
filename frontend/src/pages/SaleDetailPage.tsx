import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiUser, FiCalendar, FiDollarSign, FiPackage, FiCreditCard, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { saleApi } from '../api/sales';

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

interface SaleDetail {
  id: string;
  saleNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  extraPercent: number;
  total: number;
  paymentMethod?: string;
  observations?: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  } | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: SaleItem[];
  payments?: Array<{
    id: string;
    method: string;
    amount: number;
  }>;
}

const SaleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: sale, isLoading, error } = useQuery<SaleDetail>({
    queryKey: ['sale', id],
    queryFn: async () => {
      const response: any = await saleApi.getById(id!);
      return response;
    },
    enabled: !!id,
  });

  const handleDownloadPDF = () => {
    // TODO: Implementar descarga de PDF
    toast.error('Función de descarga en desarrollo');
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      EFECTIVO: 'Efectivo',
      TARJETA_CREDITO: 'Tarjeta de Crédito',
      TARJETA_DEBITO: 'Tarjeta de Débito',
      TRANSFERENCIA: 'Transferencia',
      CUENTA_CORRIENTE: 'Cuenta Corriente',
      OTRO: 'Otro',
    };
    return labels[method] || method;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Cargando detalles de venta...</div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-error mb-4">Error al cargar los detalles de la venta</div>
        <button onClick={() => navigate('/sales')} className="btn-secondary">
          Volver a Ventas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/sales')}
            className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Venta #{sale.saleNumber}
            </h1>
            <p className="text-dark-textSecondary">
              Detalles completos de la venta
            </p>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="btn-primary flex items-center gap-2"
        >
          <FiDownload className="w-5 h-5" />
          Descargar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información General */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-dark-surface border border-dark-border rounded-lg p-6 space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Información General
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-dark-textSecondary">Fecha</p>
                  <p className="text-white font-medium">
                    {new Date(sale.createdAt).toLocaleString('es-ES', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <FiCreditCard className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-dark-textSecondary mb-1">
                    {sale.payments && sale.payments.length > 0 ? 'Métodos de Pago' : 'Método de Pago'}
                  </p>
                  {sale.payments && sale.payments.length > 0 ? (
                    <div className="space-y-1">
                      {sale.payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center">
                          <span className="text-white font-medium">
                            {getPaymentMethodLabel(payment.method)}
                          </span>
                          <span className="text-success">
                            ${payment.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white font-medium">
                      {sale.paymentMethod ? getPaymentMethodLabel(sale.paymentMethod) : 'No especificado'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <FiUser className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-dark-textSecondary">Vendedor</p>
                  <p className="text-white font-medium">{sale.user.name}</p>
                  <p className="text-xs text-dark-textMuted">{sale.user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <FiUser className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-dark-textSecondary">Cliente</p>
                  {sale.customer ? (
                    <>
                      <p className="text-white font-medium">{sale.customer.name}</p>
                      {sale.customer.email && (
                        <p className="text-xs text-dark-textMuted">
                          {sale.customer.email}
                        </p>
                      )}
                      {sale.customer.phone && (
                        <p className="text-xs text-dark-textMuted">
                          {sale.customer.phone}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-white font-medium">Cliente General</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Productos Vendidos
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-bg border-b border-dark-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-dark-textSecondary uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-dark-textSecondary uppercase">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-dark-textSecondary uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {sale.items.map((item: SaleItem) => (
                    <tr key={item.id} className="hover:bg-dark-bg transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FiPackage className="text-primary" />
                          <div>
                            <p className="text-white font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-dark-textMuted">
                              SKU: {item.product.code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-white">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-medium">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Observaciones */}
          {sale.observations && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Observaciones
              </h2>
              <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <p className="text-dark-text">{sale.observations}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Resumen de Pago */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary to-primary-hover rounded-lg">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Resumen de Pago</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-dark-textSecondary">Subtotal:</span>
              <span className="text-white font-medium">
                ${sale.subtotal.toFixed(2)}
              </span>
            </div>

            {sale.discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-dark-textSecondary">Descuento:</span>
                <span className="text-success font-medium">
                  -${sale.discount.toFixed(2)}
                </span>
              </div>
            )}

            {sale.extraPercent > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-dark-textSecondary">
                  Recargo ({sale.extraPercent}%):
                </span>
                <span className="text-error font-medium">
                  +${((sale.subtotal - sale.discount) * sale.extraPercent / 100).toFixed(2)}
                </span>
              </div>
            )}

            {sale.tax > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-dark-textSecondary">IVA:</span>
                <span className="text-white font-medium">
                  ${sale.tax.toFixed(2)}
                </span>
              </div>
            )}

            <div className="border-t border-dark-border pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${sale.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-dark-bg border border-dark-border rounded-lg p-4 mt-4">
              <p className="text-xs text-dark-textMuted text-center">
                Total de items: {sale.items.reduce((acc: number, item: SaleItem) => acc + item.quantity, 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SaleDetailPage;
