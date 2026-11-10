/**
 * EasyShop - Camada de Acesso a Dados (Model Relacional)
 * 
 * Modelo de Cliente para o Banco SQL Relacional (SQLite).
 * Possui esquema estrito (schema rígido) com campos bem definidos:
 * - id: Identificador inteiro relacional autoincremento
 * - name: Nome completo do cliente (NOT NULL)
 * - email: E-mail único e estritamente validado (NOT NULL UNIQUE)
 * - createdAt: Timestamp de registro (DEFAULT CURRENT_TIMESTAMP)
 */

export interface Customer {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
}
