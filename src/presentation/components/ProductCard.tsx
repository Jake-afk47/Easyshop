/**
 * EasyShop - Camada de Apresentação (Card de Produto NoSQL)
 * 
 * Renderiza um documento NoSQL do produto com:
 * - Identificador único de documento (_id)
 * - Nome e Preço formatado
 * - Atributos dinâmicos heterogêneos (schema-less)
 * - Alternância para visualização da estrutura JSON pura do documento
 */

import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductDocument } from '@/data/models/Product';

interface ProductCardProps {
  product: ProductDocument;
  onDelete: (id: string) => Promise<any>;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [showJson, setShowJson] = useState<boolean>(false);

  const handleDelete = () => {
    Alert.alert(
      'Remover Documento NoSQL',
      `Deseja realmente remover o produto "${product.name}" (_id: ${product._id}) do banco NoSQL?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete(product._id);
            } catch (err: any) {
              Alert.alert('Erro', err?.message || 'Falha ao remover produto.');
            }
          },
        },
      ]
    );
  };

  const attributeEntries = Object.entries(product.attributes || {});

  return (
    <View style={styles.card}>
      {/* Topo do Card */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.docBadge}>
            <Text style={styles.docBadgeText}>NoSQL Doc</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={17} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Preço e Categoria */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>
        {product.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        )}
      </View>

      {/* ID do Documento */}
      <View style={styles.idRow}>
        <Text style={styles.idLabel}>_id:</Text>
        <Text style={styles.idValue} numberOfLines={1}>
          {product._id}
        </Text>
      </View>

      {/* Atributos Dinâmicos do NoSQL */}
      {attributeEntries.length > 0 && (
        <View style={styles.attributesSection}>
          <Text style={styles.sectionLabel}>Atributos Dinâmicos:</Text>
          <View style={styles.attributesGrid}>
            {attributeEntries.map(([key, value]) => (
              <View key={key} style={styles.attributeChip}>
                <Text style={styles.attrKey}>{key}:</Text>
                <Text style={styles.attrValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {product.tags.map((tag, idx) => (
            <View key={idx} style={styles.tagChip}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Botão para Inspecionar JSON puro do documento */}
      <TouchableOpacity
        style={styles.jsonToggle}
        onPress={() => setShowJson(!showJson)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={showJson ? 'code-slash' : 'code-outline'}
          size={14}
          color="#475569"
        />
        <Text style={styles.jsonToggleText}>
          {showJson ? 'Ocultar JSON' : 'Inspecionar Documento JSON'}
        </Text>
      </TouchableOpacity>

      {showJson && (
        <View style={styles.jsonBox}>
          <Text style={styles.jsonCode}>
            {JSON.stringify(product, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  docBadge: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  docBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065f46',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  idValue: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'monospace',
    flex: 1,
  },
  attributesSection: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attributeChip: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  attrKey: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  attrValue: {
    fontSize: 11,
    color: '#0f172a',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  tagChip: {
    backgroundColor: '#f3e8ff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#7e22ce',
    fontWeight: '600',
  },
  jsonToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  jsonToggleText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  jsonBox: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
  },
  jsonCode: {
    color: '#38bdf8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
