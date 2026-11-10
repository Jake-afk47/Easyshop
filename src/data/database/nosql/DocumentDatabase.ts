/**
 * EasyShop - Camada de Acesso a Dados (NoSQL Baseado em Documentos)
 * 
 * Engine de Banco de Dados NoSQL embarcado localmente (estilo LiteDB / TinyDB / NeDB).
 * Características fundamentais:
 * 1. Baseado em Documentos (Document Store): armazena e recupera objetos JSON completos.
 * 2. Schema-less / Esquema Flexível: cada documento pode conter campos, tipos e estruturas
 *    dinâmicas totalmente distintas, sem necessidade de alterações estruturais (DDL/ALTER TABLE).
 * 3. Identificador de Documento: atribui um _id (UUID) único a cada documento.
 * 4. Persistência Local: armazena as coleções localmente no dispositivo via armazenamento assíncrono.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

export interface BaseDocument {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class DocumentCollection<T extends BaseDocument> {
  private readonly storageKey: string;

  constructor(public readonly name: string) {
    this.storageKey = `@easyshop:nosql:collection:${name}`;
  }

  /**
   * Lê todos os documentos da coleção diretamente da persistência local.
   */
  private async readAllDocuments(): Promise<T[]> {
    try {
      const raw = await AsyncStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }
      return JSON.parse(raw) as T[];
    } catch (error) {
      console.error(`[DocumentCollection:${this.name}] Erro ao ler documentos:`, error);
      return [];
    }
  }

  /**
   * Persiste o array atualizado de documentos no armazenamento local.
   */
  private async writeAllDocuments(docs: T[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(docs));
    } catch (error) {
      console.error(`[DocumentCollection:${this.name}] Erro ao gravar documentos:`, error);
      throw error;
    }
  }

  /**
   * Insere um novo documento na coleção NoSQL.
   * Atribui automaticamente um UUID para o documento e timestamps.
   */
  public async insert(doc: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const documents = await this.readAllDocuments();

    const newDocument = {
      ...doc,
      _id: Crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as T;

    documents.unshift(newDocument);
    await this.writeAllDocuments(documents);

    return newDocument;
  }

  /**
   * Retorna todos os documentos presentes na coleção.
   */
  public async findAll(): Promise<T[]> {
    return this.readAllDocuments();
  }

  /**
   * Busca um documento específico pelo seu identificador único (_id).
   */
  public async findById(id: string): Promise<T | null> {
    const documents = await this.readAllDocuments();
    const found = documents.find((doc) => doc._id === id);
    return found || null;
  }

  /**
   * Executa uma consulta flexível filtrando documentos por predicado.
   */
  public async find(predicate: (doc: T) => boolean): Promise<T[]> {
    const documents = await this.readAllDocuments();
    return documents.filter(predicate);
  }

  /**
   * Atualiza parcialmente um documento preservando campos dinâmicos existentes.
   */
  public async update(id: string, partial: Partial<T>): Promise<T | null> {
    const documents = await this.readAllDocuments();
    const index = documents.findIndex((doc) => doc._id === id);

    if (index === -1) {
      return null;
    }

    const updated = {
      ...documents[index],
      ...partial,
      _id: id,
      updatedAt: new Date().toISOString(),
    };

    documents[index] = updated;
    await this.writeAllDocuments(documents);

    return updated;
  }

  /**
   * Remove um documento da coleção pelo seu identificador (_id).
   */
  public async delete(id: string): Promise<boolean> {
    const documents = await this.readAllDocuments();
    const filtered = documents.filter((doc) => doc._id !== id);

    if (filtered.length === documents.length) {
      return false;
    }

    await this.writeAllDocuments(filtered);
    return true;
  }

  /**
   * Retorna a contagem de documentos da coleção.
   */
  public async count(): Promise<number> {
    const documents = await this.readAllDocuments();
    return documents.length;
  }

  /**
   * Limpa todos os documentos da coleção NoSQL.
   */
  public async clear(): Promise<void> {
    await AsyncStorage.removeItem(this.storageKey);
  }
}

/**
 * Gerenciador do Banco NoSQL Local (Document Database Manager)
 */
export class DocumentDatabase {
  private static collections = new Map<string, DocumentCollection<any>>();

  /**
   * Obtém ou inicializa uma coleção NoSQL por nome.
   */
  public static getCollection<T extends BaseDocument>(name: string): DocumentCollection<T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new DocumentCollection<T>(name));
    }
    return this.collections.get(name) as DocumentCollection<T>;
  }
}
