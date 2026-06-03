# Phycocarbon Mobile

Aplicativo mobile desenvolvido em **React Native com Expo e TypeScript** para a plataforma **Phycocarbon**, projeto acadêmico da **Global Solution FIAP 2026**.

O Phycocarbon é uma solução de bioeconomia que conecta **microalgas, IoT, dados orbitais, inteligência artificial, créditos de carbono e marketplace B2B**. A proposta é apoiar o monitoramento de fazendas automatizadas de microalgas, prever crescimento de biomassa, gerar créditos de carbono auditáveis e facilitar a comercialização de biomassa e ativos ambientais.

---

## Objetivo do App

O aplicativo mobile representa a camada de experiência do usuário da plataforma Phycocarbon.

Ele foi projetado para atender dois grupos principais:

### Operador de Fazenda

Usuário responsável pela operação local dos tanques de microalgas e dispositivos IoT.

Funcionalidades implementadas:

* Login mockado por perfil
* Dashboard operacional de telemetria
* Visualização de tanques monitorados
* Status de sensores e dispositivos ESP32
* Controle simulado de atuadores IoT
* Alertas críticos de operação
* Previsões de IA para biomassa
* Dados orbitais usados na operação
* Perfil com foto editável

### Investidor ESG / Comprador B2B

Usuário voltado à análise ambiental, créditos de carbono e marketplace.

Funcionalidades implementadas:

* Login mockado por perfil
* Marketplace com CRUD mockado de lotes
* Cadastro de lote de biomassa ou crédito de carbono
* Reserva, venda e exclusão de lotes
* Carteira de créditos de carbono
* Histórico de transações
* Visualização de hash de auditoria
* Perfil com foto editável

---

## Tecnologias Utilizadas

* React Native
* Expo
* TypeScript
* React Navigation
* AsyncStorage
* Expo Image Picker
* Expo Vector Icons
* StyleSheet
* Git Flow
* Prettier

---

## Arquitetura do Projeto

O projeto segue uma organização inspirada em **Clean Architecture** e **MVVM simplificado**, separando responsabilidades entre telas, hooks, repositories, models, contextos e componentes reutilizáveis.

```text
src/
├── app/
│   └── routes/
├── core/
│   ├── config/
│   └── theme/
├── data/
│   ├── api/
│   ├── repositories/
│   └── storage/
├── domain/
│   └── models/
├── presentation/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   └── screens/
│       ├── auth/
│       ├── operator/
│       └── investor/
└── shared/
    └── utils/
```

### Responsabilidades das Camadas

| Camada                    | Responsabilidade                                |
| ------------------------- | ----------------------------------------------- |
| `app/routes`              | Controle de navegação e rotas por perfil        |
| `core/theme`              | Cores, espaçamentos e tipografia                |
| `data/repositories`       | Simulação de dados e futura integração com APIs |
| `data/storage`            | Persistência local com AsyncStorage             |
| `domain/models`           | Tipagens e contratos do domínio                 |
| `presentation/screens`    | Telas do aplicativo                             |
| `presentation/hooks`      | Estados e regras de tela                        |
| `presentation/components` | Componentes reutilizáveis de interface          |

---

## Perfis de Acesso

O app adapta sua navegação de acordo com o perfil do usuário autenticado.

### OPERADOR_FAZENDA

Acesso às abas:

* Operação
* IoT
* IA
* Orbital
* Alertas
* Perfil

### INVESTIDOR_ESG

Acesso às abas:

* Marketplace
* Transações
* Carbono
* Perfil

### COMPRADOR_B2B

Acesso às abas:

* Marketplace
* Transações
* Carbono
* Perfil

---

## Funcionalidades Implementadas

### Autenticação Mockada

O app possui autenticação simulada com persistência local de sessão.

A sessão é salva com `AsyncStorage`, permitindo que o usuário permaneça logado mesmo após fechar e abrir o app novamente.

Arquivo principal:

```text
src/presentation/contexts/AuthContext.tsx
```

---

### Navegação por Perfil

A navegação é controlada de acordo com o perfil retornado no login mockado.

Arquivos principais:

```text
src/app/routes/AppRoutes.tsx
src/app/routes/AuthRoutes.tsx
src/app/routes/OperatorRoutes.tsx
src/app/routes/InvestorRoutes.tsx
```

---

### Dashboard Operacional

Tela voltada ao operador de fazenda.

Exibe:

* Status do ESP32
* Previsão da IA
* Confiança do modelo
* Tanques monitorados
* pH
* Temperatura
* Turbidez
* Luminosidade
* Status operacional do tanque

Arquivos principais:

```text
src/presentation/screens/operator/DashboardOperacionalScreen.tsx
src/presentation/hooks/useTelemetryDashboard.ts
src/data/repositories/TelemetryRepository.ts
src/domain/models/Telemetry.ts
```

---

### Controle IoT

Tela que simula comandos enviados ao ESP32 do biofotorreator.

Comandos disponíveis:

* Ligar/desligar bomba de oxigênio
* Ligar/desligar cooler
* Ligar/desligar injetor de CO₂
* Ligar/desligar bomba de colheita
* Atualizar status do dispositivo

Arquivos principais:

```text
src/presentation/screens/operator/DeviceControlScreen.tsx
src/presentation/hooks/useIoTDevice.ts
src/data/repositories/IoTDeviceRepository.ts
src/domain/models/IoTDevice.ts
```

---

### Previsões de IA

Tela que simula previsões de crescimento de biomassa para as próximas 48 horas.

Exibe:

* Biomassa atual
* Biomassa prevista
* Crescimento percentual
* Confiança do modelo
* Data estimada de colheita
* Radiação PAR
* Índice UV
* Nebulosidade
* Risco operacional
* Recomendação por tanque

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

Exibe fontes simuladas como:

* NASA POWER
* Copernicus Climate Data
* NOAA Climate Feed

Métricas exibidas:

* Radiação PAR
* Índice UV
* Nebulosidade
* Temperatura externa
* Previsão climática
* Impacto na biomassa
* Risco operacional

Arquivos principais:

```text
src/presentation/screens/operator/OrbitalDataScreen.tsx
src/presentation/hooks/useOrbitalData.ts
src/data/repositories/OrbitalDataRepository.ts
src/domain/models/OrbitalData.ts
```

---

### Alertas Críticos

Tela que simula alertas operacionais gerados a partir das métricas dos tanques.

Funcionalidades:

* Listar alertas abertos
* Filtrar alertas resolvidos
* Ver todos os alertas
* Marcar alerta como resolvido

Arquivos principais:

```text
src/presentation/screens/operator/AlertasCriticosScreen.tsx
src/presentation/hooks/useCriticalAlerts.ts
src/data/repositories/CriticalAlertRepository.ts
src/domain/models/CriticalAlert.ts
```

---

### Marketplace

Tela voltada ao investidor ESG e comprador B2B.

Funcionalidades CRUD mockadas:

* Criar lote
* Listar lotes
* Reservar lote
* Vender lote
* Excluir lote

Tipos de ativos:

* Biomassa
* Crédito de carbono

Arquivos principais:

```text
src/presentation/screens/investor/MarketplaceScreen.tsx
src/presentation/hooks/useMarketplace.ts
src/data/repositories/MarketplaceRepository.ts
src/domain/models/MarketplaceLot.ts
```

---

### Carteira de Carbono

Tela que simula o extrato ambiental e financeiro da carteira de créditos.

Exibe:

* CO₂ sequestrado
* Créditos disponíveis
* Valor estimado
* Última validação
* Lista de créditos
* Status do crédito
* Hash de auditoria

Arquivos principais:

```text
src/presentation/screens/investor/CarteiraCarbonoScreen.tsx
src/presentation/hooks/useCarbonWallet.ts
src/data/repositories/CarbonWalletRepository.ts
src/domain/models/CarbonCredit.ts
```

---

### Histórico de Transações

Tela que simula o histórico financeiro e comercial da plataforma.

Exibe:

* Total transacionado
* Transações concluídas
* Transações pendentes
* Compras
* Vendas
* Biomassa
* Créditos de carbono
* Hash de auditoria

Arquivos principais:

```text
src/presentation/screens/investor/TransactionHistoryScreen.tsx
src/presentation/hooks/useTransactions.ts
src/data/repositories/TransactionRepository.ts
src/domain/models/Transaction.ts
```

---

### Perfil com Foto Editável

Tela de perfil com:

* Foto de perfil
* Seleção de imagem pela galeria
* Nome do usuário
* E-mail
* Perfil de acesso
* Botão de logout

Arquivos principais:

```text
src/presentation/screens/ProfileScreen.tsx
src/presentation/contexts/AuthContext.tsx
```

---

## Usuários Mockados

Enquanto as APIs Java e .NET ainda estão em desenvolvimento, o app utiliza autenticação mockada.

### Operador

```text
E-mail: operador@phycocarbon.com
Senha: 123456
Perfil: OPERADOR_FAZENDA
```

### Investidor

```text
E-mail: investidor@phycocarbon.com
Senha: 123456
Perfil: INVESTIDOR_ESG
```

### Comprador B2B

```text
E-mail: comprador@phycocarbon.com
Senha: 123456
Perfil: COMPRADOR_B2B
```

---

## Integração Futura com APIs

O ecossistema do projeto prevê duas APIs principais.

### API Java Spring Boot

Responsável pelo núcleo de negócio:

* Autenticação JWT
* Perfis de acesso
* Usuários
* Fazendas
* Marketplace
* Transações
* Créditos de carbono

### API .NET

Responsável pela ingestão e inteligência operacional:

* Telemetria dos tanques
* Dados IoT
* Alertas críticos
* Dados orbitais
* Previsões de IA
* Comunicação com ESP32/MQTT

No estágio atual, essas integrações ainda estão simuladas por repositories mockados.

---

## Como Executar o Projeto

Clone o repositório:

```bash
git clone https://github.com/GS1-2TDSPG-2026/gs1-mobile-application.git
```

Acesse a pasta:

```bash
cd phycocarbon-mobile
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

* Expo Go
* Emulador Android
* Dispositivo físico via QR Code

---

## Diferenciais Técnicos

* Navegação adaptada por perfil de usuário
* Organização em camadas
* Hooks como ViewModels simplificados
* Repositories mockados simulando APIs futuras
* Persistência local de sessão com AsyncStorage
* CRUD mockado no marketplace
* Telas com loading, erro e estado vazio
* Ícones nas abas de navegação
* Foto de perfil editável
* Separação entre área operacional e área de investidor/comprador
* Estrutura preparada para integração posterior com APIs Java e .NET

---

## Relação com o Tema da Global Solution

O projeto se conecta ao tema **“O Espaço é a nova fronteira”** por utilizar dados orbitais como insumo para tomada de decisão no cultivo de microalgas.

O app mobile demonstra essa conexão por meio das telas de:

* Dados Orbitais
* Previsões de IA
* Dashboard Operacional
* Controle IoT
* Carteira de Carbono
* Marketplace B2B

A proposta vai além de um app comum de monitoramento, integrando sustentabilidade, bioeconomia, sensores, dados espaciais e ativos ambientais.


---

## Licença

Projeto desenvolvido exclusivamente para fins acadêmicos.
