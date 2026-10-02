# Prompt de geração — Tratamento 1 (LLM sem revisão)

Este é o **prompt-base (spec-document)** definido no Projeto de Pesquisa, a ser usado de forma
idêntica em todos os tratamentos assistidos por LLM. Para o **T1 (LLM sem revisão)**, gere o código
e aceite o resultado como veio, sem refatoração ou ajustes manuais além do mínimo necessário para
compilar e executar.

## Protocolo de geração (para validade do experimento)

- Use **apenas o prompt abaixo**. Não acrescente contexto sobre o TCC, sobre dívida técnica ou sobre
  o fato de que a manutenibilidade será medida — esse contexto enviesaria o modelo a escrever código
  mais limpo do que o uso típico/irrestrito que o T1 pretende simular.
- Inicie uma **conversa nova/limpa** (sem histórico, sem system prompt customizado de qualidade).
- **Não refatore** e não peça melhorias depois. Aceite a primeira entrega utilizável (apenas correções
  para compilar/rodar são permitidas).
- **Registre os metadados de cada geração** (essenciais para a seção de métodos e reprodutibilidade):
  - Modelo e versão exata (ex.: GPT-5 mini, GPT-4o, etc.)
  - Nível/esforço de raciocínio ou parâmetros (temperature, reasoning effort, etc.), se aplicável
  - Data/hora da geração
  - Quaisquer ajustes mínimos feitos para a aplicação rodar
- Se for gerar com **modelos diversos / níveis diferentes**, salve **um repositório por modelo/config**,
  com nome claro, por exemplo: `t1-gpt5mini-default`, `t1-gpt4o-default`. Cada um é uma amostra do T1.

> Observação sobre fidelidade ao Projeto: o spec-document contém a linha "O resultado deve ser adequado
> para análise de manutenibilidade". Como ela é **constante em todos os tratamentos**, ela não enviesa a
> comparação *entre* tratamentos — por isso mantemos o prompt idêntico ao definido no Projeto de Pesquisa.

---

## PROMPT (copie a partir daqui)

```
Gere um MVP completo de uma aplicação web de catálogo de produtos para pequenas lojas.

OBJETIVO
A aplicação deve permitir que visitantes naveguem por produtos e entrem em contato com a loja pelo WhatsApp. Também deve existir uma área administrativa simples para gerenciar os produtos e os textos exibidos na vitrine.

STACK OBRIGATÓRIA
- Frontend em React com Vite
- Backend em Node.js
- Banco de dados MongoDB

ESCOPO FUNCIONAL

ÁREA PÚBLICA
1. Página inicial da loja
2. Exibição do nome da loja, título principal e subtítulo
3. Listagem de produtos ativos
4. Página de detalhes de cada produto
5. Botão para falar no WhatsApp sobre o produto

ÁREA ADMINISTRATIVA
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

DADOS MÍNIMOS DO PRODUTO
Cada produto deve possuir, no mínimo:
- nome
- identificador amigável para URL
- descrição curta
- descrição completa
- preço em texto
- imagem por URL
- status ativo/inativo

DADOS MÍNIMOS DA VITRINE
A vitrine deve possuir, no mínimo:
- nome da loja
- título principal
- subtítulo
- número de WhatsApp padrão

REGRAS IMPORTANTES
- Não implementar cadastro de clientes
- Não implementar login de clientes
- Não implementar carrinho
- Não implementar checkout
- Não implementar pagamento
- Não implementar pedidos
- Não implementar múltiplos perfis de administrador
- Não implementar recursos além do necessário para o MVP

EXPECTATIVAS DE QUALIDADE
- O sistema deve funcionar de ponta a ponta
- O código deve ser claro e organizado
- A solução deve priorizar simplicidade
- Não usar bibliotecas desnecessárias
- A organização interna do código deve ser decidida pela própria implementação
- O resultado deve ser adequado para análise de manutenibilidade

ENTREGA
Forneça o projeto completo, incluindo frontend, backend, persistência dos dados, dados iniciais de exemplo e instruções para execução local.
```
