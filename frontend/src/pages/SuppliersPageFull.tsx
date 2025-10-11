import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiTruck, FiX, FiSave } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supplierApi, Supplier } from '../api';

const SuppliersPageFull = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    observations: '',
  });

  const queryClient = useQueryClient();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierApi.getAll(),
  });

  const suppliers = response?.data || [];

  const filteredSuppliers = suppliers.filter((supplier: Supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.includes(searchTerm)
  );

  const createMutation = useMutation({
    mutationFn: (data: Partial<Supplier>) => supplierApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      alert('Proveedor creado exitosamente');
      closeModal();
    },
    onError: () => {
      alert('Error al crear el proveedor');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) =>
      supplierApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      alert('Proveedor actualizado exitosamente');
      closeModal();
    },
    onError: () => {
      alert('Error al actualizar el proveedor');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => supplierApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      alert('Proveedor eliminado exitosamente');
    },
    onError: () => {
      alert('Error al eliminar el proveedor');
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el proveedor "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      province: '',
      observations: '',
    });
    setShowModal(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      city: supplier.city || '',
      province: supplier.province || '',
      observations: supplier.observations || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setEditingSupplier(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        province: '',
        observations: '',
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert('El nombre es obligatorio');
      return;
    }

    const data = {
      name: formData.name,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      province: formData.province || undefined,
      observations: formData.observations || undefined,
    };

    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Error al cargar proveedores</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Proveedores</h1>
          <p className="text-dark-textSecondary">
            Gestión de proveedores ({filteredSuppliers.length} proveedores)
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={openCreateModal}
        >
          <FiPlus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-textSecondary w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
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
            <p className="mt-4 text-dark-textSecondary">Cargando proveedores...</p>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-dark-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Proveedor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Contacto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Ubicación</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredSuppliers.map((supplier: Supplier) => (
                  <motion.tr key={supplier.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                          <FiTruck className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{supplier.name}</div>
                          {supplier.observations && (
                            <div className="text-xs text-dark-textSecondary truncate max-w-xs">{supplier.observations}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{supplier.phone || '-'}</div>
                      <div className="text-xs text-dark-textSecondary">{supplier.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{supplier.city || '-'}</div>
                      <div className="text-xs text-dark-textSecondary">{supplier.province || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        supplier.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                      }`}>
                        {supplier.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(supplier)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(supplier.id, supplier.name)} className="p-2 text-error hover:bg-error/10 rounded-lg">
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
            <FiTruck className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No hay proveedores</h3>
          </div>
        )}
      </div>

      {filteredSuppliers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Total Proveedores</div>
            <div className="text-2xl font-bold text-white">{filteredSuppliers.length}</div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Proveedores Activos</div>
            <div className="text-2xl font-bold text-success">
              {filteredSuppliers.filter((s: Supplier) => s.isActive).length}
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
      <AnimatePresence>
        {showModal && (
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
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-dark-surface rounded-2xl shadow-dark-lg border border-dark-border z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-dark-surface border-b border-dark-border px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-white">
                  {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-dark-textSecondary" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Teléfono</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      className="input w-full"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Dirección</label>
                  <input
                    type="text"
                    className="input w-full"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Ciudad</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Provincia</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Observaciones</label>
                  <textarea
                    className="input w-full"
                    rows={3}
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <FiSave className="w-5 h-5" />
                    {editingSupplier ? 'Actualizar' : 'Crear'} Proveedor
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuppliersPageFull;
