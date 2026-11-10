/**
 * EasyShop - Camada de Apresentação (Hook de Produtos / ViewModel)
 * 
 * Gerencia o estado de interface dos produtos e interage exclusivamente
 * com a camada de negócio (ProductService).
 * Não contém nenhuma instrução NoSQL ou acesso direto ao armazenamento.
 */

import { useCallback, useEffect, useState } from 'react';
import { ProductService } from '@/business/services/ProductService';
import { CreateProductDTO, ProductDocument } from '@/data/models/Product';

const productService = new ProductService();

export function useProducts() {
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadProducts = useCallback(async (query: string = '') => {
    try {
      setError(null);
      const data = query.trim()
        ? await productService.searchProducts(query)
        : await productService.getAllProducts();
      const count = await productService.getProductCount();

      setProducts(data);
      setTotalCount(count);
    } catch (err: any) {
      console.error('[useProducts] Erro ao carregar produtos:', err);
      setError(err?.message || 'Falha ao consultar catálogo NoSQL.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts(searchQuery);
  }, [loadProducts, searchQuery]);

  const addProduct = useCallback(
    async (dto: CreateProductDTO) => {
      try {
        setError(null);
        const created = await productService.registerProduct(dto);
        await loadProducts(searchQuery);
        return created;
      } catch (err: any) {
        const message = err?.message || 'Erro ao cadastrar produto.';
        setError(message);
        throw new Error(message);
      }
    },
    [loadProducts, searchQuery]
  );

  const removeProduct = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await productService.removeProduct(id);
        await loadProducts(searchQuery);
      } catch (err: any) {
        const message = err?.message || 'Erro ao remover produto.';
        setError(message);
        throw new Error(message);
      }
    },
    [loadProducts, searchQuery]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setSearchQuery(term);
      loadProducts(term);
    },
    [loadProducts]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    refreshing,
    error,
    totalCount,
    searchQuery,
    loadProducts,
    handleRefresh,
    addProduct,
    removeProduct,
    handleSearch,
    clearError: () => setError(null),
  };
}
