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

      {/* Créditos y Sobre el Sistema */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-dark-surface to-dark-bg border border-dark-border rounded-lg p-6"
      >
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Sistema EXMC v1.0.0</h3>
          <p className="text-dark-textSecondary max-w-2xl mx-auto">
            Sistema integral de gestión comercial con arquitectura full-stack moderna
          </p>
          
          <div className="pt-4 border-t border-dark-border">
            <p className="text-sm text-dark-textSecondary mb-2">Desarrollado por</p>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">Luciano Savoretti</p>
              <p className="text-dark-textSecondary">Dev / Sistemas / Web</p>
              <a
                href="https://www.instagram.com/devpuchito/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @devpuchito
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-dark-border">
            <p className="text-xs text-dark-textMuted">
              © 2024 Sistema EXMC. Todos los derechos reservados.
            </p>
            <p className="text-xs text-dark-textMuted mt-1">
              React 18 • TypeScript • Node.js • PostgreSQL • Prisma ORM
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfigurationPage;
