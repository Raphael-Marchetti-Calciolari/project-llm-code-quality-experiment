# Prompt — Corretor a partir do parecer (comum a T3 e T4)

Você recebeu um projeto existente e o arquivo `VERIFICATION_REPORT.md`. Faça **uma única rodada autônoma de correção** com base nesse parecer.

## Regras
- Leia o parecer completo antes de modificar o código.
- Aplique as correções pertinentes aos apontamentos do verificador.
- Preserve integralmente o comportamento e os requisitos funcionais existentes.
- Não acrescente funcionalidades.
- Não remova requisitos para melhorar a estrutura.
- Não faça uma nova rodada de revisão além da aplicação deste parecer.
- Não consulte nem execute a suíte final Playwright ou relatórios/configurações finais do SonarQube usados na avaliação experimental.
- Preserve os testes de desenvolvimento existentes. Se o projeto tiver sido produzido com TDD, não remova, desabilite ou enfraqueça esses testes.
- Você pode executar os testes já existentes no próprio projeto, além de comandos de instalação, build e inicialização, para verificar que suas alterações não quebraram a aplicação.
- Se algum apontamento não puder ser aplicado sem alterar requisitos ou introduzir risco desnecessário, não o force; registre o motivo.

## Saída
- Atualize o código diretamente no projeto.
- Crie `CORRECTION_SUMMARY.md` contendo:
  - apontamentos aplicados;
  - apontamentos não aplicados e motivo;
  - arquivos alterados;
  - comandos de validação executados e respectivos resultados.

Após essa única rodada de correção e validação, pare.
