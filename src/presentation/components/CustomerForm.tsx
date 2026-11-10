/**
 * EasyShop - Camada de Apresentação (Formulário de Clientes)
 * 
 * Formulário para cadastro de clientes no banco SQL relacional.
 * Campos: Nome Completo e E-mail.
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
import { CreateCustomerDTO } from '@/data/models/Customer';

interface CustomerFormProps {
  onSubmit: (dto: CreateCustomerDTO) => Promise<any>;
}

export function CustomerForm({ onSubmit }: CustomerFormProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);

    if (!name.trim()) {
      setLocalError('Informe o nome completo.');
      return;
    }

    if (!email.trim()) {
      setLocalError('Informe o e-mail do cliente.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ name: name.trim(), email: email.trim().toLowerCase() });
      setName('');
      setEmail('');
      Alert.alert('Sucesso!', 'Cliente cadastrado com sucesso no banco relacional SQL.');
    } catch (err: any) {
      setLocalError(err?.message || 'Erro ao cadastrar cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <Ionicons name="person-add-outline" size={20} color="#1e40af" />
        <Text style={styles.formTitle}>Cadastrar Cliente (SQL)</Text>
      </View>

      {localError && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color="#b91c1c" />
          <Text style={styles.errorText}>{localError}</Text>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Nome Completo <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: João da Silva Sauro"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          editable={!submitting}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          E-mail <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: joao.silva@easyshop.com"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          editable={!submitting}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.helperText}>
          Validação estrita de formato e chave UNIQUE no SQLite.
        </Text>
      </View>

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
            <Ionicons name="save-outline" size={18} color="#ffffff" />
            <Text style={styles.buttonText}>Inserir no Banco SQL</Text>
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
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
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
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  helperText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#1e40af',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 6,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
