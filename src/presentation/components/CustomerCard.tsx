/**
 * EasyShop - Camada de Apresentação (Card de Cliente SQL)
 * 
 * Exibe as informações de um cliente persistido no banco relacional SQLite.
 */

import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Customer } from '@/data/models/Customer';

interface CustomerCardProps {
  customer: Customer;
  onDelete: (id: number) => Promise<any>;
}

export function CustomerCard({ customer, onDelete }: CustomerCardProps) {
  const handleDelete = () => {
    Alert.alert(
      'Remover Cliente',
      `Deseja realmente remover o cliente "${customer.name}" (ID: ${customer.id}) do banco SQL?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete(customer.id);
            } catch (err: any) {
              Alert.alert('Erro', err?.message || 'Falha ao remover cliente.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.headerRow}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>SQL #{customer.id}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {customer.name}
          </Text>
        </View>

        <View style={styles.emailRow}>
          <Ionicons name="mail-outline" size={14} color="#64748b" />
          <Text style={styles.email} numberOfLines={1}>
            {customer.email}
          </Text>
        </View>

        {customer.createdAt && (
          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={12} color="#94a3b8" />
            <Text style={styles.dateText}>
              Cadastrado em: {new Date(customer.createdAt).toLocaleString('pt-BR')}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  leftContent: {
    flex: 1,
    paddingRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  idBadge: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e40af',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  email: {
    fontSize: 13,
    color: '#475569',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dateText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
});
