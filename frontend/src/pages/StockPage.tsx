import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiPackage, FiTrendingUp, FiTrendingDown, FiAlertCircle, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { stockApi, StockMovement, LowStockProduct } from '../api/stock';
import { productApi, Product } from '../api';
import Modal from '../components/common/Modal';

const StockPage = () => {
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [movementForm, setMovementForm] = useState({
    productId: '',
    type: 'ENTRADA' as 'ENTRADA' | 'SALIDA' | 'AJUSTE',
    quantity: '',
    reason: '',
    reference: '',
  });

  const queryClient = useQueryClient();

  // Consultas
  const { data: movementsResponse, isLoading: isLoadingMovements } = useQuery({
    queryKey: ['stock-movements', filterType],
    queryFn: () => stockApi.getMovements({ type: filterType || undefined, limit: 100 }),
  });

  const { data: lowStockResponse, isLoading: isLoadingLowStock } = useQuery({
    queryKey: ['low-stock'],
    queryFn: () => stockApi.getLowStockProducts(),
  });

  const { data: productsResponse } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getAll(),
  });

  const movements: StockMovement[] = movementsResponse?.data || [];
  const lowStockProducts: LowStockProduct[] = lowStockResponse?.data || [];
  const products: Product[] = productsResponse?.data || [];

  // Mutaciones
  const createMovementMutation = useMutation({
    mutationFn: (data: any) => stockApi.createMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock'] });
      toast.success('Movimiento de stock registrado');
      setShowMovementModal(false);
      setMovementForm({
        productId: '',
        type: 'ENTRADA',
        quantity: '',
        reason: '',
        reference: '',
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al registrar movimiento');
    },
  });

  const handleSubmitMovement = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movementForm.productId) {
      toast.error('Selecciona un producto');
      return;
    }

    const quantity = parseFloat(movementForm.quantity);
    if (!quantity || quantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    createMovementMutation.mutate({
      productId: movementForm.productId,
      type: movementForm.type,
      quantity,
      reason: movementForm.reason || undefined,
      reference: movementForm.reference || undefined,
    });
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'ENTRADA':
        return <FiTrendingUp className="text-success" />;
      case 'SALIDA':
        return <FiTrendingDown className="text-error" />;
      case 'AJUSTE':
        return <FiPackage className="text-warning" />;
      case 'VENTA':
        return <FiTrendingDown className="text-primary" />;
      default:
        return <FiPackage className="text-info" />;
    }
  };

  const getMovementLabel = (type: string) => {
    const labels: Record<string, string> = {
      ENTRADA: 'Entrada',
      SALIDA: 'Salida',
      AJUSTE: 'Ajuste',
      VENTA: 'Venta',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoadingMovements && isLoadingLowStock) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Cargando información de stock...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Stock</h1>
          <p className="text-dark-textSecondary">
            Control de inventario y movimientos
          </p>
        </div>
        <button
          onClick={() => setShowMovementModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Registrar Movimiento
        </button>
      </div>

      {/* Alertas de Stock Bajo */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error/10 border border-error rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-error w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-error font-bold mb-2">
                Productos con Stock Bajo ({lowStockProducts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-dark-surface border border-dark-border rounded p-2"
                  >
                    <p className="text-white font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-dark-textSecondary">
                      Stock: {product.stock} / Mínimo: {product.minStock}
                    </p>
                    {product.supplier && (
                      <p className="text-xs text-dark-textMuted mt-1">
                        Proveedor: {product.supplier.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filtros */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="flex items-center gap-4">
          <FiFilter className="text-dark-textSecondary" />
          <select
            className="input flex-1"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Todos los movimientos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SALIDA">Salidas</option>
            <option value="AJUSTE">Ajustes</option>
            <option value="VENTA">Ventas</option>
          </select>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-dark-textSecondary uppercase">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-dark-textSecondary uppercase">
                  Stock Anterior
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-dark-textSecondary uppercase">
                  Stock Nuevo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {movements.length > 0 ? (
                movements.map((movement) => (
                  <motion.tr
                    key={movement.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-dark-bg transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getMovementIcon(movement.type)}
                        <span className="text-sm text-white font-medium">
                          {getMovementLabel(movement.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{movement.product.name}</p>
                        <p className="text-xs text-dark-textSecondary">
                          {movement.product.code}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white font-bold">{movement.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-dark-text">{movement.previousStock}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-primary font-bold">{movement.newStock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-dark-text">
                        {movement.reason || '-'}
                      </p>
                      {movement.reference && (
                        <p className="text-xs text-dark-textMuted">
                          Ref: {movement.reference}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-dark-text">
                        {formatDate(movement.createdAt)}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FiPackage className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No hay movimientos
                    </h3>
                    <p className="text-dark-textSecondary">
                      Los movimientos de stock aparecerán aquí
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nuevo Movimiento */}
      <Modal
        isOpen={showMovementModal}
        onClose={() => setShowMovementModal(false)}
        title="Registrar Movimiento de Stock"
      >
        <form onSubmit={handleSubmitMovement} className="space-y-4">
          <div>
            <label className="label">Producto *</label>
            <select
              className="input w-full"
              value={movementForm.productId}
              onChange={(e) =>
                setMovementForm({ ...movementForm, productId: e.target.value })
              }
              required
            >
              <option value="">Seleccionar producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.code}) - Stock: {product.stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Tipo de Movimiento *</label>
            <select
              className="input w-full"
              value={movementForm.type}
              onChange={(e) =>
                setMovementForm({
                  ...movementForm,
                  type: e.target.value as 'ENTRADA' | 'SALIDA' | 'AJUSTE',
                })
              }
              required
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SALIDA">Salida</option>
              <option value="AJUSTE">Ajuste</option>
            </select>
          </div>

          <div>
            <label className="label">
              {movementForm.type === 'AJUSTE' ? 'Nuevo Stock *' : 'Cantidad *'}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              className="input w-full"
              value={movementForm.quantity}
              onChange={(e) =>
                setMovementForm({ ...movementForm, quantity: e.target.value })
              }
              required
            />
            {movementForm.type === 'AJUSTE' && (
              <p className="text-xs text-dark-textMuted mt-1">
                Se establecerá el stock exacto a este valor
              </p>
            )}
          </div>

          <div>
            <label className="label">Motivo</label>
            <input
              type="text"
              className="input w-full"
              value={movementForm.reason}
              onChange={(e) =>
                setMovementForm({ ...movementForm, reason: e.target.value })
              }
              placeholder="Ej: Compra, devolución, merma, etc."
            />
          </div>

          <div>
            <label className="label">Referencia</label>
            <input
              type="text"
              className="input w-full"
              value={movementForm.reference}
              onChange={(e) =>
                setMovementForm({ ...movementForm, reference: e.target.value })
              }
              placeholder="Ej: Número de factura, orden, etc."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={createMovementMutation.isPending}
            >
              Registrar Movimiento
            </button>
            <button
              type="button"
              onClick={() => setShowMovementModal(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StockPage;
