/**
 * EasyShop - Camada de Apresentação (Tela Informativa de Arquitetura)
 * 
 * Demonstra a fundamentação teórica e técnica da aplicação:
 * - Cenário da Startup EasyShop
 * - Arquitetura de Persistência Poliglota (SQL + NoSQL simultâneos no mesmo dispositivo)
 * - Padrão Arquitetural em 3 Camadas (Apresentação, Negócio, Acesso a Dados)
 * - Botão de carga de dados de demonstração (Seed) para auxílio na gravação do vídeo
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomerService } from '@/business/services/CustomerService';
import { ProductService } from '@/business/services/ProductService';

const customerService = new CustomerService();
const productService = new ProductService();

export default function ArchitectureScreen() {
  const [seeding, setSeeding] = useState<boolean>(false);

  const handleSeedDemoData = async () => {
    try {
      setSeeding(true);

      // Carga de Clientes no Banco Relacional SQL (SQLite)
      await customerService.registerCustomer({
        name: 'Ana Paula Souza',
        email: 'ana.souza@easyshop.com',
      }).catch(() => {});

      await customerService.registerCustomer({
        name: 'Carlos Eduardo Lima',
        email: 'carlos.lima@easyshop.com',
      }).catch(() => {});

      await customerService.registerCustomer({
        name: 'Beatriz Martins',
        email: 'beatriz.martins@easyshop.com',
      }).catch(() => {});

      // Carga de Produtos com Atributos Dinâmicos Heterogêneos no Banco NoSQL
      await productService.registerProduct({
        name: 'Smartphone Galaxy S24 Ultra',
        price: 5899.0,
        category: 'Eletrônicos',
        attributes: {
          Cor: 'Titânio Cinza',
          Armazenamento: '512 GB',
          RAM: '12 GB',
          Garantia: '12 meses',
          Conectividade: '5G / Wi-Fi 7',
        },
        tags: ['smartphone', 'galaxy', 'top-de-linha'],
      }).catch(() => {});

      await productService.registerProduct({
        name: 'Camisa Polo Casual Slim',
        price: 129.9,
        category: 'Vestuário',
        attributes: {
          Cor: 'Azul Marinho',
          Tamanho: 'G',
          Tecido: '100% Algodão Pima',
          Gola: 'Polo com Botões',
        },
        tags: ['moda', 'polo', 'casual'],
      }).catch(() => {});

      await productService.registerProduct({
        name: 'Livro: Padrões de Arquitetura de Software',
        price: 89.9,
        category: 'Livros',
        attributes: {
          Autor: 'Martin Fowler',
          Páginas: '540',
          Idioma: 'Português',
          Acabamento: 'Capa Dura',
          ISBN: '978-8575225509',
        },
        tags: ['arquitetura', 'engenharia', 'tecnologia'],
      }).catch(() => {});

      Alert.alert(
        'Dados Carregados!',
        'Dados de demonstração inseridos com sucesso nos bancos SQL e NoSQL. Verifique as abas de Clientes e Produtos!'
      );
    } catch (err: any) {
      Alert.alert('Aviso', err?.message || 'Falha ao inserir dados de teste.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Persistência Poliglota</Text>
        </View>
        <Text style={styles.title}>Startup EasyShop</Text>
        <Text style={styles.subtitle}>
          Dois bancos de dados locais simultâneos no mesmo dispositivo móvel
        </Text>
      </View>

      {/* Botão de Carga de Dados (Demo / Gravação de Vídeo) */}
      <View style={styles.seedCard}>
        <View style={styles.seedInfo}>
          <Ionicons name="sparkles" size={20} color="#f59e0b" />
          <View style={{ flex: 1 }}>
            <Text style={styles.seedTitle}>Carga Rápida de Demonstração (Seed)</Text>
            <Text style={styles.seedSubtitle}>
              Insere automaticamente clientes no SQL e produtos com atributos variados no NoSQL para facilitar a gravação do vídeo.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.seedButton, seeding && styles.seedButtonDisabled]}
          onPress={handleSeedDemoData}
          disabled={seeding}
          activeOpacity={0.8}
        >
          {seeding ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={16} color="#ffffff" />
              <Text style={styles.seedButtonText}>Popular Bancos com Exemplos</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Seção 1: O Desafio */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="business-outline" size={20} color="#1e40af" />
          <Text style={styles.cardTitle}>1. O Desafio da Startup</Text>
        </View>
        <Text style={styles.cardText}>
          O sistema antigo centralizava todos os dados em um único banco relacional.
          Isso causava gargalos de desempenho e frequentes problemas de manutenção
          ao lidar com os atributos heterogêneos de produtos (tamanhos, cores, voltagens, fichas técnicas).
        </Text>
        <Text style={[styles.cardText, { marginTop: 6 }]}>
          A solução adotada foi dividir a responsabilidade de persistência entre dois bancos especializados.
        </Text>
      </View>

      {/* Seção 2: Divisão dos Bancos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="git-branch-outline" size={20} color="#059669" />
          <Text style={styles.cardTitle}>2. Persistência Poliglota no Dispositivo</Text>
        </View>

        {/* SQL Box */}
        <View style={styles.subBoxSql}>
          <View style={styles.boxTitleRow}>
            <Ionicons name="server-outline" size={16} color="#1e40af" />
            <Text style={styles.boxTitleSql}>Banco SQL (SQLite Local)</Text>
          </View>
          <Text style={styles.boxText}>
            • <Text style={styles.bold}>Entidade:</Text> Clientes (Nome Completo e E-mail)
          </Text>
          <Text style={styles.boxText}>
            • <Text style={styles.bold}>Garantias:</Text> Transações ACID, integridade relacional, restrições UNIQUE e validação rígida de schema.
          </Text>
          <Text style={styles.boxText}>
            • <Text style={styles.bold}>Localização:</Text> Arquivo relacional nativo `easyshop_relational.db`.
          </Text>
        </View>

        {/* NoSQL Box */}
        <View style={styles.subBoxNoSql}>
          <View style={styles.boxTitleRow}>
            <Ionicons name="documents-outline" size={16} color="#065f46" />
            <Text style={styles.boxTitleNoSql}>Banco NoSQL (Baseado em Documentos)</Text>
          </View>
          <Text style={styles.boxText}>
            • <Text style={styles.bold}>Entidade:</Text> Catálogo de Produtos
          </Text>
          <Text style={styles.boxText}>
            • <Text style={styles.bold}>Garantias:</Text> Schema flexível (schema-less), documentos JSON independentes, atributos heterogêneos sem migrations DDL.
          </Text>
          <Text style={styles.boxText}>
            • <Text style={styles.bold}>Localização:</Text> Coleção orientada a documentos `products` com UUIDs únicos.
          </Text>
        </View>
      </View>

      {/* Seção 3: Arquitetura em 3 Camadas */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="layers-outline" size={20} color="#7c3aed" />
          <Text style={styles.cardTitle}>3. Arquitetura em 3 Camadas</Text>
        </View>
        <Text style={styles.cardText}>
          O código segue rigorosa separação de responsabilidades:
        </Text>

        <View style={styles.layerRow}>
          <View style={styles.layerBadge}>
            <Text style={styles.layerBadgeText}>Camada 1</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.layerName}>Apresentação (UI / Views / ViewModels)</Text>
            <Text style={styles.layerDesc}>
              Telas e componentes (`src/app`, `src/presentation`). Não contém nenhuma query ou chamada direta a bancos.
            </Text>
          </View>
        </View>

        <View style={styles.layerRow}>
          <View style={[styles.layerBadge, { backgroundColor: '#e0e7ff' }]}>
            <Text style={[styles.layerBadgeText, { color: '#4338ca' }]}>Camada 2</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.layerName}>Negócio / Serviços (Business / Services)</Text>
            <Text style={styles.layerDesc}>
              Orquestra regras, validações estritas (e-mail, nome, preços) e sanitização (`CustomerService`, `ProductService`).
            </Text>
          </View>
        </View>

        <View style={styles.layerRow}>
          <View style={[styles.layerBadge, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.layerBadgeText, { color: '#b45309' }]}>Camada 3</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.layerName}>Acesso a Dados (Data / Repositories / DAOs)</Text>
            <Text style={styles.layerDesc}>
              Comunicação exclusiva com os bancos: `CustomerSqlRepository` (SQLite) e `ProductNoSqlRepository` (Document Store).
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730a3',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  seedCard: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  seedInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  seedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
  },
  seedSubtitle: {
    fontSize: 12,
    color: '#b45309',
    marginTop: 2,
    lineHeight: 16,
  },
  seedButton: {
    backgroundColor: '#d97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  seedButtonDisabled: {
    backgroundColor: '#fcd34d',
  },
  seedButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  cardText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  subBoxSql: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  subBoxNoSql: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 12,
  },
  boxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  boxTitleSql: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
  },
  boxTitleNoSql: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065f46',
  },
  boxText: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 4,
    lineHeight: 17,
  },
  bold: {
    fontWeight: '700',
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  layerBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  layerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991b1b',
  },
  layerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  layerDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
});
