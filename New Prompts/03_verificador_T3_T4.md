# Prompt — Verificador de boas práticas (comum a T3 e T4)

Analise o código existente deste projeto e produza um parecer de boas práticas. **Não altere nenhum arquivo de implementação.**

## Escopo da verificação
Avalie somente:
- clareza e precisão de nomes;
- separação de responsabilidades;
- repetição/duplicação desnecessária;
- complexidade de fluxo e excesso de condicionais/aninhamentos;
- tratamento de erros e falhas previsíveis.

## Regras
- Preserve integralmente os requisitos funcionais existentes.
- Não proponha novas funcionalidades.
- Não proponha remover requisitos para simplificar o código.
- Não use resultados de SonarQube, da suíte final Playwright ou de qualquer avaliação externa do experimento.
- Não atribua nota geral, ranking ou pontuação ao projeto.
- Não modifique código, testes ou configuração.
- Seja específico e acionável; evite recomendações genéricas.

## Saída obrigatória
Crie `VERIFICATION_REPORT.md`.

Para cada apontamento, registre:
1. identificador;
2. arquivo;
3. função/componente/trecho afetado;
4. problema observado;
5. por que isso prejudica clareza, responsabilidade, duplicação, complexidade ou tratamento de erros;
6. correção sugerida.

Se não houver apontamentos relevantes em algum critério, registre explicitamente que nenhum problema relevante foi identificado nesse critério.

Ao concluir o relatório, pare. Não execute correções.
