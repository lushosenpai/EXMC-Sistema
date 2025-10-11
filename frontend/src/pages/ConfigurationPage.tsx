import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSave, FiSettings, FiDollarSign, FiFileText, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { configApi, SystemConfig } from '../api/config';

const ConfigurationPage = () => {
  const queryClient = useQueryClient();

  const { data: configResponse, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: () => configApi.getAll(),
  });

  const config: SystemConfig = configResponse?.data || {};

  const [formData, setFormData] = useState({
    companyName: config.companyName || '',
    companyAddress: config.companyAddress || '',
    companyPhone: config.companyPhone || '',
    companyEmail: config.companyEmail || '',
    companyCuit: config.companyCuit || '',
    taxRate: config.taxRate || '21',
    currency: config.currency || 'ARS',
    currencySymbol: config.currencySymbol || '$',
    terms: config.terms || '',
    receiptFooter: config.receiptFooter || '',
  });

  // Actualizar formData cuando se carga la config
  useState(() => {
    if (config) {
      setFormData({
        companyName: config.companyName || '',
        companyAddress: config.companyAddress || '',
        companyPhone: config.companyPhone || '',
        companyEmail: config.companyEmail || '',
        companyCuit: config.companyCuit || '',
        taxRate: config.taxRate || '21',
        currency: config.currency || 'ARS',
        currencySymbol: config.currencySymbol || '$',
        terms: config.terms || '',
        receiptFooter: config.receiptFooter || '',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) => configApi.updateMultiple(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      toast.success('Configuración actualizada exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar la configuración');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configuración del Sistema</h1>
        <p className="text-dark-textSecondary">
          Configura los parámetros generales del sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos de la Empresa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FiSettings className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white">Datos de la Empresa</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre de la Empresa *</label>
              <input
                type="text"
                className="input w-full"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="label">CUIT</label>
              <input
                type="text"
                className="input w-full"
                value={formData.companyCuit}
                onChange={(e) =>
                  setFormData({ ...formData, companyCuit: e.target.value })
                }
                placeholder="XX-XXXXXXXX-X"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Dirección</label>
              <input
                type="text"
                className="input w-full"
                value={formData.companyAddress}
                onChange={(e) =>
                  setFormData({ ...formData, companyAddress: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Teléfono</label>
              <input
                type="text"
                className="input w-full"
                value={formData.companyPhone}
                onChange={(e) =>
                  setFormData({ ...formData, companyPhone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input w-full"
                value={formData.companyEmail}
                onChange={(e) =>
                  setFormData({ ...formData, companyEmail: e.target.value })
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Configuración Fiscal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-success/10 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-xl font-bold text-white">Configuración Fiscal y Moneda</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Tasa de IVA (%)</label>
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData({ ...formData, taxRate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Moneda</label>
              <select
                className="input w-full"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <option value="ARS">Peso Argentino (ARS)</option>
                <option value="USD">Dólar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label className="label">Símbolo de Moneda</label>
              <input
                type="text"
                className="input w-full"
                value={formData.currencySymbol}
                onChange={(e) =>
                  setFormData({ ...formData, currencySymbol: e.target.value })
                }
                maxLength={3}
              />
            </div>
          </div>
        </motion.div>

        {/* Términos y Condiciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-info/10 rounded-lg">
              <FiFileText className="w-6 h-6 text-info" />
            </div>
            <h2 className="text-xl font-bold text-white">Textos y Condiciones</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Términos y Condiciones</label>
              <textarea
                className="input w-full"
                rows={4}
                value={formData.terms}
                onChange={(e) =>
                  setFormData({ ...formData, terms: e.target.value })
                }
                placeholder="Términos y condiciones que aparecerán en los comprobantes..."
              />
            </div>

            <div>
              <label className="label">Pie de Comprobante</label>
              <textarea
                className="input w-full"
                rows={3}
                value={formData.receiptFooter}
                onChange={(e) =>
                  setFormData({ ...formData, receiptFooter: e.target.value })
                }
                placeholder="Texto que aparecerá al final de cada comprobante..."
              />
            </div>
          </div>
        </motion.div>

        {/* Logo (Preparado para futuro) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-warning/10 rounded-lg">
              <FiImage className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-white">Logo para Comprobantes</h2>
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-lg p-6 text-center">
            <FiImage className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
            <p className="text-dark-textSecondary mb-2">
              Función de carga de logo disponible próximamente
            </p>
            <p className="text-xs text-dark-textMuted">
              Podrás subir una imagen que aparecerá en los comprobantes PDF
            </p>
          </div>
        </motion.div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2 px-8"
            disabled={updateMutation.isPending}
          >
            <FiSave className="w-5 h-5" />
            Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigurationPage;
