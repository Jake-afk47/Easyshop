/**
 * EasyShop - Camada de Negócio (Validador de Produtos)
 * 
 * Regras de validação de negócio para o catálogo de produtos:
 * 1. Nome do produto obrigatório.
 * 2. Preço numérico obrigatório e estritamente positivo (> 0).
 * 3. Validação e sanitização dos atributos dinâmicos do documento.
 */

import { CreateProductDTO } from '@/data/models/Product';
import { ValidationResult } from './customerValidator';

export function validateProduct(data: CreateProductDTO): ValidationResult {
  const errors: Record<string, string> = {};

  const name = data.name ? data.name.trim() : '';
  const price = Number(data.price);

  // Validação do Nome
  if (!name) {
    errors.name = 'O nome do produto é obrigatório.';
  } else if (name.length < 2) {
    errors.name = 'O nome do produto deve ter no mínimo 2 caracteres.';
  }

  // Validação de Preço
  if (data.price === undefined || data.price === null || isNaN(price)) {
    errors.price = 'Informe um preço válido.';
  } else if (price <= 0) {
    errors.price = 'O preço deve ser maior que zero (R$ 0,00).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
