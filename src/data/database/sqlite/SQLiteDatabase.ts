/**
 * EasyShop - Camada de Acesso a Dados (SQL Relacional)
 * 
 * Gerenciador de conexão com o banco de dados SQLite local.
 * Responsável por:
 * 1. Estabelecer e manter a conexão local com o arquivo de banco relacional.
 * 2. Criar e versionar o esquema rígido (DDL) da tabela de clientes.
 * 3. Garantir integridade relacional, restrições UNIQUE e NOT NULL.
 */

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'easyshop_relational.db';

export class SQLiteDatabase {
  private static instance: SQLite.SQLiteDatabase | null = null;
  private static initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

  /**
   * Obtém a instância única de conexão com o SQLite (Singleton).
   * Executa as migrations estruturais para garantir o schema relacional.
   */
  public static async getInstance(): Promise<SQLite.SQLiteDatabase> {
    if (this.instance) {
      return this.instance;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

        // Configuração de performance e integridade relacional
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          PRAGMA foreign_keys = ON;

          -- Tabela relacional com validação estrita e chave única
          CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        this.instance = db;
        return db;
      } catch (error) {
        console.error('[SQLiteDatabase] Erro ao inicializar SQLite:', error);
        throw error;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Fecha a conexão atual (útil para testes ou reinicialização).
   */
  public static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.closeAsync();
      this.instance = null;
    }
  }
}
