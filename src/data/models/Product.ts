/**
 * EasyShop - Camada de Acesso a Dados (Model NoSQL / Documento)
 * 
 * Modelo de Produto para o Banco NoSQL baseado em Documentos.
 * Diferente do SQL, não exige esquema rígido predefinido.
 * Cada documento possui:
 * - _id: Identificador único do documento (UUID)
 * - name: Nome do produto
 * - price: Preço do produto
 * - category: Categoria opcional
 * - attributes: Objeto JSON com atributos dinâmicos e heterogêneos (ex: cor, voltagem, tamanho, garantia)
 * - tags: Lista opcional de palavras-chave para busca
 * - createdAt: Timestamp de inserção do documento
 * - updatedAt: Timestamp da última modificação
 */

export type DynamicValue = string | number | boolean;

export interface ProductDocument {
  _id: string;
  name: string;
  price: number;
  category?: string;
  attributes: Record<string, DynamicValue>;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  category?: string;
  attributes?: Record<string, DynamicValue>;
  tags?: string[];
}
