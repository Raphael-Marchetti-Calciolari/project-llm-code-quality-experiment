# Prompt — T2: geração com TDD

Implemente autonomamente a aplicação descrita abaixo utilizando desenvolvimento orientado a testes (TDD).

## Regras desta execução
- Trabalhe até entregar a aplicação completa e executável.
- Não peça ao usuário decisões de arquitetura, estrutura, bibliotecas, nomes internos ou detalhes de implementação. Tome decisões razoáveis por conta própria.
- Desenvolva as funcionalidades em ciclos observáveis de TDD:
  1. crie ou ajuste um teste de desenvolvimento que represente o comportamento a implementar;
  2. execute o teste e confirme que ele falha pelo motivo esperado;
  3. implemente somente o necessário para satisfazer o comportamento;
  4. execute novamente e confirme que o teste passa;
  5. refatore quando necessário, mantendo os testes aprovados.
- Execute de fato os testes durante os ciclos; não apenas escreva testes ao final.
- Preserve os testes de desenvolvimento produzidos durante a implementação.
- Não altere ou remova testes apenas para ocultar falhas da implementação.
- Você pode criar e alterar arquivos, instalar dependências, executar comandos, iniciar serviços e corrigir problemas encontrados durante a própria geração.
- Não acrescente funcionalidades fora do escopo.
- Ao final, execute a suíte de testes de desenvolvimento e verifique por meios próprios que o projeto instala, compila/inicializa e está completo conforme a especificação.
- Quando considerar a entrega concluída, pare e apresente um resumo breve, incluindo os comandos de execução e de testes.

## ESPECIFICAÇÃO FUNCIONAL COMUM

Gere um MVP completo de uma aplicação web de catálogo de produtos para pequenas lojas.

### OBJETIVO
A aplicação deve permitir que visitantes naveguem por produtos e entrem em contato com a loja pelo WhatsApp. Também deve existir uma área administrativa simples para gerenciar os produtos e os textos exibidos na vitrine.

### STACK OBRIGATÓRIA
- Frontend em React com Vite
- Backend em Node.js
- Banco de dados MongoDB

### ESCOPO FUNCIONAL

#### ÁREA PÚBLICA
1. Página inicial da loja
2. Exibição do nome da loja, título principal e subtítulo
3. Listagem de produtos ativos
4. Página de detalhes de cada produto
5. Botão para falar no WhatsApp sobre o produto

#### ÁREA ADMINISTRATIVA
1. Tela de login administrativo
2. Tela para listar produtos
3. Tela para criar produto
4. Tela para editar produto
5. Ação para ativar ou inativar produto
6. Ação para excluir produto
7. Tela para editar as configurações principais da vitrine:
   - nome da loja
   - título principal
   - subtítulo
   - número de WhatsApp

### DADOS MÍNIMOS DO PRODUTO
Cada produto deve possuir, no mínimo:
- nome
- identificador amigável para URL
- descrição curta
- descrição completa
- preço em texto
- imagem por URL
- status ativo/inativo

### DADOS MÍNIMOS DA VITRINE
A vitrine deve possuir, no mínimo:
- nome da loja
- título principal
- subtítulo
- número de WhatsApp padrão

### REGRAS IMPORTANTES
- Não implementar cadastro de clientes
- Não implementar login de clientes
- Não implementar carrinho
- Não implementar checkout
- Não implementar pagamento
- Não implementar pedidos
- Não implementar múltiplos perfis de administrador
- Não implementar recursos além do necessário para o MVP

### CONTRATOS FIXOS DE EXECUÇÃO E INTERFACE

Para manter compatibilidade externa entre as diferentes implementações, respeite os contratos abaixo. Eles não determinam a arquitetura ou a organização interna do código.

**Execução**
- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:3000/api`
- MongoDB: `mongodb://127.0.0.1:27017/tcc_catalog`
- A raiz do projeto deve disponibilizar:
  - `npm install`
  - `npm run dev` — inicia frontend e backend
  - `npm run seed` — prepara os dados iniciais abaixo
  - `npm run reset-db` — restaura o banco ao mesmo estado inicial do seed

**Credenciais administrativas sintéticas**
- usuário: `admin@teste.local`
- senha: `admin123`

**Rotas públicas e administrativas**
- `/`
- `/produtos/:slug`
- `/admin/login`
- `/admin`
- `/admin/produtos/novo`
- `/admin/produtos/:id/editar`

**Dados iniciais mínimos**
O `seed` deve criar:
- configuração da loja com número de WhatsApp `5511999999999`;
- um produto ativo com:
  - nome: `Produto Fixture`
  - slug: `produto-fixture`
  - descrição curta: `Produto para testes`
  - descrição completa: `Descrição completa do produto para testes`
  - preço: `R$ 10,00`
  - imagem por URL
  - status ativo.

**Seletores estáveis**
Os elementos abaixo devem possuir exatamente estes atributos `data-testid`:
- login: `login-email`, `login-password`, `login-submit`
- formulário de produto: `product-name`, `product-slug`, `product-short-description`, `product-description`, `product-price`, `product-image-url`, `product-active`, `product-save`
- linha/item administrativo: `admin-product-row-{slug}`
- ação de editar: `product-edit-{slug}`
- ação de ativar/inativar: `product-toggle-active-{slug}`
- produto na vitrine: `public-product-card-{slug}`
- página de detalhes: `product-detail`
- botão de WhatsApp: `whatsapp-button`

Substitua `{slug}` pelo slug real do produto.

### EXPECTATIVAS DE QUALIDADE
- O sistema deve funcionar de ponta a ponta
- O código deve ser claro e organizado
- A solução deve priorizar simplicidade
- Não usar bibliotecas desnecessárias
- A organização interna do código deve ser decidida pela própria implementação
- O resultado deve ser adequado para análise de manutenibilidade

### ENTREGA
Forneça o projeto completo, incluindo frontend, backend, persistência dos dados, dados iniciais de exemplo e instruções para execução local.
