# Decisões da sessão Claude Code

Registro vivo das decisões tomadas durante o experimento, para posterior atualização do documento do TCC (`documentos/tcc/TCC_Raphael_Marchetti_base_novo_escopo_v1.docx`, fonte de verdade).

As decisões da fase de preparação já foram incorporadas ao documento do TCC. O registro completo daquela fase está no histórico do git (commit anterior a este arquivo ser reiniciado).

## Pendências de ajuste no TCC

Encontradas na conferência de alinhamento entre o registro anterior e o documento:

1. **Sessão nova por etapa:** declarar uma sessão nova do Claude Code, sem histórico e sem subagentes compartilhados, para cada etapa (geração, verificação e correção), e não só para T1 e T2.
2. **Registro por sessão:** registrar a versão do Claude Code, o modelo e o esforço efetivos antes de cada sessão, e não só no início da coleta.
3. **Premissas remanescentes da suíte:**
   - acrescentar que a URL da imagem é armazenada sem normalização;
   - acrescentar que a listagem administrativa fica em `/admin`;
   - trocar "rotas públicas do contrato" por "rotas do contrato", já que a premissa inclui as rotas administrativas.
4. **Prompts:**
   - o corretor registra os apontamentos não aplicados, e sua saída é `CORRECTION_SUMMARY.md`;
   - o parecer traz, para cada apontamento, identificador, arquivo, trecho, problema, justificativa e correção sugerida.
5. **Alteração da suíte:** qualquer alteração exige novo hash e a reavaliação de todas as condições.
6. **Opcionais:**
   - tempos numéricos: 90 s por cenário; 10 s para asserções e ações; 30 s para navegação; até 180 s de espera pela inicialização;
   - imagens de teste respondidas localmente;
   - aceitação automática de `window.confirm`;
   - justificativa da escolha do Sonnet com esforço low;
   - no escopo, dizer que a exclusão de produtos e as configurações da vitrine são exigidas, mas não medidas;
   - citar no texto a referência "Best Practices" do Playwright, ou removê-la.

## Decisões da coleta

(a registrar a partir daqui)
