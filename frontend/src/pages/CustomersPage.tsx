import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUser, FiSave, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { customerApi, Customer } from '../api';
import Modal from '../components/common/Modal';
import CustomerAccountModal from '../components/customers/CustomerAccountModal';

const CustomersPageFull = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomerAccount, setSelectedCustomerAccount] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    cuitDni: '',
    accountType: 'EFECTIVO' as 'EFECTIVO' | 'CUENTA_CORRIENTE',
    creditLimit: '',
    observations: '',
  });

  const queryClient = useQueryClient();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerApi.getAll(),
  });

  const customers = response?.data || [];

  const filteredCustomers = customers.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const createMutation = useMutation({
    mutationFn: (data: Partial<Customer>) => customerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente creado exitosamente');
      closeModal();
    },
    onError: () => {
      toast.error('Error al crear el cliente');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente actualizado exitosamente');
      closeModal();
    },
    onError: () => {
      toast.error('Error al actualizar el cliente');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente eliminado exitosamente');
      closeModal();
    },
    onError: () => {
      toast.error('Error al eliminar el cliente');
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el cliente "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      cuitDni: '',
      accountType: 'EFECTIVO',
      creditLimit: '',
      observations: '',
    });
    setShowModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      cuitDni: customer.cuitDni || '',
      accountType: customer.accountType,
      creditLimit: customer.creditLimit.toString(),
      observations: customer.observations || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setEditingCustomer(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        cuitDni: '',
        accountType: 'EFECTIVO',
        creditLimit: '',
        observations: '',
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('El nombre es obligatorio');
      return;
    }

    const data = {
      name: formData.name,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      cuitDni: formData.cuitDni || undefined,
      accountType: formData.accountType,
      creditLimit: parseFloat(formData.creditLimit) || 0,
      observations: formData.observations || undefined,
    };

    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const totalPendingBalance = customers.reduce(
    (sum: number, c: Customer) => sum + c.currentBalance,
    0
  );

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
          onClick={openCreateModal}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark-textSecondary uppercase">Tipo de Cuenta</th>
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
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{customer.name}</div>
                          {customer.cuitDni && (
                            <div className="text-xs text-dark-textSecondary">CUIT/DNI: {customer.cuitDni}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{customer.phone || '-'}</div>
                      <div className="text-xs text-dark-textSecondary">{customer.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        customer.accountType === 'CUENTA_CORRIENTE'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {customer.accountType === 'CUENTA_CORRIENTE' ? 'Cta. Cte.' : 'Efectivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-semibold ${
                        customer.currentBalance > 0 ? 'text-error' : 'text-success'
                      }`}>
                        {formatCurrency(customer.currentBalance)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {customer.accountType === 'CUENTA_CORRIENTE'
                          ? formatCurrency(customer.creditLimit)
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        customer.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                      }`}>
                        {customer.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {customer.accountType === 'CUENTA_CORRIENTE' && (
                          <button 
                            onClick={() => setSelectedCustomerAccount(customer)} 
                            className="p-2 text-warning hover:bg-warning/10 rounded-lg"
                            title="Ver cuenta corriente"
                          >
                            <FiDollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => openEditModal(customer)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(customer.id, customer.name)} className="p-2 text-error hover:bg-error/10 rounded-lg">
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
            <div className="text-2xl font-bold text-primary">
              {filteredCustomers.filter((c: Customer) => c.accountType === 'CUENTA_CORRIENTE').length}
            </div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="text-dark-textSecondary text-sm mb-1">Saldo Pendiente</div>
            <div className="text-2xl font-bold text-error">{formatCurrency(totalPendingBalance)}</div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="label">CUIT/DNI</label>
              <input
                type="text"
                className="input w-full"
                value={formData.cuitDni}
                onChange={(e) => setFormData({ ...formData, cuitDni: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Tipo de Cuenta *</label>
              <select
                className="input w-full"
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value as 'EFECTIVO' | 'CUENTA_CORRIENTE' })}
                required
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="CUENTA_CORRIENTE">Cuenta Corriente</option>
              </select>
            </div>
          </div>

          {formData.accountType === 'CUENTA_CORRIENTE' && (
            <div>
              <label className="label">Límite de Crédito</label>
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              />
            </div>
          )}

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
              {editingCustomer ? 'Actualizar' : 'Crear'} Cliente
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

      {/* Modal de Cuenta Corriente */}
      {selectedCustomerAccount && (
        <CustomerAccountModal
          customer={selectedCustomerAccount}
          onClose={() => setSelectedCustomerAccount(null)}
        />
      )}
    </div>
  );
};

export default CustomersPageFull;
