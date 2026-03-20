# ⚔️ Clash Royale Clan Dashboard

Painel de análise de colaboração para líderes de clã no Clash Royale.  
Desenvolvido com **Next.js 14 + Tailwind CSS** no frontend e **Node.js + Express + TypeScript** no backend.

---

## 📸 Funcionalidades

- **Dashboard principal** — visão geral do clã com cards de métricas
- **Ranking de colaboração** — membros ordenados por score calculado
- **Membros** — tabela completa com busca, filtros e ordenação
- **Ausentes** — lista destacada de quem não participou ou colaborou pouco
- **Modal de membro** — detalhes individuais com resumo interpretado
- **Atualização manual** — botão para forçar refresh dos dados
- **Cache inteligente** — evita rate limit da API do Clash Royale
- **Design dark premium** — visual moderno, responsivo e sem template genérico

---

## 🗂️ Estrutura do Projeto

```
clash-dashboard/
├── backend/
│   ├── src/
│   │   ├── app.ts                  # Entry point Express
│   │   ├── config/
│   │   │   └── env.ts              # Variáveis de ambiente e tag encoding
│   │   ├── controllers/
│   │   │   └── clan.controller.ts  # Handlers HTTP
│   │   ├── middleware/
│   │   │   └── errorHandler.ts     # Tratamento centralizado de erros
│   │   ├── routes/
│   │   │   ├── index.ts            # Roteador raiz
│   │   │   └── clan.routes.ts      # Rotas do clã
│   │   ├── services/
│   │   │   ├── clashApi.service.ts # Chamadas à API oficial
│   │   │   └── clan.service.ts     # Lógica de negócio e processamento
│   │   ├── types/
│   │   │   └── clash.types.ts      # Tipagem completa
│   │   └── utils/
│   │       ├── cache.ts            # Cache em memória com TTL
│   │       ├── errors.ts           # Classes de erro customizadas
│   │       └── score.ts            # Engine de score de colaboração
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx          # Root layout com Sidebar e TopBar
    │   │   ├── page.tsx            # Dashboard principal
    │   │   ├── globals.css
    │   │   ├── ranking/page.tsx    # Ranking de colaboração
    │   │   ├── members/page.tsx    # Tabela de membros
    │   │   └── inactive/page.tsx   # Ausentes e baixa colaboração
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.tsx
    │   │   │   └── TopBar.tsx
    │   │   ├── ui/
    │   │   │   └── index.tsx       # Card, Badge, ScoreBar, Skeleton, etc.
    │   │   └── clan/
    │   │       ├── Badges.tsx      # RoleBadge, StatusBadge, WarBadge
    │   │       ├── ClanHeader.tsx
    │   │       ├── StatCard.tsx
    │   │       ├── MembersTable.tsx
    │   │       ├── RankingList.tsx
    │   │       ├── InactiveList.tsx
    │   │       └── MemberModal.tsx
    │   ├── hooks/
    │   │   └── useClanData.ts      # Hooks de fetching reutilizáveis
    │   ├── services/
    │   │   └── api.ts              # Camada de serviço para o backend
    │   ├── types/
    │   │   └── index.ts            # Tipos compartilhados
    │   └── lib/
    │       └── utils.ts            # cn(), formatters, helpers de cor
    ├── .env.local.example
    ├── next.config.js
    ├── tailwind.config.ts
    └── package.json
```

---

## ⚙️ Pré-requisitos

- **Node.js** v18 ou superior
- **npm** v9+
- Token da API oficial do Clash Royale

---

## 🔑 Obtendo o API Token do Clash Royale

1. Acesse [developer.clashroyale.com](https://developer.clashroyale.com)
2. Crie uma conta ou faça login
3. Vá em **My Account → Create New Key**
4. Dê um nome e coloque o **IP do seu servidor** (para uso local, use seu IP público)
5. Copie o token gerado — ele vai no `.env` do backend

> ⚠️ O token da API do Clash Royale é vinculado a IP. Para dev local, você precisa adicionar seu IP público na chave.

---

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/clash-dashboard.git
cd clash-dashboard
```

### 2. Configurar e rodar o Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3001
CLASH_API_TOKEN=seu_token_aqui
CLAN_TAG=#SEU_TAG_AQUI
CACHE_TTL_SECONDS=90
```

> A tag do clã pode ter ou não o `#` — o sistema trata automaticamente.

```bash
# Rodar em modo desenvolvimento
npm run dev
```

O backend estará disponível em: `http://localhost:3001`

---

### 3. Configurar e rodar o Frontend

Em outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.local.example .env.local
```

O `.env.local` já vem configurado para apontar para `http://localhost:3001/api`.  
Se mudar a porta do backend, atualize aqui:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

```bash
# Rodar em modo desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

---

## 🔌 Rotas da API

| Método | Rota                    | Descrição                            |
| ------ | ----------------------- | ------------------------------------ |
| `GET`  | `/api/health`           | Status da API                        |
| `GET`  | `/api/clan/overview`    | Visão geral do clã                   |
| `GET`  | `/api/clan/members`     | Lista de membros processados         |
| `GET`  | `/api/clan/ranking`     | Ranking de colaboração               |
| `GET`  | `/api/clan/inactive`    | Membros ausentes / baixa colaboração |
| `GET`  | `/api/clan/member/:tag` | Detalhes de um membro específico     |
| `POST` | `/api/clan/refresh`     | Força atualização do cache           |

---

## 📊 Como funciona o Score de Colaboração

O score é calculado de **0 a 100** com os seguintes pesos:

| Critério                      | Peso   | Observação                     |
| ----------------------------- | ------ | ------------------------------ |
| Presença na guerra            | 20 pts | Binário: participou ou não     |
| Fama / contribuição na guerra | 35 pts | Normalizado pelo melhor do clã |
| Decks usados na guerra        | 15 pts | Normalizado pelo melhor do clã |
| Ataques ao barco              | 10 pts | Normalizado pelo melhor do clã |
| Doações                       | 20 pts | Normalizado pelo maior doador  |

**Penalidade:** -15 pts para quem entrou na guerra mas usou 0 decks.

### Classificação por score:

| Score  | Status     | Significado        |
| ------ | ---------- | ------------------ |
| 80–100 | 🏆 Campeão | Destaque do clã    |
| 60–79  | ✅ Ativo   | Colabora bem       |
| 40–59  | 🔵 Regular | Participação média |
| 20–39  | ⚠️ Baixo   | Precisa melhorar   |
| 0–19   | ❌ Inativo | Colaboração mínima |

Para ajustar os pesos, edite o arquivo:  
`backend/src/utils/score.ts` → objeto `WEIGHTS`

---

## 🔄 Trocando o Clã

Basta alterar a variável `CLAN_TAG` no `.env` do backend:

```env
CLAN_TAG=#NOVO_TAG
```

E reiniciar o backend. O sistema buscará automaticamente os dados do novo clã.

---

## 🧱 Arquitetura e Decisões Técnicas

- **Cache em memória** — simples e eficaz para MVP; extensível para Redis
- **Processamento no backend** — o frontend recebe dados prontos, sem lógica de negócio exposta
- **Normalização de scores** — os scores são relativos ao melhor do clã, não absolutos
- **Estrutura em camadas** — `routes → controllers → services → utils` facilita testes e manutenção
- **Tipagem forte** — sem `any`, tipos compartilhados entre serviços

---

## 🔭 Próximos Passos (pós-MVP)

- [ ] Suporte a múltiplos clãs com seleção por URL
- [ ] Autenticação de admin (NextAuth ou JWT)
- [ ] Banco de dados (PostgreSQL + Prisma) para histórico por temporada
- [ ] Gráficos de evolução do score por semana (Recharts / Chart.js)
- [ ] Relatórios em PDF exportáveis
- [ ] Notificações por webhook (Discord)
- [ ] Deploy com Docker Compose (backend + frontend + Redis)

---

## 📄 Licença

MIT — use, modifique e distribua livremente.
