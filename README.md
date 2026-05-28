# Phycocarbon Mobile

Aplicativo mobile desenvolvido em **React Native com Expo** para a plataforma **Phycocarbon**, uma solução de bioeconomia que combina microalgas, IoT, dados orbitais, inteligência artificial e créditos de carbono.

O app tem como objetivo oferecer uma interface mobile para operadores de campo, investidores ESG e compradores B2B acompanharem o ciclo produtivo de microalgas, o monitoramento dos tanques, alertas críticos, previsões de biomassa, carteira de carbono e marketplace de ativos sustentáveis.

---

## Status do Projeto

> Em desenvolvimento acadêmico para a Global Solution FIAP 2026.

Atualmente, o projeto mobile está em fase inicial de estruturação, com foco em:

* Configuração do projeto Expo
* Organização de arquitetura mobile
* Identidade visual inicial
* Splash screen e logo
* Autenticação mockada por perfil
* Preparação para consumo futuro das APIs Java e .NET

As APIs ainda estão em desenvolvimento, por isso algumas funcionalidades serão inicialmente simuladas com dados mockados.

---

## Nome do Projeto

**Phycocarbon**

Plataforma Space-to-Ocean de bioeconomia e segurança alimentar, voltada à produção inteligente de microalgas, geração de créditos de carbono auditáveis e apoio ao combate à fome.

---

## Objetivo do Aplicativo Mobile

O aplicativo mobile será a camada de experiência do usuário da solução Phycocarbon.

Ele permitirá que diferentes perfis acessem funcionalidades específicas:

### Operador de Fazenda

Usuário responsável pela operação local dos tanques de microalgas.

Funcionalidades previstas:

* Visualizar dashboard operacional
* Acompanhar pH, temperatura, turbidez e luminosidade
* Ver status dos dispositivos IoT/ESP32
* Receber alertas críticos
* Consultar previsões de crescimento de biomassa
* Registrar coletas ou eventos operacionais

### Investidor ESG

Usuário interessado no acompanhamento ambiental e financeiro da produção.

Funcionalidades previstas:

* Visualizar carteira de créditos de carbono
* Acompanhar CO₂ sequestrado
* Consultar histórico de transações
* Validar créditos com rastreabilidade
* Acessar indicadores ambientais

### Comprador B2B

Usuário interessado na compra de biomassa ou créditos de carbono.

Funcionalidades previstas:

* Acessar marketplace
* Visualizar lotes de microalgas disponíveis
* Consultar detalhes de lotes
* Realizar intenção de compra
* Acompanhar transações comerciais

---

## Tecnologias Utilizadas

* React Native
* Expo
* TypeScript
* React Navigation
* Axios
* AsyncStorage
* StyleSheet
* Git Flow

---

## Arquitetura Mobile

O projeto segue uma organização inspirada em **Clean Architecture** e **MVVM simplificado**, separando responsabilidades entre telas, componentes, estado, repositórios, modelos e configurações.

Estrutura planejada:

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

---

## Integração com APIs

O app foi planejado para consumir duas APIs principais:

### API Java Spring Boot

Responsável pelo núcleo de negócio:

* Autenticação JWT
* Usuários e perfis
* Fazendas
* Marketplace
* Transações
* Créditos de carbono

### API .NET

Responsável pela ingestão e inteligência operacional:

* Telemetria dos tanques
* Dados de sensores IoT
* Alertas críticos
* Dados orbitais
* Previsões de IA

Enquanto as APIs não estiverem prontas, o app utilizará dados mockados para simular os fluxos principais.

---

## Perfis de Acesso

A navegação do app será baseada no perfil do usuário autenticado.

Perfis previstos:

```text
OPERADOR_FAZENDA
INVESTIDOR_ESG
COMPRADOR_B2B
```

Cada perfil terá acesso a telas e funcionalidades específicas.

---

## Telas Planejadas

### Autenticação

* Login
* Recuperação de sessão

### Área do Operador

* Dashboard Operacional
* Tanques Monitorados
* Alertas Críticos
* Previsões de IA
* Perfil do Usuário

### Área do Investidor / Comprador

* Marketplace
* Carteira de Carbono
* Histórico de Transações
* Detalhe do Lote
* Perfil do Usuário

---

## Como Executar o Projeto

Clone o repositório:

```bash
git clone <url-do-repositorio>
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

Depois, abra no:

* Expo Go
* Emulador Android
* Dispositivo físico via QR Code

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

Exemplo:

```env
EXPO_PUBLIC_JAVA_API_URL=http://10.0.2.2:8080
EXPO_PUBLIC_DOTNET_API_URL=http://10.0.2.2:5000
```

Observação:

No emulador Android, `10.0.2.2` aponta para o `localhost` da máquina.

---

## Login Mockado

Enquanto a API Java não estiver pronta, serão usados usuários mockados para simular autenticação e navegação por perfil.

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

## Fluxo de Desenvolvimento com Git Flow

O projeto utiliza Git Flow para organizar o desenvolvimento.

Branches principais:

```text
main
develop
feature/*
release/*
hotfix/*
```

Exemplo para criar uma nova feature:

```bash
git flow feature start nome-da-feature
```

Finalizar feature:

```bash
git flow feature finish nome-da-feature
```

---


## Equipe

Projeto acadêmico desenvolvido para a Global Solution FIAP 2026.

Integrantes:

* Alexander Dennis Isidro
* Arthur Brito da Silva
* Kelson Zhang
* Luiz Felipe Flosi dos Santos
* Pedro Henrique Brum Lopes

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais.
