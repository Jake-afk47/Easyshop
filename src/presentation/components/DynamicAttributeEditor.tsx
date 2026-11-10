/**
 * EasyShop - Camada de Apresentação (Editor de Atributos Dinâmicos NoSQL)
 * 
 * Permite ao usuário adicionar pares chave-valor flexíveis a um produto,
 * ilustrando o poder dos bancos NoSQL baseados em documentos sem esquema fixo.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DynamicValue } from '@/data/models/Product';

interface DynamicAttributeEditorProps {
  attributes: Record<string, DynamicValue>;
  onChange: (attributes: Record<string, DynamicValue>) => void;
}

const SUGGESTIONS = [
  { key: 'Cor', placeholder: 'Ex: Preto Fosco' },
  { key: 'Tamanho', placeholder: 'Ex: GG / 42' },
  { key: 'Garantia', placeholder: 'Ex: 12 meses' },
  { key: 'Voltagem', placeholder: 'Ex: Bivolt' },
  { key: 'Marca', placeholder: 'Ex: EasyTech' },
  { key: 'Armazenamento', placeholder: 'Ex: 256 GB' },
  { key: 'Material', placeholder: 'Ex: Couro Legítimo' },
];

export function DynamicAttributeEditor({ attributes, onChange }: DynamicAttributeEditorProps) {
  const [newKey, setNewKey] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  const handleAdd = () => {
    const trimmedKey = newKey.trim();
    const trimmedValue = newValue.trim();

    if (!trimmedKey || !trimmedValue) {
      return;
    }

    onChange({
      ...attributes,
      [trimmedKey]: trimmedValue,
    });

    setNewKey('');
    setNewValue('');
  };

  const handleRemove = (keyToRemove: string) => {
    const updated = { ...attributes };
    delete updated[keyToRemove];
    onChange(updated);
  };

  const handleSuggestionPress = (sugKey: string) => {
    setNewKey(sugKey);
  };

  const attributeEntries = Object.entries(attributes);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="sparkles-outline" size={16} color="#059669" />
        <Text style={styles.sectionTitle}>Atributos Dinâmicos (Schema Flexível)</Text>
      </View>
      <Text style={styles.hint}>
        Adicione características arbitrárias (chave e valor) ao documento JSON NoSQL:
      </Text>

      {/* Sugestões rápidas */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsLabel}>Sugestões:</Text>
        <View style={styles.suggestionsList}>
          {SUGGESTIONS.map((sug) => (
            <TouchableOpacity
              key={sug.key}
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress(sug.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>+ {sug.key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Inputs para nova chave-valor */}
      <View style={styles.inputsRow}>
        <TextInput
          style={[styles.input, styles.keyInput]}
          placeholder="Chave (ex: Cor)"
          placeholderTextColor="#94a3b8"
          value={newKey}
          onChangeText={setNewKey}
        />
        <TextInput
          style={[styles.input, styles.valueInput]}
          placeholder="Valor (ex: Azul)"
          placeholderTextColor="#94a3b8"
          value={newValue}
          onChangeText={setNewValue}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Lista de atributos adicionados */}
      {attributeEntries.length > 0 && (
        <View style={styles.list}>
          {attributeEntries.map(([key, value]) => (
            <View key={key} style={styles.attributeItem}>
              <View style={styles.attributeTextContainer}>
                <Text style={styles.attributeKey}>{key}:</Text>
                <Text style={styles.attributeValue}>{String(value)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(key)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065f46',
  },
  hint: {
    fontSize: 11,
    color: '#047857',
    marginBottom: 8,
  },
  suggestionsContainer: {
    marginBottom: 8,
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 4,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: '#dcfce7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  suggestionText: {
    fontSize: 11,
    color: '#065f46',
    fontWeight: '600',
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  keyInput: {
    flex: 1,
  },
  valueInput: {
    flex: 1.2,
  },
  addButton: {
    backgroundColor: '#059669',
    width: 38,
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: 10,
    gap: 6,
  },
  attributeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  attributeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  attributeKey: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
  },
  attributeValue: {
    fontSize: 12,
    color: '#1e293b',
    flex: 1,
  },
});
