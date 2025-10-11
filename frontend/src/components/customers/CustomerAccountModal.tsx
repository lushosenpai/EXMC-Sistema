import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiDollarSign, FiCalendar, FiCreditCard, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { customerPaymentApi, AccountSummary, CustomerPayment } from '../../api/customerPayments';
import { Customer } from '../../api';
import Modal from '../common/Modal';

interface Props {
  customer: Customer;
  onClose: () => void;
}

const CustomerAccountModal = ({ customer, onClose }: Props) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'EFECTIVO',
    reference: '',
    description: '',
  });

  const queryClient = useQueryClient();

  const { data: summaryResponse, isLoading } = useQuery({
    queryKey: ['customer-account', customer.id],
    queryFn: () => customerPaymentApi.getAccountSummary(customer.id),
  });

  const summary: AccountSummary | undefined = summaryResponse?.data;

  const createPaymentMutation = useMutation({
    mutationFn: (data: any) => customerPaymentApi.createPayment(customer.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-account', customer.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Pago registrado exitosamente');
      setShowPaymentModal(false);
      setPaymentForm({
        amount: '',
        paymentMethod: 'EFECTIVO',
        reference: '',
        description: '',
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al registrar el pago');
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => customerPaymentApi.deletePayment(customer.id, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-account', customer.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Pago eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el pago');
    },
  });

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(paymentForm.amount);
    if (!amount || amount <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    createPaymentMutation.mutate({
      amount,
      paymentMethod: paymentForm.paymentMethod,
      reference: paymentForm.reference || undefined,
      description: paymentForm.description || undefined,
    });
  };

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este pago?')) {
      deletePaymentMutation.mutate(paymentId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || !summary) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Cuenta Corriente">
        <div className="flex items-center justify-center p-8">
          <div className="text-white">Cargando información de cuenta...</div>
        </div>
      </Modal>
    );
  }

  const creditUtilization = summary.summary.creditUtilization;
  const isOverLimit = summary.summary.currentBalance > summary.customer.creditLimit;

  return (
    <>
      <Modal isOpen={true} onClose={onClose} title={`Cuenta Corriente - ${customer.name}`}>
        <div className="space-y-6">
          {/* Resumen de Cuenta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="text-primary" />
                <span className="text-sm text-dark-textSecondary">Límite de Crédito</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(summary.customer.creditLimit)}
              </p>
            </div>

            <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingUp className={isOverLimit ? 'text-error' : 'text-warning'} />
                <span className="text-sm text-dark-textSecondary">Saldo Actual</span>
              </div>
              <p className={`text-2xl font-bold ${isOverLimit ? 'text-error' : 'text-warning'}`}>
                {formatCurrency(summary.summary.currentBalance)}
              </p>
            </div>

            <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="text-success" />
                <span className="text-sm text-dark-textSecondary">Crédito Disponible</span>
              </div>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(summary.summary.availableCredit)}
              </p>
            </div>

            <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingUp className="text-info" />
                <span className="text-sm text-dark-textSecondary">Utilización</span>
              </div>
              <p className="text-2xl font-bold text-info">
                {creditUtilization.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Alerta de crédito */}
          {isOverLimit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error/10 border border-error rounded-lg p-4 flex items-start gap-3"
            >
              <FiAlertCircle className="text-error w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-error font-medium">Límite de crédito excedido</h4>
                <p className="text-sm text-dark-text mt-1">
                  El cliente ha superado su límite de crédito. Se recomienda solicitar un pago.
                </p>
              </div>
            </motion.div>
          )}

          {creditUtilization >= 80 && creditUtilization < 100 && !isOverLimit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warning/10 border border-warning rounded-lg p-4 flex items-start gap-3"
            >
              <FiAlertCircle className="text-warning w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-warning font-medium">Advertencia de crédito</h4>
                <p className="text-sm text-dark-text mt-1">
                  El cliente está utilizando más del {creditUtilization.toFixed(0)}% de su límite de crédito.
                </p>
              </div>
            </motion.div>
          )}

          {/* Botón de Registrar Pago */}
          {customer.accountType === 'CUENTA_CORRIENTE' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiDollarSign className="w-5 h-5" />
              Registrar Pago
            </button>
          )}

          {/* Pagos Recientes */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Pagos Recientes</h3>
            {summary.recentPayments && summary.recentPayments.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {summary.recentPayments.map((payment: CustomerPayment) => (
                  <div
                    key={payment.id}
                    className="bg-dark-bg border border-dark-border rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <FiCreditCard className="text-success" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-dark-textSecondary">
                          {payment.paymentMethod} - {formatDate(payment.createdAt)}
                        </p>
                        {payment.description && (
                          <p className="text-xs text-dark-textMuted mt-1">{payment.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-dark-bg border border-dark-border rounded-lg p-6 text-center">
                <FiCalendar className="w-12 h-12 text-dark-textSecondary mx-auto mb-2" />
                <p className="text-dark-textSecondary">No hay pagos registrados</p>
              </div>
            )}
          </div>

          {/* Ventas Recientes en Cuenta Corriente */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Ventas en Cuenta Corriente</h3>
            {summary.recentSales && summary.recentSales.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {summary.recentSales.map((sale: any) => (
                  <div
                    key={sale.id}
                    className="bg-dark-bg border border-dark-border rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">
                          Venta #{sale.saleNumber}
                        </p>
                        <p className="text-xs text-dark-textSecondary">
                          {formatDate(sale.createdAt)}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-warning">
                        {formatCurrency(sale.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-dark-bg border border-dark-border rounded-lg p-6 text-center">
                <FiCalendar className="w-12 h-12 text-dark-textSecondary mx-auto mb-2" />
                <p className="text-dark-textSecondary">No hay ventas en cuenta corriente</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal de Registrar Pago */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Registrar Pago"
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div>
            <label className="label">Monto *</label>
            <input
              type="number"
              step="0.01"
              className="input w-full"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              required
              min="0.01"
            />
          </div>

          <div>
            <label className="label">Método de Pago *</label>
            <select
              className="input w-full"
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              required
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
              <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
            </select>
          </div>

          <div>
            <label className="label">Referencia</label>
            <input
              type="text"
              className="input w-full"
              value={paymentForm.reference}
              onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
              placeholder="Número de comprobante, transacción, etc."
            />
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea
              className="input w-full"
              value={paymentForm.description}
              onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
              placeholder="Notas adicionales sobre el pago"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={createPaymentMutation.isPending}
            >
              <FiDollarSign className="w-5 h-5" />
              Registrar Pago
            </button>
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CustomerAccountModal;
