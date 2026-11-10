/**
 * EasyShop - Camada de Apresentação (Tela de Produtos - NoSQL Local)
 * 
 * Seção 2 do Desafio:
 * - Formulário para inclusão de produtos (Nome, Preço e Atributos/Categorias opcionais).
 * - Listagem dinâmica dos produtos cadastrados consultando o banco NoSQL baseado em documentos.
 * - Suporte a busca dinâmica em atributos heterogêneos.
 * - Não contém acesso direto ao banco; consome useProducts (ViewModel).
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArchitectureBanner } from '@/presentation/components/ArchitectureBanner';
import { DatabaseBadge } from '@/presentation/components/DatabaseBadge';
import { ProductCard } from '@/presentation/components/ProductCard';
import { ProductForm } from '@/presentation/components/ProductForm';
import { useProducts } from '@/presentation/hooks/useProducts';

export default function ProductsScreen() {
  const {
    products,
    loading,
    refreshing,
    error,
    totalCount,
    handleRefresh,
    addProduct,
    removeProduct,
    handleSearch,
  } = useProducts();

  const [searchInput, setSearchInput] = useState<string>('');

  const onSearchSubmit = () => {
    handleSearch(searchInput);
  };

  const onClearSearch = () => {
    setSearchInput('');
    handleSearch('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            <ArchitectureBanner />

            <DatabaseBadge type="nosql" recordCount={totalCount} />

            <ProductForm onSubmit={addProduct} />

            {/* Barra de Pesquisa NoSQL */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome, categoria ou atributo..."
                placeholderTextColor="#94a3b8"
                value={searchInput}
                onChangeText={setSearchInput}
                onSubmitEditing={onSearchSubmit}
                returnKeyType="search"
              />
              {searchInput.length > 0 && (
                <TouchableOpacity onPress={onClearSearch} style={styles.clearBtn}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onSearchSubmit} style={styles.searchBtn}>
                <Text style={styles.searchBtnText}>Filtrar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.listHeaderRow}>
              <View style={styles.listHeaderTitleContainer}>
                <Ionicons name="cube-outline" size={18} color="#059669" />
                <Text style={styles.listHeaderTitle}>
                  Catálogo de Documentos NoSQL ({products.length} de {totalCount})
                </Text>
              </View>
              <Text style={styles.listHeaderSubtitle}>
                Coleção &quot;products&quot; armazenada em formato de documento flexível (JSON)
              </Text>
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="warning-outline" size={16} color="#b91c1c" />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {loading && !refreshing && (
              <View style={styles.centerBox}>
                <ActivityIndicator size="small" color="#059669" />
                <Text style={styles.loadingText}>Consultando banco NoSQL...</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard product={item} onDelete={removeProduct} />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                {searchInput
                  ? 'Nenhum documento encontrado com o filtro aplicado. Tente outro termo.'
                  : 'Cadastre produtos com características distintas acima para explorar o schema flexível.'}
              </Text>
            </View>
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
  },
  clearBtn: {
    padding: 2,
  },
  searchBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  searchBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  listHeaderRow: {
    marginTop: 4,
    marginBottom: 10,
  },
  listHeaderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  listHeaderSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  centerBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748b',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 10,
  },
  errorBannerText: {
    color: '#b91c1c',
    fontSize: 12,
    flex: 1,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
