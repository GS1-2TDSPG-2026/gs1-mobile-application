# Phycocarbon Mobile

Aplicativo mobile desenvolvido em **React Native com Expo e TypeScript** para a plataforma **Phycocarbon**, projeto acadêmico da **Global Solution FIAP 2026**.

O Phycocarbon é uma solução de bioeconomia que conecta **microalgas, IoT, dados orbitais, inteligência artificial, créditos de carbono e marketplace B2B**. A proposta é apoiar o monitoramento de fazendas automatizadas de microalgas, prever crescimento de biomassa, gerar créditos de carbono auditáveis e facilitar a comercialização de biomassa e ativos ambientais.

---

## Status do Projeto

> Projeto mobile em desenvolvimento acadêmico para a Global Solution FIAP 2026.

O aplicativo já possui **integração parcial com as APIs Java e .NET**.

Integrações implementadas:

- **API Java Spring Boot** para autenticação, cadastro, fazendas, tanques, marketplace, transações, créditos de carbono, perfil de usuário e dados orbitais.
- **API .NET** para telemetria dos tanques, dispositivos IoT, comandos remotos e alertas críticos.
- **AsyncStorage** para persistência local da sessão.
- **Mock local apenas na tela de Previsões de IA**, enquanto o serviço de IA ainda não está integrado.

O app possui:

- login real via API Java;
- cadastro real via API Java;
- navegação por perfil;
- dashboard operacional com telemetria da API .NET;
- listagem de fazendas e tanques pela API Java;
- controle IoT com envio de comandos para a API .NET;
- alertas críticos vindos da API .NET;
- previsões de IA simuladas;
- dados orbitais vindos da API Java;
- marketplace integrado com a API Java;
- carteira de carbono integrada com a API Java;
- histórico de transações integrado com a API Java;
- perfil com foto editável e atualização de dados via API Java;
- ícones nas abas;
- estrutura organizada em camadas.

---

## Objetivo do App

O aplicativo mobile representa a camada de experiência do usuário da plataforma Phycocarbon.

Ele foi projetado para atender dois grupos principais:

### Operador de Campo

Usuário responsável pela operação local das fazendas, tanques de microalgas e dispositivos IoT.

Funcionalidades implementadas:

- login por perfil com JWT;
- cadastro de usuário na API Java;
- dashboard operacional de telemetria;
- visualização de fazendas e tanques;
- status de sensores e dispositivos ESP32;
- controle de atuadores IoT por comando remoto;
- alertas críticos de operação;
- previsões simuladas de IA para biomassa;
- dados orbitais usados na operação;
- perfil com foto editável.

### Investidor / Comprador B2B

Usuário voltado à análise ambiental, créditos de carbono, marketplace e histórico transacional.

Funcionalidades implementadas:

- login por perfil com JWT;
- marketplace de lotes de biomassa;
- criação de lote;
- reserva, venda, compra e exclusão de lotes;
- carteira de créditos de carbono;
- validação de créditos de carbono;
- histórico de transações;
- visualização de hash de auditoria;
- perfil com foto editável.

---

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- Axios
- AsyncStorage
- Expo Image Picker
- Expo Vector Icons
- StyleSheet
- Git Flow

---

## Arquitetura do Projeto

O projeto segue uma organização inspirada em **Clean Architecture** e **MVVM simplificado**, separando responsabilidades entre telas, hooks, repositories, models, contextos e componentes reutilizáveis.

```text
src/
├── app/
│   └── routes/
├── core/
│   └── theme/
├── data/
│   ├── api/
│   ├── repositories/
│   └── storage/
├── domain/
│   └── models/
└── presentation/
    ├── components/
    ├── contexts/
    ├── hooks/
    └── screens/
        ├── auth/
        ├── investor/
        └── operator/
```

### Responsabilidades das Camadas

| Camada | Responsabilidade |
| --- | --- |
| `app/routes` | Controle de navegação e rotas por perfil |
| `core/theme` | Cores, espaçamentos e tipografia |
| `data/api` | Configuração dos clients Axios da API Java e da API .NET |
| `data/repositories` | Integração com APIs e adaptação dos dados para o app |
| `data/storage` | Persistência local da sessão com AsyncStorage |
| `domain/models` | Tipagens e contratos do domínio |
| `presentation/screens` | Telas do aplicativo |
| `presentation/hooks` | Estados e regras de tela |
| `presentation/components` | Componentes reutilizáveis de interface |

---

## APIs Configuradas

### API Java

Arquivo:

```text
src/data/api/apiClient.ts
```

Base URL atual:

```txt
http://10.0.2.2:8080/api
```

Essa URL é adequada para emulador Android acessando uma API Java rodando localmente na máquina.

Em dispositivo físico, altere para o IP da máquina na rede local ou para a URL pública da API.

### API .NET

Arquivo:

```text
src/data/api/dotnetApiClient.ts
```

Base URL atual:

```txt
https://gs1-net.onrender.com/api
```

Essa API é usada para telemetria, dispositivos IoT, comandos e alertas críticos.

---

## Perfis de Acesso

O app adapta sua navegação de acordo com o perfil do usuário autenticado.

| Perfil | Área liberada |
| --- | --- |
| `OPERADOR_CAMPO` | Dashboard, Tanques, IoT, Alertas, IA, Orbital e Perfil |
| `INVESTIDOR` | Marketplace, Transações, Carbono e Perfil |
| `COMPRADOR_B2B` | Marketplace, Transações, Carbono e Perfil |
| `ADMIN` | Área operacional |

---

## Rotas do Aplicativo

### Rotas públicas

Arquivos principais:

```text
src/app/routes/AuthRoutes.tsx
src/presentation/screens/auth/LoginScreen.tsx
src/presentation/screens/auth/RegisterScreen.tsx
```

Telas:

- Login
- Cadastro

### Rotas do operador

Arquivo principal:

```text
src/app/routes/OperatorRoutes.tsx
```

Abas:

- Dashboard
- Tanques
- IoT
- Alertas
- IA
- Orbital
- Perfil

### Rotas do investidor/comprador

Arquivo principal:

```text
src/app/routes/InvestorRoutes.tsx
```

Abas:

- Marketplace
- Transações
- Carbono
- Perfil

---

## Funcionalidades Implementadas

### Autenticação via API Java

O app realiza login com a API Java e salva a sessão localmente com `AsyncStorage`.

A sessão contém token JWT e dados do usuário autenticado.

Arquivos principais:

```text
src/presentation/contexts/AuthContext.tsx
src/data/repositories/AuthRepository.ts
src/data/storage/sessionStorage.ts
src/domain/models/Auth.ts
```

Endpoint utilizado:

```txt
POST /auth/login
```

---

### Cadastro via API Java

O cadastro cria um usuário real na API Java e depois realiza login automaticamente.

Perfis disponíveis no cadastro:

- `OPERADOR_CAMPO`
- `INVESTIDOR`
- `COMPRADOR_B2B`

Arquivos principais:

```text
src/presentation/screens/auth/RegisterScreen.tsx
src/presentation/contexts/AuthContext.tsx
src/data/repositories/AuthRepository.ts
src/domain/models/Auth.ts
```

Endpoint utilizado:

```txt
POST /auth/register
```

---

### Navegação por Perfil

A navegação é controlada de acordo com o perfil retornado no login ou cadastro.

Arquivos principais:

```text
src/app/routes/AppRoutes.tsx
src/app/routes/AuthRoutes.tsx
src/app/routes/OperatorRoutes.tsx
src/app/routes/InvestorRoutes.tsx
```

---

### Dashboard Operacional

Tela voltada ao operador de campo.

Exibe:

- status do ESP32;
- previsão da IA;
- confiança do modelo;
- tanques monitorados;
- pH;
- temperatura;
- turbidez;
- luminosidade;
- status operacional do tanque;
- última leitura.

Arquivos principais:

```text
src/presentation/screens/operator/DashboardOperacionalScreen.tsx
src/presentation/hooks/useTelemetryDashboard.ts
src/data/repositories/TelemetryRepository.ts
src/domain/models/Telemetry.ts
```

Endpoints da API .NET utilizados:

```txt
GET /MetricaTanque
GET /Tanque
GET /Fazenda
GET /DispositivoIot
GET /PrevisaoIa
```

---

### Fazendas e Tanques

Tela responsável por listar e gerenciar fazendas e tanques do usuário.

Funcionalidades:

- listar fazendas do usuário;
- listar tanques por fazenda;
- criar fazenda;
- editar fazenda;
- excluir fazenda;
- criar tanque;
- editar tanque;
- excluir tanque;
- visualizar resumo operacional da fazenda.

Arquivos principais:

```text
src/presentation/screens/operator/FazendasTanquesScreen.tsx
src/presentation/hooks/useFarmsAndTanks.ts
src/data/repositories/FarmRepository.ts
src/domain/models/Farm.ts
```

Endpoints da API Java utilizados:

```txt
GET /fazendas/minhas
GET /fazendas
POST /fazendas
PUT /fazendas/{id}
DELETE /fazendas/{id}
GET /fazendas/{id}/dashboard
GET /tanques/fazenda/{idFazenda}
POST /tanques
PUT /tanques/{id}
DELETE /tanques/{id}
```

---

### Controle IoT

Tela que envia comandos remotos para o dispositivo IoT pela API .NET.

Comandos disponíveis na interface:

- ligar/desligar bomba de oxigênio;
- ligar/desligar cooler;
- ligar/desligar injetor de CO₂;
- ligar/desligar bomba de colheita;
- atualizar status do dispositivo.

Arquivos principais:

```text
src/presentation/screens/operator/DeviceControlScreen.tsx
src/presentation/hooks/useIoTDevice.ts
src/data/repositories/IoTDeviceRepository.ts
src/domain/models/IoTDevice.ts
```

Endpoints da API .NET utilizados:

```txt
GET /DispositivoIot
GET /Tanque
POST /iot/comandos
```

Observação: no código atual, o comando da bomba de colheita é convertido para `ABRIR_SERVO` ou `FECHAR_SERVO`, compatível com o ESP32.

---

### Previsões de IA

Tela que apresenta previsões de crescimento de biomassa para as próximas 48 horas.

No estado atual do projeto, esta tela ainda utiliza dados simulados no repository local.

Exibe:

- biomassa atual;
- biomassa prevista;
- crescimento percentual;
- confiança do modelo;
- data estimada de colheita;
- radiação PAR;
- índice UV;
- nebulosidade;
- risco operacional;
- recomendação por tanque.

Arquivos principais:

```text
src/presentation/screens/operator/BiomassPredictionScreen.tsx
src/presentation/hooks/useBiomassPredictions.ts
src/data/repositories/BiomassPredictionRepository.ts
src/domain/models/BiomassPrediction.ts
```

---

### Dados Orbitais

Tela que evidencia o uso de dados espaciais no projeto.

Exibe:

- fonte dos dados orbitais;
- localização da fazenda;
- radiação PAR;
- índice UV estimado;
- nebulosidade;
- temperatura externa;
- previsão climática;
- impacto na biomassa;
- risco operacional;
- data da coleta.

Arquivos principais:

```text
src/presentation/screens/operator/OrbitalDataScreen.tsx
src/presentation/hooks/useOrbitalData.ts
src/data/repositories/OrbitalDataRepository.ts
src/domain/models/OrbitalData.ts
```

Endpoints da API Java utilizados:

```txt
GET /dados-orbitais/fazenda/{fazendaId}
POST /dados-orbitais/fazenda/{fazendaId}/sincronizar
```

---

### Alertas Críticos

Tela que exibe alertas operacionais gerados a partir das métricas dos tanques.

Funcionalidades:

- listar alertas abertos;
- filtrar alertas resolvidos;
- visualizar todos os alertas;
- marcar alerta como resolvido.

Arquivos principais:

```text
src/presentation/screens/operator/AlertasCriticosScreen.tsx
src/presentation/hooks/useCriticalAlerts.ts
src/data/repositories/CriticalAlertRepository.ts
src/domain/models/CriticalAlert.ts
```

Endpoints da API .NET utilizados:

```txt
GET /AlertaCritico
PATCH /AlertaCritico/{id}/resolver
```

---

### Marketplace

Tela voltada ao investidor e comprador B2B.

Funcionalidades:

- listar lotes;
- criar lote de biomassa;
- alterar status do lote;
- comprar lote;
- excluir lote.

Arquivos principais:

```text
src/presentation/screens/investor/MarketplaceScreen.tsx
src/presentation/hooks/useMarketplace.ts
src/data/repositories/MarketplaceRepository.ts
src/domain/models/MarketplaceLot.ts
```

Endpoints da API Java utilizados:

```txt
GET /marketplace/lotes
POST /marketplace/lotes
PATCH /marketplace/lotes/{lotId}/status
POST /marketplace/transacoes
DELETE /marketplace/lotes/{lotId}
```

---

### Carteira de Carbono

Tela que exibe o extrato ambiental e financeiro da carteira de créditos.

Exibe:

- CO₂ sequestrado;
- créditos disponíveis;
- valor estimado;
- última validação;
- lista de créditos;
- status do crédito;
- hash de auditoria.

Arquivos principais:

```text
src/presentation/screens/investor/CarteiraCarbonoScreen.tsx
src/presentation/hooks/useCarbonWallet.ts
src/data/repositories/CarbonWalletRepository.ts
src/domain/models/CarbonCredit.ts
```

Endpoints da API Java utilizados:

```txt
GET /marketplace/creditos
GET /marketplace/creditos/fazenda/{fazendaId}
PATCH /marketplace/creditos/{id}/validar
```

---

### Histórico de Transações

Tela que exibe o histórico financeiro e comercial da plataforma.

Exibe:

- total transacionado;
- transações concluídas;
- transações pendentes;
- compras;
- vendas;
- biomassa;
- créditos de carbono;
- referência de auditoria.

Arquivos principais:

```text
src/presentation/screens/investor/TransactionHistoryScreen.tsx
src/presentation/hooks/useTransactions.ts
src/data/repositories/TransactionRepository.ts
src/domain/models/Transaction.ts
```

Endpoint da API Java utilizado:

```txt
GET /marketplace/transacoes/minhas
```

---

### Perfil com Foto Editável

Tela de perfil com:

- foto de perfil;
- seleção de imagem pela galeria;
- nome do usuário;
- e-mail;
- telefone;
- perfil de acesso;
- atualização de dados;
- botão de logout.

Arquivos principais:

```text
src/presentation/screens/ProfileScreen.tsx
src/presentation/contexts/AuthContext.tsx
src/presentation/hooks/useUserProfile.ts
src/data/repositories/UserProfileRepository.ts
src/domain/models/UserProfile.ts
```

Endpoints da API Java utilizados:

```txt
GET /usuarios/{id}
PUT /usuarios/{id}
```

---

## Componentes Reutilizáveis

O projeto possui componentes reutilizáveis para reduzir repetição de código e melhorar a manutenção da interface.

Componentes principais:

```text
src/presentation/components/PrimaryButton.tsx
src/presentation/components/StatusBadge.tsx
src/presentation/components/LoadingState.tsx
src/presentation/components/ErrorState.tsx
src/presentation/components/EmptyState.tsx
src/presentation/components/ScreenContainer.tsx
src/presentation/components/MetricCard.tsx
```

Esses componentes padronizam botões, badges, estados de carregamento, erro, lista vazia e containers de tela.

---

## Usuários de Teste

A tela de login possui atalhos para preencher usuários de teste cadastrados na API Java/DML do projeto.

### Operador

```text
E-mail: joao.almeida@algaspace.com
Senha: Operador@2026
Perfil esperado: OPERADOR_CAMPO
```

### Investidor

```text
E-mail: contato@biocapital.com.br
Senha: Investidor@2026
Perfil esperado: INVESTIDOR
```

### Comprador B2B

```text
E-mail: compras@nutrialga.com.br
Senha: Comprador@2026
Perfil esperado: COMPRADOR_B2B
```

Também é possível criar um novo usuário pela tela de cadastro, escolhendo manualmente o perfil desejado.

---

## Como Executar o Projeto

Clone o repositório:

```bash
git clone https://github.com/GS1-2TDSPG-2026/gs1-mobile-application.git
```

Acesse a pasta do projeto:

```bash
cd gs1-mobile-application
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npx expo start
```

Para limpar cache:

```bash
npx expo start -c
```

Depois abra no:

- Expo Go;
- emulador Android;
- dispositivo físico via QR Code.

---

## Atenção ao Ambiente de API

A API Java está configurada como:

```txt
http://10.0.2.2:8080/api
```

Esse endereço funciona no **emulador Android**, porque `10.0.2.2` aponta para o `localhost` da máquina.

Se for testar em celular físico pelo Expo Go, troque a URL em `src/data/api/apiClient.ts` para o IP da sua máquina na rede local, por exemplo:

```txt
http://192.168.0.10:8080/api
```

A API .NET está configurada com URL pública:

```txt
https://gs1-net.onrender.com/api
```

Se a API .NET estiver rodando localmente, altere a URL em `src/data/api/dotnetApiClient.ts`.

---

## Relação com as APIs do Ecossistema

### API Java Spring Boot

Responsável pelo núcleo de negócio:

- autenticação JWT;
- perfis de acesso;
- usuários;
- fazendas;
- tanques;
- marketplace;
- transações;
- créditos de carbono;
- dados orbitais.

### API .NET

Responsável pela ingestão e inteligência operacional:

- telemetria dos tanques;
- dados IoT;
- alertas críticos;
- envio de comandos para o ESP32/MQTT;
- dados operacionais para dashboard.

### IoT ESP32

Responsável pela borda física/simulada:

- leitura de pH;
- leitura de temperatura;
- leitura de luminosidade;
- leitura de turbidez;
- publicação MQTT;
- recebimento de comandos MQTT;
- acionamento de servo motor.

---

## Diferenciais Técnicos

- Navegação adaptada por perfil de usuário.
- Login e cadastro integrados à API Java.
- Token JWT salvo localmente com AsyncStorage.
- Integração com API .NET para telemetria e IoT.
- Marketplace integrado à API Java.
- Carteira de carbono integrada à API Java.
- Tela de fazendas e tanques integrada à API Java.
- Hooks atuando como ViewModels simplificados.
- Repositories isolando o acesso às APIs.
- Telas com loading, erro e estado vazio.
- Componentes reutilizáveis para estados, botões, badges e containers.
- Ícones nas abas de navegação.
- Foto de perfil editável.
- Separação entre área operacional e área de investidor/comprador.
- Estrutura preparada para evolução com IA real e sincronização offline.


---

## Estrutura Principal de Arquivos

```text
App.tsx
index.ts
package.json
app.json
assets/images/
src/app/routes/
src/core/theme/
src/data/api/
src/data/repositories/
src/data/storage/
src/domain/models/
src/presentation/components/
src/presentation/contexts/
src/presentation/hooks/
src/presentation/screens/
```

---
## Integrantes da Equipe

| Nome | RM | Turma | GitHub | LinkedIn |
| --- | --- | --- | --- | --- |
| Alexander Dennis Isidro Mamani | 565554 | 2TDSPG | [alex-isidro](https://github.com/alex-isidro) | [LinkedIn](https://www.linkedin.com/in/alexander-dennis-a3b48824b/) |
| Arthur Brito da Silva | 562085 | 2TDSPG | [thubrito](https://github.com/thubrito) | [LinkedIn](https://www.linkedin.com/in/arthurbritodasilva/) |
| Kelson Zhang | 563748 | 2TDSPG | [KelsonZh0](https://github.com/KelsonZh0) | [LinkedIn](https://www.linkedin.com/in/kelson-zhang-211456323/) |
| Luiz Felipe Flosi dos Santos | 563197 | 2TDSPG | [felipeflosii](https://github.com/felipeflosii) | [LinkedIn](https://www.linkedin.com/in/felipeflosii/) |
| Pedro Henrique Brum Lopes | 561780 | 2TDSPG | [PedroBrum-DEV](https://github.com/PedroBrum-DEV) | [LinkedIn](https://www.linkedin.com/in/pedro-brum-66a31b326/) |

---

## Licença

Projeto desenvolvido exclusivamente para fins acadêmicos na Global Solution FIAP 2026.
