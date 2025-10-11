import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUser, FiSave, FiKey } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { userApi, User } from '../api';
import Modal from '../components/common/Modal';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'VENDEDOR' as 'ADMIN' | 'VENDEDOR' | 'CONSULTA',
    isActive: true,
  });

  const queryClient = useQueryClient();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: () => userApi.getAll({ search: searchTerm }),
  });

  const users = response?.data || [];

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: (data: any) => userApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear el usuario');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado exitosamente');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el usuario');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario desactivado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al desactivar el usuario');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      userApi.resetPassword(id, password),
    onSuccess: () => {
      toast.success('Contraseña actualizada exitosamente');
      closePasswordModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar la contraseña');
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de desactivar el usuario "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'VENDEDOR',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  const openPasswordModal = (userId: string) => {
    setSelectedUserId(userId);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'VENDEDOR',
        isActive: true,
      });
    }, 300);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setTimeout(() => {
      setSelectedUserId('');
      setNewPassword('');
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.name) {
      toast.error('Email y nombre son obligatorios');
      return;
    }

    if (!editingUser && !formData.password) {
      toast.error('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    const data: any = {
      email: formData.email,
      name: formData.name,
      role: formData.role,
      isActive: formData.isActive,
    };

    if (!editingUser) {
      data.password = formData.password;
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingUser.id, data });
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    resetPasswordMutation.mutate({ id: selectedUserId, password: newPassword });
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      ADMIN: 'badge-error',
      VENDEDOR: 'badge-success',
      CONSULTA: 'badge-info',
    };
    return badges[role] || 'badge-info';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-error">Error al cargar usuarios</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Usuarios</h1>
          <p className="text-dark-textSecondary">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-textSecondary w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-dark-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                    Ventas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-dark-textSecondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredUsers.map((user: User) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-dark-bg transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center">
                          <FiUser className="text-white" />
                        </div>
                        <div className="text-sm font-medium text-white">
                          {user.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-dark-text">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${getRoleBadge(user.role)} text-xs`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`badge text-xs ${
                          user.isActive ? 'badge-success' : 'badge-error'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-dark-text">
                        {user._count?.sales || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openPasswordModal(user.id)}
                          className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors"
                          title="Cambiar contraseña"
                        >
                          <FiKey className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                          disabled={!user.isActive}
                        >
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
            <h3 className="text-lg font-medium text-white mb-2">
              No hay usuarios
            </h3>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar Usuario */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre *</label>
            <input
              type="text"
              className="input w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              className="input w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {!editingUser && (
            <div>
              <label className="label">Contraseña *</label>
              <input
                type="password"
                className="input w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          )}

          <div>
            <label className="label">Rol *</label>
            <select
              className="input w-full"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'ADMIN' | 'VENDEDOR' | 'CONSULTA',
                })
              }
              required
            >
              <option value="VENDEDOR">Vendedor</option>
              <option value="ADMIN">Administrador</option>
              <option value="CONSULTA">Consulta</option>
            </select>
          </div>

          {editingUser && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm text-dark-text">
                Usuario activo
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <FiSave className="w-5 h-5" />
              {editingUser ? 'Actualizar' : 'Crear'} Usuario
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

      {/* Modal Cambiar Contraseña */}
      <Modal
        isOpen={showPasswordModal}
        onClose={closePasswordModal}
        title="Cambiar Contraseña"
      >
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label className="label">Nueva Contraseña *</label>
            <input
              type="password"
              className="input w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={resetPasswordMutation.isPending}
            >
              <FiKey className="w-5 h-5" />
              Cambiar Contraseña
            </button>
            <button
              type="button"
              onClick={closePasswordModal}
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

export default UsersPage;
