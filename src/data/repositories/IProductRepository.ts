/**
 * EasyShop - Camada de Acesso a Dados (Interface do Repositório NoSQL de Produtos)
 * 
 * Contrato de persistência para a entidade ProductDocument no banco NoSQL baseado em documentos.
 */

import { CreateProductDTO, ProductDocument } from '../models/Product';

export interface IProductRepository {
  /**
   * Insere um novo documento de produto no banco NoSQL.
   */
  create(data: CreateProductDTO): Promise<ProductDocument>;

  /**
   * Retorna todos os documentos da coleção de produtos.
   */
  findAll(): Promise<ProductDocument[]>;

  /**
   * Busca um produto pelo seu _id único (UUID).
   */
  findById(id: string): Promise<ProductDocument | null>;

  /**
   * Busca produtos que pertencem a uma categoria.
   */
  findByCategory(category: string): Promise<ProductDocument[]>;

  /**
   * Realiza busca textual em nomes, categorias ou atributos dinâmicos.
   */
  search(query: string): Promise<ProductDocument[]>;

  /**
   * Remove um documento de produto pelo seu _id.
   */
  delete(id: string): Promise<boolean>;

  /**
   * Retorna a quantidade total de documentos na coleção.
   */
  count(): Promise<number>;
}
