/**
 * EasyShop - Camada de Negócio / Serviços (ProductService)
 * 
 * Orquestra as regras de negócio aplicadas ao Catálogo de Produtos:
 * - Validação de preços e nomes.
 * - Sanitização e formatação de atributos dinâmicos do documento NoSQL.
 * - Suporte a filtros de busca flexíveis.
 * - Desacoplamento completo entre a Apresentação e o Banco NoSQL.
 */

import { CreateProductDTO, DynamicValue, ProductDocument } from '@/data/models/Product';
import { IProductRepository } from '@/data/repositories/IProductRepository';
import { ProductNoSqlRepository } from '@/data/repositories/ProductNoSqlRepository';
import { validateProduct } from '../validators/productValidator';

export class ProductService {
  private repository: IProductRepository;

  constructor(repository: IProductRepository = new ProductNoSqlRepository()) {
    this.repository = repository;
  }

  /**
   * Cadastra um novo produto no banco NoSQL baseado em documentos.
   */
  public async registerProduct(data: CreateProductDTO): Promise<ProductDocument> {
    const validation = validateProduct(data);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    // Sanitiza e limpa atributos dinâmicos vazios
    const cleanedAttributes: Record<string, DynamicValue> = {};
    if (data.attributes) {
      for (const [key, value] of Object.entries(data.attributes)) {
        const trimmedKey = key.trim();
        if (trimmedKey && value !== undefined && value !== null && value !== '') {
          cleanedAttributes[trimmedKey] = typeof value === 'string' ? value.trim() : value;
        }
      }
    }

    // Sanitiza tags
    const cleanedTags = (data.tags || [])
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    return this.repository.create({
      name: data.name.trim(),
      price: Number(data.price),
      category: data.category?.trim() || undefined,
      attributes: cleanedAttributes,
      tags: cleanedTags,
    });
  }

  /**
   * Obtém todos os produtos cadastrados no banco NoSQL.
   */
  public async getAllProducts(): Promise<ProductDocument[]> {
    return this.repository.findAll();
  }

  /**
   * Realiza busca textual em produtos (nome, categoria ou atributos dinâmicos).
   */
  public async searchProducts(query: string): Promise<ProductDocument[]> {
    return this.repository.search(query);
  }

  /**
   * Remove um produto pelo seu _id NoSQL.
   */
  public async removeProduct(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Identificador de documento inválido.');
    }
    return this.repository.delete(id);
  }

  /**
   * Retorna a contagem atual de produtos cadastrados no NoSQL.
   */
  public async getProductCount(): Promise<number> {
    return this.repository.count();
  }
}
