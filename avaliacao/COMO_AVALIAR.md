# Como avaliar os artefatos gerados (T1–T4)

Procedimento para medir cada artefato congelado com os instrumentos comuns. Rode os comandos a partir da raiz do repositório. A geração dos artefatos está descrita em [`documentos/ROTEIRO_COLETA.md`](../documentos/ROTEIRO_COLETA.md).

## 1. Pré-requisitos

| Ferramenta | Versão usada | Observação |
|---|---|---|
| macOS | 26.7.1 (arm64) | `registrar_versoes.sh` usa `sw_vers`; `executar.sh` usa `lsof` |
| Docker + Docker Compose v2 | — | SonarQube e MongoDB |
| Node.js / npm | 20.20.2 / 10.8.2 | Executa os artefatos e a suíte |
| Playwright / Chromium | 1.49.1 / 131.0.6778.33 | Fixados em `avaliacao/playwright/package-lock.json` |
| SonarQube Community | 26.9.0.129388 | Imagem `sonarqube:community`, digest em `avaliacao/registros/versoes_ambiente.txt` |
| SonarScanner CLI | 8.1.0.6389 | Comando `sonar-scanner` no `PATH` |
| Python | 3.8 ou superior | Só a biblioteca padrão |
| `curl`, `shasum`, `lsof` | do sistema | Usados pelos scripts |

### 1.1 SonarQube (uma vez)

```bash
docker run -d --name sonarqube -p 9000:9000 \
  sonarqube:community@sha256:8e79c4957e1eccd3d1432d1e33e9606d4aeaf6b00a9661fb3cdd87f89adb7ddc
curl -s localhost:9000/api/system/status        # aguardar "status":"UP"
```

- Entre em `http://localhost:9000` com o usuário administrador e troque a senha inicial.
- Mantenha o modo MQR (padrão da versão) e o perfil Sonar way padrão de cada linguagem, sem personalização. `registrar_versoes.sh` registra os dois.
- Gere um token de análise e grave-o em `avaliacao/sonar/.sonar-token`, que não é versionado. Também é possível exportá-lo como `SONAR_TOKEN`.

```bash
curl -s -u admin:<senha> -X POST \
  "http://localhost:9000/api/user_tokens/generate?name=tcc&type=GLOBAL_ANALYSIS_TOKEN"
```

- Instale o SonarScanner CLI 8.1.0.6389 a partir da página de distribuição da SonarSource e coloque `sonar-scanner` no `PATH`.

### 1.2 A cada sessão de avaliação

```bash
docker start sonarqube
(cd avaliacao/playwright && npm ci)                       # Playwright 1.49.1 fixado
(cd avaliacao/playwright && npx playwright install chromium)
./avaliacao/infra/mongodb/reset.sh                        # sobe o MongoDB para o registro de versões
./avaliacao/sonar/registrar_versoes.sh                    # grava avaliacao/registros/versoes_ambiente.txt
```

`registrar_versoes.sh` só registra a imagem do MongoDB se o contêiner `tcc-mongodb` estiver ativo. Nas avaliações, o MongoDB não precisa ser iniciado à mão: `executar.sh` recria o contêiner vazio no início e o derruba ao final de cada rodada.

## 2. Antes de avaliar

- **Avalie uma cópia fora do iCloud.** `avaliacao/coleta/congelar.sh` cria, a cada tag `*-final`, uma cópia idêntica do snapshot em `~/tcc-avaliacao/Tn` (ou em `$AVAL_DIR/Tn`) e confere-a com `diff`. Na coleta, a primeira execução de T1 dentro do iCloud falhou porque a sincronização reiniciava o servidor em modo watch; desde então, todas as avaliações usam a cópia.
- Para reavaliar um snapshot de [`geracoes/`](../geracoes/), copie-o para fora do iCloud sem o `ORIGEM.txt`:

  ```bash
  mkdir -p ~/tcc-avaliacao/T1
  (cd geracoes/T1 && tar -cf - --exclude ORIGEM.txt .) | tar -xf - -C ~/tcc-avaliacao/T1
  ```

- Não edite o artefato.
- Libere as portas 5173 e 3000. Se estiverem ocupadas, o runner aborta.
- Avalie uma condição por vez.

## 3. Avaliar uma condição

```bash
./avaliacao/sonar/analisar.sh      T1 ~/tcc-avaliacao/T1
./avaliacao/playwright/executar.sh T1 ~/tcc-avaliacao/T1
```

Repita para T2, T3 e T4 com os mesmos comandos, sem ajuste por condição.

| Etapa | O que faz | Saída em `avaliacao/resultados/Tn/` |
|---|---|---|
| `analisar.sh` | Executa o scanner com a configuração comum (chave `tcc-Tn`), coleta métricas e problemas via API e conta os testes de desenvolvimento | `sonar/resumo.json`, `measures_raw.json`, `issues_raw.json`, `testes_desenvolvimento.json`, `scanner.log` |
| `executar.sh` | Confere o hash da suíte, recria o MongoDB vazio, roda `npm install`, `npm run seed` e `npm run dev`, aguarda as portas 5173 e 3000 (até 180 s), executa P1–P5 (cada cenário roda `npm run reset-db`) e encerra a aplicação e o MongoDB | `playwright/execucao.json`, `relatorio.json`, `playwright.log`, `npm_*.log`, `mongodb.log`; traces de falha em `artefatos/` |

Conferência rápida:

- `execucao.json → inicializacao` deve valer `"ok"`. Se valer `"falha"`, o motivo fica registrado e os cenários aparecem como "não executado". `"abortado"` indica hash divergente ou porta ocupada; nesse caso, a suíte não chega a rodar.
- `scanner.log` deve terminar em `EXECUTION SUCCESS`.

## 4. Consolidar (após as quatro condições)

```bash
python3 avaliacao/scripts/consolidar.py
```

Saídas em `avaliacao/resultados/tabelas/`:

- `resultados.md`, o resumo legível;
- `estrutural.csv`;
- `comparacoes.csv`, com as comparações principais T2−T1, T3−T1 e T4−T2 e a complementar T4−T3;
- `funcional.csv`;
- `testes_desenvolvimento.csv`.

A seção de esforço vem de `avaliacao/registros/esforco.csv`, preenchido por `coleta/auditar_sessao.py` durante a coleta. A consolidação **aborta** quando o hash da suíte ou a versão do SonarQube diferem entre as condições.

## 5. Regras do protocolo

- **Nunca corrija o artefato** para fazê-lo passar. Falhas de build, de inicialização ou de testes entram nos resultados.
- Ajustes de **ambiente** são registrados em [`documentos/DECISOES_SESSAO_CLAUDE_CODE.md`](../documentos/DECISOES_SESSAO_CLAUDE_CODE.md) e aplicados igualmente às quatro condições.
- **Não altere a suíte.** Se um defeito dela for comprovado, siga esta ordem:
  1. corrija o defeito;
  2. rode `./avaliacao/playwright/validacao/validar_suite.sh` e confirme a mensagem "SUÍTE VALIDADA";
  3. execute `./avaliacao/playwright/hash_suite.sh > avaliacao/playwright/SUITE_SHA256`;
  4. registre a saída da validação e o novo hash em `avaliacao/registros/validacao_suite.txt` e no log de decisões;
  5. **reavalie T1–T4**.
- Os agentes de geração e de correção não podem acessar `avaliacao/`.
- As pastas `artefatos/` (traces e capturas) ficam fora do git. A única exceção é a tentativa preservada em `resultados/T1/playwright_tentativa1_icloud/`, mantida como evidência do desvio.

## 6. Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `porta 5173/3000 já em uso` | Há um servidor anterior rodando. Encerre-o com `lsof -ti tcp:5173 \| xargs kill`. |
| `hash da suíte divergente` | A suíte foi alterada. Veja a seção 5. |
| Servidor reinicia durante a suíte | O artefato está numa pasta sincronizada (iCloud). Use a cópia fora do iCloud (seção 2). |
| `npm run seed falhou` | É um resultado do artefato: registre-o e não corrija. |
| Erro 401 no scanner | O token é inválido. Gere um novo (seção 1.1). |
| Cenário reprovado | Abra o trace com `npx playwright show-trace avaliacao/resultados/Tn/playwright/artefatos/<teste>/trace.zip`. |
