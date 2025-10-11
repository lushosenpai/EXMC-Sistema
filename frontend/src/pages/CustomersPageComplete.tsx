import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { customerApi, Customer } from '../api';

const CustomersPageNew = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerApi.getAll(),
  });

  const customers = response?.data || [];

  const filteredCustomers = customers.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await customerApi.delete(id);
        alert('Cliente eliminado correctamente');
        refetch();
      } catch (error) {
        alert('Error al eliminar el cliente');
      }
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Error al cargar clientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
          <p className="text-dark-textSecondary">
            Gestión de clientes ({filteredCustomers.length} clientes)
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => alert('Función de crear cliente próximamente')}
        >
          <FiPlus className="w-5 h-5" />
          Nuevo Cliente
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
            <p className="mt-4 text-dark-textSecondary">Cargando clientes...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-dark-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Contacto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Saldo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Límite</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredCustomers.map((customer: Customer) => (
                  <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{customer.name}</div>
                          <div className="text-xs text-dark-textSecondary">{customer.cuitDni || 'Sin documento'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{customer.phone || '-'}</div>
                      <div className="text-xs text-dark-textSecondary">{customer.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        customer.accountType === 'CUENTA_CORRIENTE' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'
                      }`}>
                        {customer.accountType === 'CUENTA_CORRIENTE' ? 'Cta. Corriente' : 'Efectivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-semibold ${customer.currentBalance > 0 ? 'text-error' : 'text-success'}`}>
                        ${customer.currentBalance.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="text-sm text-white">${customer.creditLimit.toFixed(2)}</div></td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        customer.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                      }`}>
                        {customer.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => alert('Editar próximamente')} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(customer.id)} className="p-2 text-error hover:bg-error/10 rounded-lg">
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
            <FiUser className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No hay clientes</h3>
          </div>
        )}
      </div>

      {filteredCustomers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Total Clientes</div>
            <div className="text-2xl font-bold text-white">{filteredCustomers.length}</div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Cuenta Corriente</div>
            <div className="text-2xl font-bold text-blue-400">
              {filteredCustomers.filter((c: Customer) => c.accountType === 'CUENTA_CORRIENTE').length}
            </div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Saldo Pendiente</div>
            <div className="text-2xl font-bold text-error">
              ${filteredCustomers.reduce((acc: number, c: Customer) => acc + c.currentBalance, 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPageNew;
