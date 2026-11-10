/**
 * EasyShop - Camada de Negócio (Validador de Clientes)
 * 
 * Regras de validação estrita para o cadastro relacional:
 * 1. Nome Completo obrigatório (pelo menos nome e sobrenome).
 * 2. Formato de e-mail estritamente válido segundo RFC.
 */

import { CreateCustomerDTO } from '@/data/models/Customer';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateCustomer(data: CreateCustomerDTO): ValidationResult {
  const errors: Record<string, string> = {};

  const name = data.name ? data.name.trim() : '';
  const email = data.email ? data.email.trim() : '';

  // Validação do Nome Completo
  if (!name) {
    errors.name = 'O nome completo é obrigatório.';
  } else if (name.length < 5) {
    errors.name = 'O nome deve ter no mínimo 5 caracteres.';
  } else {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length < 2) {
      errors.name = 'Por favor, informe nome e sobrenome (Nome Completo).';
    }
  }

  // Validação estrita de E-mail
  if (!email) {
    errors.email = 'O e-mail é obrigatório.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Informe um endereço de e-mail válido (ex: cliente@dominio.com).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
