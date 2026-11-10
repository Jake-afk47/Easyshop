/**
 * EasyShop - Camada de Apresentação
 * 
 * Componente de identificação visual do banco de dados em uso na tela.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DatabaseBadgeProps {
  type: 'sql' | 'nosql';
  recordCount?: number;
}

export function DatabaseBadge({ type, recordCount }: DatabaseBadgeProps) {
  const isSql = type === 'sql';

  return (
    <View style={[styles.container, isSql ? styles.sqlContainer : styles.nosqlContainer]}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name={isSql ? 'server-outline' : 'documents-outline'}
          size={16}
          color={isSql ? '#1e40af' : '#065f46'}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isSql ? styles.sqlText : styles.nosqlText]}>
          {isSql ? 'Banco SQL Relacional (SQLite)' : 'Banco NoSQL Documentos (Document Store)'}
        </Text>
        <Text style={styles.subtitle}>
          {isSql
            ? `Schema Rígido • Tabela "customers"${recordCount !== undefined ? ` • ${recordCount} registros` : ''}`
            : `Schema Flexível • Coleção "products"${recordCount !== undefined ? ` • ${recordCount} documentos` : ''}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 6,
  },
  sqlContainer: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  nosqlContainer: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  iconWrapper: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  sqlText: {
    color: '#1e40af',
  },
  nosqlText: {
    color: '#065f46',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
});
