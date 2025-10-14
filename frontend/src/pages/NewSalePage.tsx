import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiSearch, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import apiClient from '../api/client';
import { Customer } from '../api';

interface Product {
  id: string;
  code: string;
  name: string;
  salePrice: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface PaymentItem {
  method: string;
  amount: number;
}

const NewSalePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [payments, setPayments] = useState<PaymentItem[]>([
    { method: 'EFECTIVO', amount: 0 },
  ]);

  const { data: productsResponse } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await apiClient.get('/products');
      return data;
    },
  });

  const { data: customersResponse } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/customers');
      return data;
    },
  });

  const products = productsResponse?.data || [];
  const customers = customersResponse?.data || [];

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  subtotal: (item.quantity + 1) * product.salePrice,
                }
              : item
          )
        );
        toast.success('Producto agregado al carrito');
      } else {
        toast.error('Stock insuficiente');
      }
    } else {
      if (product.stock > 0) {
        setCart([
          ...cart,
          {
            product,
            quantity: 1,
            subtotal: product.salePrice,
          },
        ]);
        toast.success('Producto agregado al carrito');
      } else {
        toast.error('Producto sin stock');
      }
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            if (newQuantity > item.product.stock) {
              toast.error('Stock insuficiente');
              return item;
            }
            return {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.product.salePrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const createSaleMutation = useMutation({
    mutationFn: async (saleData: any) => {
      const { data } = await apiClient.post('/sales', saleData);
      return data;
    },
    onSuccess: () => {
      toast.success('¡Venta realizada con éxito!', {
        duration: 4000,
        icon: '🎉',
      });
      setCart([]);
      setSelectedCustomerId('');
      setPayments([{ method: 'EFECTIVO', amount: 0 }]);
      setSearchTerm('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al realizar la venta');
    },
  });

  const handleSubmitSale = () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    if (!selectedCustomerId) {
      toast.error('Selecciona un cliente');
      return;
    }

    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPayments !== total) {
      toast.error(`El total de pagos ($${totalPayments.toFixed(2)}) debe ser igual al total de la venta ($${total.toFixed(2)})`);
      return;
    }

    const subtotal = total;
    const tax = 0;
    const discount = 0;
    const extraPercent = 0;

    const saleData = {
      customerId: selectedCustomerId,
      payments: payments.map(p => ({
        method: p.method,
        amount: p.amount,
      })),
      subtotal,
      tax,
      discount,
      extraPercent,
      total,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.salePrice,
        subtotal: item.subtotal,
      })),
    };

    createSaleMutation.mutate(saleData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Nueva Venta</h1>
        <p className="text-dark-textSecondary">Punto de venta (POS)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-textSecondary w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {searchTerm && (
            <div className="bg-dark-surface border border-dark-border rounded-lg p-4 max-h-64 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                <div className="space-y-2">
                  {filteredProducts.slice(0, 10).map((product: Product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="w-full flex items-center justify-between p-3 bg-dark-bg hover:bg-dark-border rounded-lg transition-colors"
                    >
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">{product.name}</div>
                        <div className="text-xs text-dark-textSecondary">{product.code} - Stock: {product.stock}</div>
                      </div>
                      <div className="text-sm font-semibold text-success">{formatCurrency(product.salePrice)}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-dark-textSecondary">No se encontraron productos</p>
              )}
            </div>
          )}

          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiShoppingCart className="w-5 h-5" />
              Carrito ({cart.length} productos)
            </h3>

            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-dark-bg rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{item.product.name}</div>
                      <div className="text-xs text-dark-textSecondary">{formatCurrency(item.product.salePrice)} c/u</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 text-error hover:bg-error/10 rounded"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 text-success hover:bg-success/10 rounded"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-sm font-semibold text-success w-24 text-right">
                        {formatCurrency(item.subtotal)}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-error hover:bg-error/10 rounded"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-dark-textSecondary">
                <FiShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>El carrito está vacío</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Detalles de Venta</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-textSecondary mb-2">Cliente</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Seleccionar cliente</option>
                  {customers.map((customer: Customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-textSecondary mb-2">Métodos de Pago</label>
                <div className="space-y-2">
                  {payments.map((payment, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        value={payment.method}
                        onChange={(e) => {
                          const newPayments = [...payments];
                          newPayments[index].method = e.target.value;
                          setPayments(newPayments);
                        }}
                        className="input flex-1"
                      >
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                        <option value="TARJETA_CREDITO">Tarjeta Crédito</option>
                        <option value="TARJETA_DEBITO">Tarjeta Débito</option>
                        <option value="CUENTA_CORRIENTE">Cuenta Corriente</option>
                      </select>
                      <input
                        type="number"
                        value={payment.amount || ''}
                        onChange={(e) => {
                          const newPayments = [...payments];
                          newPayments[index].amount = parseFloat(e.target.value) || 0;
                          setPayments(newPayments);
                        }}
                        placeholder="Monto"
                        className="input w-32"
                        min="0"
                        step="0.01"
                      />
                      {payments.length > 1 && (
                        <button
                          onClick={() => {
                            setPayments(payments.filter((_, i) => i !== index));
                          }}
                          className="btn-icon bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setPayments([...payments, { method: 'EFECTIVO', amount: 0 }]);
                    }}
                    className="btn-secondary w-full"
                  >
                    <FiPlus className="w-4 h-4" />
                    Agregar Método de Pago
                  </button>
                  {payments.reduce((sum, p) => sum + p.amount, 0) > 0 && (
                    <div className="text-sm">
                      <div className="flex justify-between text-dark-textSecondary">
                        <span>Total Pagos:</span>
                        <span className={payments.reduce((sum, p) => sum + p.amount, 0) === total ? 'text-green-500' : 'text-red-500'}>
                          {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                        </span>
                      </div>
                      {payments.reduce((sum, p) => sum + p.amount, 0) !== total && (
                        <div className="flex justify-between text-dark-textSecondary mt-1">
                          <span>Diferencia:</span>
                          <span className="text-red-500">
                            {formatCurrency(total - payments.reduce((sum, p) => sum + p.amount, 0))}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-dark-border">
                <span className="text-dark-textSecondary">Subtotal</span>
                <span className="text-white font-medium">{formatCurrency(total)}</span>
              </div>

              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-white">Total</span>
                <span className="text-success">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitSale}
              disabled={cart.length === 0 || !selectedCustomerId || createSaleMutation.isPending}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDollarSign className="w-5 h-5" />
              {createSaleMutation.isPending ? 'Procesando...' : 'Finalizar Venta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSalePage;
