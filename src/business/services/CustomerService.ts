/**
 * EasyShop - Camada de Negócio / Serviços (CustomerService)
 * 
 * Orquestra as regras de negócio aplicadas aos Clientes:
 * - Validação estrita dos dados antes do envio ao banco relacional.
 * - Verificação de duplicidade de e-mail a nível de negócio.
 * - Tratamento amigável de erros e normalização dos dados.
 * - Desacoplamento completo entre a Apresentação e o Banco SQL.
 */

import { CreateCustomerDTO, Customer } from '@/data/models/Customer';
import { CustomerSqlRepository } from '@/data/repositories/CustomerSqlRepository';
import { ICustomerRepository } from '@/data/repositories/ICustomerRepository';
import { validateCustomer } from '../validators/customerValidator';

export class CustomerService {
  private repository: ICustomerRepository;

  constructor(repository: ICustomerRepository = new CustomerSqlRepository()) {
    this.repository = repository;
  }

  /**
   * Cadastra um novo cliente executando validação de regras de negócio
   * e persistência no banco SQL relacional.
   */
  public async registerCustomer(data: CreateCustomerDTO): Promise<Customer> {
    const validation = validateCustomer(data);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedName = data.name.trim();

    // Regra de negócio: verificação prévia de duplicidade de e-mail
    const existing = await this.repository.findByEmail(normalizedEmail);
    if (existing) {
      throw new Error(`Já existe um cliente cadastrado com o e-mail "${normalizedEmail}".`);
    }

    return this.repository.create({
      name: normalizedName,
      email: normalizedEmail,
    });
  }

  /**
   * Obtém a listagem completa de clientes diretamente do banco SQL.
   */
  public async getAllCustomers(): Promise<Customer[]> {
    return this.repository.findAll();
  }

  /**
   * Remove um cliente pelo ID.
   */
  public async removeCustomer(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de cliente inválido para exclusão.');
    }
    return this.repository.delete(id);
  }

  /**
   * Retorna a contagem atual de clientes na tabela SQL.
   */
  public async getCustomerCount(): Promise<number> {
    return this.repository.count();
  }
}
