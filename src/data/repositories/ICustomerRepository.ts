/**
 * EasyShop - Camada de Acesso a Dados (Interface do Repositório de Clientes)
 * 
 * Contrato de persistência para a entidade Customer no banco relacional SQL.
 */

import { CreateCustomerDTO, Customer } from '../models/Customer';

export interface ICustomerRepository {
  /**
   * Insere um novo cliente no banco SQL.
   */
  create(data: CreateCustomerDTO): Promise<Customer>;

  /**
   * Consulta e retorna todos os clientes cadastrados no banco SQL.
   */
  findAll(): Promise<Customer[]>;

  /**
   * Busca um cliente pelo ID relacional.
   */
  findById(id: number): Promise<Customer | null>;

  /**
   * Busca um cliente pelo e-mail único.
   */
  findByEmail(email: string): Promise<Customer | null>;

  /**
   * Remove um cliente pelo ID.
   */
  delete(id: number): Promise<boolean>;

  /**
   * Retorna a quantidade total de registros na tabela.
   */
  count(): Promise<number>;
}
