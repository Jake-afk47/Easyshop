/**
 * EasyShop - Camada de Apresentação (Formulário de Produtos NoSQL)
 * 
 * Formulário para inserção de documentos no catálogo NoSQL.
 * Campos: Nome, Preço, Categoria e Atributos Dinâmicos opcionais.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreateProductDTO, DynamicValue } from '@/data/models/Product';
import { DynamicAttributeEditor } from './DynamicAttributeEditor';

interface ProductFormProps {
  onSubmit: (dto: CreateProductDTO) => Promise<any>;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [attributes, setAttributes] = useState<Record<string, DynamicValue>>({});
  const [tagsInput, setTagsInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);

    if (!name.trim()) {
      setLocalError('Informe o nome do produto.');
      return;
    }

    const parsedPrice = parseFloat(price.replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setLocalError('Informe um preço numérico válido e maior que zero.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      await onSubmit({
        name: name.trim(),
        price: parsedPrice,
        category: category.trim() || undefined,
        attributes,
        tags,
      });

      // Limpa os campos após o cadastro
      setName('');
      setPrice('');
      setCategory('');
      setAttributes({});
      setTagsInput('');
      Alert.alert('Sucesso!', 'Documento de produto salvo com sucesso no banco NoSQL!');
    } catch (err: any) {
      setLocalError(err?.message || 'Erro ao salvar produto no NoSQL.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <Ionicons name="bag-add-outline" size={20} color="#065f46" />
        <Text style={styles.formTitle}>Cadastrar Produto (NoSQL)</Text>
      </View>

      {localError && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color="#b91c1c" />
          <Text style={styles.errorText}>{localError}</Text>
        </View>
      )}

      {/* Nome */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Nome do Produto <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Tênis Esportivo UltraBoost"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          editable={!submitting}
        />
      </View>

      {/* Linha Preço e Categoria */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>
            Preço (R$) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 299.90"
            placeholderTextColor="#94a3b8"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            editable={!submitting}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1.2 }]}>
          <Text style={styles.label}>Categoria (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Calçados / Moda"
            placeholderTextColor="#94a3b8"
            value={category}
            onChangeText={setCategory}
            editable={!submitting}
          />
        </View>
      </View>

      {/* Editor de Atributos Dinâmicos */}
      <DynamicAttributeEditor
        attributes={attributes}
        onChange={setAttributes}
      />

      {/* Tags / Palavras-chave */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tags / Palavras-chave (separadas por vírgula)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: corrida, amortecimento, lançamento"
          placeholderTextColor="#94a3b8"
          value={tagsInput}
          onChangeText={setTagsInput}
          editable={!submitting}
        />
      </View>

      {/* Botão de Envio */}
      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            <Ionicons name="document-text-outline" size={18} color="#ffffff" />
            <Text style={styles.buttonText}>Inserir Documento no NoSQL</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  required: {
    color: '#dc2626',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 6,
  },
  buttonDisabled: {
    backgroundColor: '#a7f3d0',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
