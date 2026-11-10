/**
 * EasyShop - Camada de Acesso a Dados (Repositório SQL de Clientes)
 * 
 * Implementação do repositório de clientes utilizando comandos SQL puros
 * sobre o SQLiteDatabase local.
 * Responsabilidades:
 * - Execução de DMLs: INSERT, SELECT, DELETE.
 * - Validação e tratamento de violação de chave UNIQUE no banco.
 * - Mapeamento das tuplas relacionais retornadas pelo SQLite para objetos Customer.
 */

import { SQLiteDatabase } from '../database/sqlite/SQLiteDatabase';
import { CreateCustomerDTO, Customer } from '../models/Customer';
import { ICustomerRepository } from './ICustomerRepository';

export class CustomerSqlRepository implements ICustomerRepository {
  public async create(data: CreateCustomerDTO): Promise<Customer> {
    const db = await SQLiteDatabase.getInstance();

    try {
      const result = await db.runAsync(
        'INSERT INTO customers (name, email) VALUES (?, ?);',
        [data.name.trim(), data.email.trim().toLowerCase()]
      );

      const insertedId = result.lastInsertRowId;

      const createdCustomer = await db.getFirstAsync<Customer>(
        'SELECT id, name, email, created_at as createdAt FROM customers WHERE id = ?;',
        [insertedId]
      );

      if (!createdCustomer) {
        throw new Error('Falha ao recuperar o cliente recém-inserido do banco SQL.');
      }

      return createdCustomer;
    } catch (error: any) {
      // Identifica violação de unicidade do e-mail no SQLite
      if (error?.message && error.message.includes('UNIQUE constraint failed')) {
        throw new Error(`O e-mail "${data.email}" já está cadastrado no banco relacional (violação de UNIQUE).`);
      }
      throw error;
    }
  }

  public async findAll(): Promise<Customer[]> {
    const db = await SQLiteDatabase.getInstance();
    const rows = await db.getAllAsync<Customer>(
      'SELECT id, name, email, created_at as createdAt FROM customers ORDER BY id DESC;'
    );
    return rows;
  }

  public async findById(id: number): Promise<Customer | null> {
    const db = await SQLiteDatabase.getInstance();
    const row = await db.getFirstAsync<Customer>(
      'SELECT id, name, email, created_at as createdAt FROM customers WHERE id = ?;',
      [id]
    );
    return row || null;
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    const db = await SQLiteDatabase.getInstance();
    const row = await db.getFirstAsync<Customer>(
      'SELECT id, name, email, created_at as createdAt FROM customers WHERE LOWER(email) = LOWER(?);',
      [email.trim().toLowerCase()]
    );
    return row || null;
  }

  public async delete(id: number): Promise<boolean> {
    const db = await SQLiteDatabase.getInstance();
    const result = await db.runAsync('DELETE FROM customers WHERE id = ?;', [id]);
    return result.changes > 0;
  }

  public async count(): Promise<number> {
    const db = await SQLiteDatabase.getInstance();
    const row = await db.getFirstAsync<{ total: number }>(
      'SELECT COUNT(*) as total FROM customers;'
    );
    return row?.total ?? 0;
  }
}
