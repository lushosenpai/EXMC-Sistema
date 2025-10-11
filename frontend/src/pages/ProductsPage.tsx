import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiPackage, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { productApi, supplierApi, Product, Supplier } from '../api';
import Modal from '../components/common/Modal';

const ProductsPageFull = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    minStock: '',
    supplierId: '',
  });

  const queryClient = useQueryClient();

  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getAll(),
  });

  const { data: suppliersResponse } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierApi.getAll(),
  });

  const products = productsResponse?.data || [];
  const suppliers = suppliersResponse?.data || [];

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: (data: Partial<Product>) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado exitosamente');
      closeModal();
    },
    onError: () => {
      toast.error('Error al crear el producto');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado exitosamente');
      closeModal();
    },
    onError: () => {
      toast.error('Error al actualizar el producto');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar el producto');
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      costPrice: '',
      salePrice: '',
      stock: '',
      minStock: '',
      supplierId: '',
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      description: product.description || '',
      costPrice: product.costPrice.toString(),
      salePrice: product.salePrice.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      supplierId: product.supplierId,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setEditingProduct(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        costPrice: '',
        salePrice: '',
        stock: '',
        minStock: '',
        supplierId: '',
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.supplierId) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    const data = {
      code: formData.code,
      name: formData.name,
      description: formData.description || undefined,
      costPrice: parseFloat(formData.costPrice) || 0,
      salePrice: parseFloat(formData.salePrice) || 0,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 0,
      supplierId: formData.supplierId,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getStockColor = (stock: number, minStock: number) => {
    if (stock <= minStock) return 'text-error';
    if (stock <= minStock * 2) return 'text-warning';
    return 'text-success';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Error al cargar productos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Productos</h1>
          <p className="text-dark-textSecondary">
            Gestión de inventario ({filteredProducts.length} productos)
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={openCreateModal}
        >
          <FiPlus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-textSecondary w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
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
            <p className="mt-4 text-dark-textSecondary">Cargando productos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-dark-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Código</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Producto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Proveedor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Precio</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredProducts.map((product: Product) => (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{product.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FiPackage className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-dark-textSecondary truncate max-w-xs">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{product.supplier?.name || 'Sin proveedor'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-success">{formatCurrency(product.salePrice)}</div>
                      <div className="text-xs text-dark-textSecondary">Costo: {formatCurrency(product.costPrice)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-semibold ${getStockColor(product.stock, product.minStock)}`}>
                        {product.stock} un.
                      </div>
                      <div className="text-xs text-dark-textSecondary">Mín: {product.minStock}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        product.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                      }`}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(product)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id, product.name)} className="p-2 text-error hover:bg-error/10 rounded-lg">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiPackage className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No hay productos</h3>
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Total Productos</div>
            <div className="text-2xl font-bold text-white">{filteredProducts.length}</div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Stock Total</div>
            <div className="text-2xl font-bold text-primary">
              {filteredProducts.reduce((sum: number, p: Product) => sum + p.stock, 0)}
            </div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Productos Activos</div>
            <div className="text-2xl font-bold text-success">
              {filteredProducts.filter((p: Product) => p.isActive).length}
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Código *</label>
              <input
                type="text"
                className="input w-full"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Proveedor *</label>
              <select
                className="input w-full"
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                required
              >
                <option value="">Seleccionar</option>
                {suppliers.map((supplier: Supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Nombre *</label>
            <input
              type="text"
              className="input w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea
              className="input w-full"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Precio Costo</label>
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Precio Venta</label>
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                className="input w-full"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Stock Mínimo</label>
              <input
                type="number"
                className="input w-full"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <FiSave className="w-5 h-5" />
              {editingProduct ? 'Actualizar' : 'Crear'} Producto
            </button>
            <button
              type="button"
              onClick={closeModal}
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

export default ProductsPageFull;
