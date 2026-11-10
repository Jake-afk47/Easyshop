/**
 * EasyShop - Camada de Apresentação (Hook de Clientes / ViewModel)
 * 
 * Gerencia o estado de interface dos clientes e interage exclusivamente
 * com a camada de negócio (CustomerService).
 * Não contém nenhuma instrução SQL ou referência direta ao banco de dados.
 */

import { useCallback, useEffect, useState } from 'react';
import { CustomerService } from '@/business/services/CustomerService';
import { CreateCustomerDTO, Customer } from '@/data/models/Customer';

const customerService = new CustomerService();

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const loadCustomers = useCallback(async () => {
    try {
      setError(null);
      const data = await customerService.getAllCustomers();
      const count = await customerService.getCustomerCount();
      setCustomers(data);
      setTotalCount(count);
    } catch (err: any) {
      console.error('[useCustomers] Erro ao carregar clientes:', err);
      setError(err?.message || 'Falha ao consultar clientes do banco SQL.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadCustomers();
  }, [loadCustomers]);

  const addCustomer = useCallback(
    async (dto: CreateCustomerDTO) => {
      try {
        setError(null);
        const created = await customerService.registerCustomer(dto);
        await loadCustomers();
        return created;
      } catch (err: any) {
        const message = err?.message || 'Erro ao cadastrar cliente.';
        setError(message);
        throw new Error(message);
      }
    },
    [loadCustomers]
  );

  const removeCustomer = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await customerService.removeCustomer(id);
        await loadCustomers();
      } catch (err: any) {
        const message = err?.message || 'Erro ao remover cliente.';
        setError(message);
        throw new Error(message);
      }
    },
    [loadCustomers]
  );

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    loading,
    refreshing,
    error,
    totalCount,
    loadCustomers,
    handleRefresh,
    addCustomer,
    removeCustomer,
    clearError: () => setError(null),
  };
}
