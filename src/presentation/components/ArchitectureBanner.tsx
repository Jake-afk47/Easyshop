/**
 * EasyShop - Camada de Apresentação
 * 
 * Banner explicativo sobre a Arquitetura em 3 Camadas e Persistência Poliglota.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ArchitectureBanner() {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="layers-outline" size={18} color="#4f46e5" />
          <Text style={styles.headerTitle}>Startup EasyShop • Arquitetura 3 Camadas</Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={18}
          color="#64748b"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Persistência Poliglota:</Text> O app opera simultaneamente com
            dois bancos locais no mesmo dispositivo:
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.miniBadge, { backgroundColor: '#dbeafe' }]}>
              <Text style={[styles.miniBadgeText, { color: '#1d4ed8' }]}>
                SQL: Clientes (Relacional / ACID)
              </Text>
            </View>
            <View style={[styles.miniBadge, { backgroundColor: '#d1fae5' }]}>
              <Text style={[styles.miniBadgeText, { color: '#047857' }]}>
                NoSQL: Produtos (Documentos / Dinâmico)
              </Text>
            </View>
          </View>

          <View style={styles.layerBox}>
            <Text style={styles.layerStep}>1. Apresentação (UI / Views / Hooks)</Text>
            <Text style={styles.arrow}>↓</Text>
            <Text style={styles.layerStep}>2. Negócio / Serviços (Validações & Regras)</Text>
            <Text style={styles.arrow}>↓</Text>
            <Text style={styles.layerStep}>3. Acesso a Dados (DAOs / Repositories)</Text>
          </View>
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  content: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  paragraph: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 8,
  },
  miniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  layerBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  layerStep: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 10,
    color: '#94a3b8',
    marginVertical: 2,
    textAlign: 'center',
  },
});
