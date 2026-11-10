/**
 * EasyShop - Camada de Acesso a Dados (Repositório NoSQL de Produtos)
 * 
 * Implementação do repositório de produtos utilizando a coleção NoSQL baseada em documentos.
 * Responsabilidades:
 * - Persistência direta em formato de documento JSON.
 * - Suporte a atributos dinâmicos heterogêneos sem esquema rígido.
 * - Operações de CRUD orientadas a documento.
 */

import { DocumentCollection, DocumentDatabase } from '../database/nosql/DocumentDatabase';
import { CreateProductDTO, ProductDocument } from '../models/Product';
import { IProductRepository } from './IProductRepository';

export class ProductNoSqlRepository implements IProductRepository {
  private collection: DocumentCollection<ProductDocument>;

  constructor() {
    this.collection = DocumentDatabase.getCollection<ProductDocument>('products');
  }

  public async create(data: CreateProductDTO): Promise<ProductDocument> {
    const documentToInsert: Omit<ProductDocument, '_id' | 'createdAt' | 'updatedAt'> = {
      name: data.name.trim(),
      price: Number(data.price),
      category: data.category?.trim() || undefined,
      attributes: data.attributes || {},
      tags: data.tags || [],
    };

    return this.collection.insert(documentToInsert);
  }

  public async findAll(): Promise<ProductDocument[]> {
    return this.collection.findAll();
  }

  public async findById(id: string): Promise<ProductDocument | null> {
    return this.collection.findById(id);
  }

  public async findByCategory(category: string): Promise<ProductDocument[]> {
    const normalized = category.trim().toLowerCase();
    return this.collection.find(
      (doc) => doc.category?.trim().toLowerCase() === normalized
    );
  }

  public async search(query: string): Promise<ProductDocument[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return this.findAll();
    }

    return this.collection.find((doc) => {
      // Busca no nome do produto
      if (doc.name.toLowerCase().includes(normalized)) return true;

      // Busca na categoria
      if (doc.category && doc.category.toLowerCase().includes(normalized)) return true;

      // Busca nas tags
      if (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(normalized))) return true;

      // Busca dinâmica nas chaves e valores dos atributos do documento NoSQL
      if (doc.attributes) {
        for (const [key, value] of Object.entries(doc.attributes)) {
          if (key.toLowerCase().includes(normalized)) return true;
          if (String(value).toLowerCase().includes(normalized)) return true;
        }
      }

      return false;
    });
  }

  public async delete(id: string): Promise<boolean> {
    return this.collection.delete(id);
  }

  public async count(): Promise<number> {
    return this.collection.count();
  }
}
