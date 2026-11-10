# 🛒 EasyShop • Persistência Poliglota & Arquitetura em 3 Camadas

Sistema de mini e-commerce mobile desenvolvido em **React Native com Expo (SDK 58)** e **TypeScript**, aplicando uma **Arquitetura de Persistência Poliglota** com **dois bancos de dados locais simultâneos** no mesmo dispositivo e organização estrita em **3 camadas**.

---

## 👥 Integrantes do Projeto (Dupla / Trio)

| Nome Completo | RA / Matrícula | Função / Responsabilidade |
| :--- | :--- | :--- |
| **[Nome do Aluno 1]** | `[RA 1]` | Camada de Negócio e Repositório SQL |
| **[Nome do Aluno 2]** | `[RA 2]` | Camada de Dados NoSQL e Interface UI |
| **[Nome do Aluno 3 (Opcional)]** | `[RA 3]` | Validações, Modelos e Documentação |

---

## 🎥 Link do Vídeo Demonstrativo & Repositório

* **Repositório GitHub:** [https://github.com/Jake-afk47/Easyshop](https://github.com/Jake-afk47/Easyshop)
* **Vídeo Demonstrativo (YouTube / Google Drive):** `[Insira aqui o link do vídeo gravado no Emulador Android]`

---

## 1. 📌 Entendimento do Desafio (Cenário EasyShop)

O sistema legado da startup **EasyShop** utilizava um único banco de dados relacional para armazenar todas as informações do sistema. Com o crescimento do catálogo de produtos e a necessidade de suportar atributos dinâmicos e heterogêneos (ex: voltagem, tamanhos, cores, fichas técnicas específicas para cada tipo de mercadoria), esse modelo centralizado gerou:
* **Gargalos de desempenho** decorrentes de tabelas excessivamente normalizadas (EAV - Entity-Attribute-Value) ou tabelas esparsas com dezenas de colunas nulas;
* **Frequentes problemas de manutenção** e complexidade em migrações DDL a cada novo tipo de produto.

### A Solução: Persistência Poliglota Local
Para resolver o problema, o novo projeto utiliza **dois bancos de dados locais simultâneos no mesmo dispositivo**, dividindo as responsabilidades de acordo com a natureza de cada dado:

```
                  ┌──────────────────────────────────────────────┐
                  │       Dispositivo Móvel (EasyShop)           │
                  └──────────────────────┬───────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    Banco SQL (SQLite)     │                   │   Banco NoSQL (Document)  │
   ├───────────────────────────┤                   ├───────────────────────────┤
   │ • Cadastro de Clientes    │                   │ • Catálogo de Produtos    │
   │ • Schema rígido / DDL     │                   │ • Schema-less (Flexível)  │
   │ • Integridade relacional  │                   │ • Documentos JSON         │
   │ • Restrição UNIQUE/ACID   │                   │ • Atributos dinâmicos     │
   │ • Arquivo: relational.db  │                   │ • Coleção: "products"     │
   └───────────────────────────┘                   └───────────────────────────┘
```

1. **Banco SQL (Relacional - SQLite via `expo-sqlite`)**:
   * **Responsabilidade:** Cadastro de Clientes (`Customer`).
   * **Campos:** `id` (INTEGER PRIMARY KEY), `name` (TEXT NOT NULL), `email` (TEXT NOT NULL UNIQUE), `created_at` (DATETIME).
   * **Garantias:** Consistência relacional, transações ACID e validação estrita de integridade contra duplicidade de e-mails.

2. **Banco NoSQL (Baseado em Documentos - Document Store)**:
   * **Responsabilidade:** Catálogo de Produtos (`Product`).
   * **Campos:** `_id` (UUID único de documento), `name`, `price`, `category`, `attributes` (dicionário heterogêneo chave-valor) e `tags`.
   * **Garantias:** Flexibilidade total sem *schema* fixo. Cada produto pode possuir atributos arbitrários (um smartphone possui `Armazenamento` e `RAM`, enquanto uma camisa possui `Tamanho` e `Tecido`), sem exigir alterações estruturais no banco.

---

## 2. 🏛️ Arquitetura Exigida (Desenvolvimento em 3 Camadas)

O projeto segue rigorosamente o padrão arquitetural em 3 camadas, garantindo baixo acoplamento e alta coesão:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. CAMADA DE APRESENTAÇÃO (UI / Views / ViewModels / Hooks)            │
│    • src/app/(tabs)/                                                   │
│    • src/presentation/components/ (CustomerForm, ProductForm, etc.)    │
│    • src/presentation/hooks/ (useCustomers, useProducts)               │
│    (Captura interações, exibe dados, SEM código de banco de dados)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. CAMADA DE NEGÓCIO / SERVIÇOS (Business / Services / Validators)     │
│    • src/business/services/ (CustomerService, ProductService)          │
│    • src/business/validators/ (customerValidator, productValidator)    │
│    (Validação de regras de negócio, e-mail único, sanitização)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. CAMADA DE ACESSO A DADOS (Data / Repositories / DAOs / Database)    │
│    • src/data/models/ (Customer.ts, Product.ts)                        │
│    • src/data/database/sqlite/ (SQLiteDatabase.ts)                     │
│    • src/data/database/nosql/ (DocumentDatabase.ts)                    │
│    • src/data/repositories/ (CustomerSqlRepository, ProductNoSqlRepo)  │
│    (Comunicação exclusiva e operações CRUD com SQLite e DocumentStore) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 📱 Estrutura da Interface (Abas da Aplicação)

A interface móvel é dividida em seções principais através do **Expo Router Tabs**:

1. **Aba 1: Clientes (SQL Local)**:
   * Formulário de inclusão de clientes com validação estrita (Nome Completo e E-mail).
   * Badge indicativo do banco SQL com contagem de registros em tempo real.
   * Listagem dinâmica dos clientes cadastrados diretamente da tabela SQLite.
   * Ação de exclusão com confirmação e recálculo automático.

2. **Aba 2: Produtos (NoSQL Local)**:
   * Formulário de inclusão de produtos (Nome, Preço, Categoria).
   * **Editor de Atributos Dinâmicos:** Permite adicionar pares arbitrários de chave-valor (ex: Cor: Preto, Tamanho: M, Garantia: 12 meses, Voltagem: Bivolt) com sugestões rápidas.
   * Listagem dinâmica consultando a coleção NoSQL.
   * Exibição dos atributos dinâmicos em badges heterogêneas e botão para inspecionar a estrutura JSON pura do documento.
   * Barra de pesquisa com filtro textual em nomes, categorias e atributos dinâmicos.

3. **Aba 3: Arquitetura (Painel Informativo & Seed Demo)**:
   * Painel com a fundamentação do desafio e comparação técnica entre SQL e NoSQL.
   * Botão **"Popular Bancos com Exemplos (Seed)"**: insere registros de teste no SQLite e produtos variados no NoSQL com um clique, facilitando a demonstração no vídeo.

---

## 4. 📂 Estrutura de Diretórios

```
Easyshop/
├── assets/                    # Recursos visuais (ícones, splash)
├── src/
│   ├── app/                   # Rotas do Expo Router
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx    # Configuração das abas de navegação
│   │   │   ├── index.tsx      # Aba de Clientes (SQL Local)
│   │   │   ├── products.tsx   # Aba de Produtos (NoSQL Local)
│   │   │   └── architecture.tsx # Aba de Arquitetura e Seed Demo
│   │   └── _layout.tsx        # Layout raiz e inicialização dos bancos
│   ├── business/              # CAMADA 2: NEGÓCIO / SERVIÇOS
│   │   ├── services/
│   │   │   ├── CustomerService.ts # Regras de clientes e unicidade
│   │   │   └── ProductService.ts  # Regras de produtos e atributos
│   │   └── validators/
│   │       ├── customerValidator.ts # Validação de nome completo e e-mail
│   │       └── productValidator.ts  # Validação de nome e preço positivo
│   ├── data/                  # CAMADA 3: ACESSO A DADOS (DAOs / REPOS)
│   │   ├── database/
│   │   │   ├── nosql/
│   │   │   │   └── DocumentDatabase.ts # Engine NoSQL baseada em Documentos
│   │   │   └── sqlite/
│   │   │       └── SQLiteDatabase.ts   # Conexão e DDL SQLite local
│   │   ├── models/
│   │   │   ├── Customer.ts    # Modelo estrito de cliente
│   │   │   └── Product.ts     # Modelo flexível de documento de produto
│   │   └── repositories/
│   │       ├── ICustomerRepository.ts
│   │       ├── CustomerSqlRepository.ts # CRUD SQL puro
│   │       ├── IProductRepository.ts
│   │       └── ProductNoSqlRepository.ts # CRUD NoSQL orientado a documento
│   └── presentation/          # CAMADA 1: APRESENTAÇÃO
│       ├── components/
│       │   ├── ArchitectureBanner.tsx
│       │   ├── CustomerCard.tsx
│       │   ├── CustomerForm.tsx
│       │   ├── DatabaseBadge.tsx
│       │   ├── DynamicAttributeEditor.tsx # Editor chave-valor NoSQL
│       │   ├── ProductCard.tsx            # Card com visualizador JSON
│       │   └── ProductForm.tsx
│       └── hooks/
│           ├── useCustomers.ts # ViewModel / Hook de Clientes
│           └── useProducts.ts  # ViewModel / Hook de Produtos
├── app.json                   # Configurações do Expo e plugins nativos
├── package.json               # Dependências do projeto
├── tsconfig.json              # Configurações do TypeScript
└── README.md                  # Documentação do projeto
```

---

## 5. 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** (versão 18 ou superior recomendada);
* **npm** ou **bun** instalado;
* **Android Studio** com um emulador configurado (ou dispositivo Android físico com o app **Expo Go**).

### Passo 1: Clonar e instalar dependências
```bash
# Clone o repositório
git clone https://github.com/Jake-afk47/Easyshop.git
cd Easyshop

# Instale as dependências
npm install
```

### Passo 2: Executar no Emulador Android
```bash
# Inicie o Expo para Android
npx expo start --android
```
> **Dica:** Certifique-se de que o emulador Android já esteja aberto no Android Studio antes de executar o comando acima. Caso deseje abrir o menu do Expo, pressione `a` no terminal para direcionar ao Android.

### Passo 3: Executar via Expo Go (Dispositivo Físico)
```bash
npx expo start
```
Abra o aplicativo **Expo Go** no celular e escaneie o QR Code exibido no terminal.

### Passo 4: Verificações de Qualidade
Para assegurar a integridade do código:
```bash
# Verificação de tipos TypeScript
npx tsc --noEmit

# Diagnóstico de integridade do Expo
npx expo-doctor
```

---

## 6. 🎬 Roteiro Sugerido para Gravação do Vídeo Demonstrativo

Para cumprir o requisito de envio do vídeo no emulador Android (YouTube / Google Drive com narração ou legendas):

1. **Apresentação Inicial (30s):**
   * Apresentar o nome dos integrantes e o objetivo do projeto (Startup EasyShop - Persistência Poliglota em 3 Camadas).
2. **Demonstração do Banco SQL (Clientes - 1m):**
   * Mostrar a aba "Clientes (SQL)".
   * Tentar cadastrar um cliente sem sobrenome ou com e-mail inválido para demonstrar as validações da camada de negócio.
   * Cadastrar um cliente com sucesso (ex: "Maria Silva", "maria@email.com") e mostrar o registro inserido no SQLite com ID autoincremento.
   * Tentar cadastrar novamente o mesmo e-mail para evidenciar o tratamento de erro da restrição `UNIQUE` do banco relacional.
3. **Demonstração do Banco NoSQL (Produtos - 1m30s):**
   * Navegar até a aba "Produtos (NoSQL)".
   * Explicar o conceito de *Schema Flexível*:
     * Cadastrar um Smartphone (ex: Preço: 3500, atributos dinâmicos: `Cor: Azul`, `Armazenamento: 256GB`, `Garantia: 1 ano`).
     * Cadastrar uma Camisa (ex: Preço: 89.90, atributos dinâmicos: `Tamanho: M`, `Tecido: Algodão`).
   * Mostrar que ambos os documentos coexistem na mesma coleção sem necessidade de alterar colunas ou tabelas.
   * Clicar em "Inspecionar Documento JSON" em um dos cards para exibir a estrutura NoSQL pura com seu `_id` UUID.
   * Demonstrar o filtro de pesquisa por nome ou atributo.
4. **Demonstração da Aba Arquitetura (30s):**
   * Abrir a aba "Arquitetura" para destacar o botão de carga rápida (Seed) e revisar as 3 camadas do sistema.
