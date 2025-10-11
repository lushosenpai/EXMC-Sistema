import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { supplierApi, Supplier } from '../api';

const SuppliersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierApi.getAll(),
  });

  const suppliers = response?.data || [];

  const filteredSuppliers = suppliers.filter((supplier: Supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        await supplierApi.delete(id);
        alert('Proveedor eliminado correctamente');
        refetch();
      } catch (error) {
        alert('Error al eliminar el proveedor');
      }
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
          onClick={() => alert('Función de crear proveedor próximamente')}
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
                        <button onClick={() => alert('Editar próximamente')} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(supplier.id)} className="p-2 text-error hover:bg-error/10 rounded-lg">
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
    </div>
  );
};

export default SuppliersPage;
