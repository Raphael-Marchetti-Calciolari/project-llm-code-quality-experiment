# Como avaliar os artefatos gerados (T1–T4)

Procedimento para medir cada artefato congelado com os instrumentos comuns. Rode tudo a partir da raiz do repositório.

## 1. Pré-requisitos (uma vez por sessão de avaliação)

```bash
docker start sonarqube                          # SonarQube em http://localhost:9000
curl -s localhost:9000/api/system/status        # aguardar "status":"UP"
(cd avaliacao/playwright && npm install)        # Playwright 1.49.1 fixado
(cd avaliacao/playwright && npx playwright install chromium)
./avaliacao/sonar/registrar_versoes.sh          # grava avaliacao/registros/versoes_ambiente.txt
```

- O token do Sonar fica em `avaliacao/sonar/.sonar-token`, que não é versionado. Se estiver ausente, gere outro com `POST /api/user_tokens/generate`, tipo `GLOBAL_ANALYSIS_TOKEN`.
- O MongoDB é reiniciado automaticamente pelo `executar.sh`. Não é preciso subi-lo à mão.

## 2. Antes de avaliar

- O artefato precisa estar **congelado**, com commit ou tag de versão no diretório dele. Não edite nada.
- Libere as portas 5173 e 3000. Se estiverem ocupadas, o runner aborta.
- Avalie uma condição por vez.
- Se a suíte mudou desde o congelamento, o runner recusa a execução. Nesse caso, veja a seção 5.

## 3. Avaliar uma condição

```bash
./avaliacao/sonar/analisar.sh      T1 /caminho/para/artefato-T1
./avaliacao/playwright/executar.sh T1 /caminho/para/artefato-T1
```

Repita o mesmo procedimento para T2, T3 e T4. Use o mesmo comando, sem nenhum ajuste por condição.

| Etapa | O que faz | Saída em `avaliacao/resultados/Tn/` |
|---|---|---|
| `analisar.sh` | Executa o scanner com a configuração comum, coleta as métricas e os problemas via API e conta os testes de desenvolvimento | `sonar/resumo.json`, `measures_raw.json`, `issues_raw.json`, `testes_desenvolvimento.json`, `scanner.log` |
| `executar.sh` | Confere o hash, recria o MongoDB limpo, roda `npm install`, `npm run seed` e `npm run dev`, aguarda as portas 5173 e 3000 e executa P1–P5 (cada cenário roda `npm run reset-db`) | `playwright/execucao.json`, `relatorio.json`, logs `npm_*.log`, traces de falha em `artefatos/` |

Conferência rápida:

- O campo `execucao.json → inicializacao` deve valer `"ok"`. Se valer `"falha"`, o motivo fica registrado e os cenários aparecem como "não executado".
- O `scanner.log` deve terminar em `EXECUTION SUCCESS`.

## 4. Consolidar (após as quatro condições)

```bash
python3 avaliacao/scripts/consolidar.py
```

Saídas em `avaliacao/resultados/tabelas/`:

- `resultados.md`, o resumo legível;
- `estrutural.csv`;
- `comparacoes.csv`, com T2−T1, T3−T1, T4−T2 e T4−T3 apenas descritivo;
- `funcional.csv`;
- `testes_desenvolvimento.csv`.

O esforço é opcional. Para incluí-lo, preencha `avaliacao/registros/esforco.csv` com as colunas `condicao,etapa,duracao_min,tokens,interacoes`.

A consolidação **aborta** quando o hash da suíte ou a versão do SonarQube diferem entre as condições.

## 5. Regras do protocolo (não violar)

- **Nunca corrija o artefato** para fazê-lo passar. Falhas de build, de inicialização ou de testes entram nos resultados.
- Se precisar de um ajuste de **ambiente**, registre-o em `documentos/DECISOES_SESSAO_CLAUDE_CODE.md` e aplique-o igualmente às quatro condições.
- **Não altere a suíte.** Se um defeito dela for comprovado, siga esta ordem:
  1. corrija o defeito;
  2. rode `./avaliacao/playwright/validacao/validar_suite.sh` e confirme que o resultado é "SUÍTE VALIDADA";
  3. execute `./avaliacao/playwright/hash_suite.sh > avaliacao/playwright/SUITE_SHA256`;
  4. registre o novo hash;
  5. **reavalie T1–T4**.
- Os agentes de geração e de correção não podem acessar `avaliacao/`. Gere os artefatos fora deste repositório.
- Ao final, faça commit das saídas brutas e das tabelas. As pastas `artefatos/` ficam fora do git.

## 6. Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `porta 5173/3000 já em uso` | Há um servidor anterior rodando. Encerre-o com `lsof -ti tcp:5173 \| xargs kill`. |
| `hash da suíte divergente` | A suíte foi alterada. Veja a seção 5. |
| `npm run seed falhou` | É um resultado do artefato: registre-o e não corrija. |
| Erro 401 no scanner | O token é inválido. Gere um novo (seção 1). |
| Cenário reprovado | Abra o trace com `npx playwright show-trace avaliacao/resultados/Tn/playwright/artefatos/<teste>/trace.zip`. |
