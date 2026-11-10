/**
 * EasyShop - Camada de Apresentação (Tela de Clientes - SQL Local)
 * 
 * Seção 1 do Desafio:
 * - Formulário para inclusão de clientes (Nome Completo e E-mail).
 * - Listagem dos clientes cadastrados consultando o banco SQL relacional (SQLite).
 * - Não contém comandos SQL diretamente; consome useCustomers (ViewModel).
 */

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArchitectureBanner } from '@/presentation/components/ArchitectureBanner';
import { CustomerCard } from '@/presentation/components/CustomerCard';
import { CustomerForm } from '@/presentation/components/CustomerForm';
import { DatabaseBadge } from '@/presentation/components/DatabaseBadge';
import { useCustomers } from '@/presentation/hooks/useCustomers';

export default function CustomersScreen() {
  const {
    customers,
    loading,
    refreshing,
    error,
    totalCount,
    handleRefresh,
    addCustomer,
    removeCustomer,
  } = useCustomers();

  return (
    <View style={styles.container}>
      <FlatList
        data={customers}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            <ArchitectureBanner />

            <DatabaseBadge type="sql" recordCount={totalCount} />

            <CustomerForm onSubmit={addCustomer} />

            <View style={styles.listHeaderRow}>
              <View style={styles.listHeaderTitleContainer}>
                <Ionicons name="list-outline" size={18} color="#1e40af" />
                <Text style={styles.listHeaderTitle}>
                  Clientes no SQLite ({totalCount})
                </Text>
              </View>
              <Text style={styles.listHeaderSubtitle}>
                Dados relacionais com chave primária e restrição UNIQUE
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
                <ActivityIndicator size="small" color="#1e40af" />
                <Text style={styles.loadingText}>Consultando SQLite...</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <CustomerCard customer={item} onDelete={removeCustomer} />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>Nenhum cliente cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                Preencha o formulário acima para inserir o primeiro registro na tabela relacional.
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
  listHeaderRow: {
    marginTop: 8,
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
