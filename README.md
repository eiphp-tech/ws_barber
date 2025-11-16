# 🚀 WS BARBER SYSTEM

Plataforma completa de gestão e agendamentos para barbearias.

## 📋 Sobre o Projeto

Sistema web full-stack para gerenciamento da barbearia com 4 perfis de usuário:

- **👑 Dono**: Controle financeiro, gestão de equipe, relatórios
- **📋 Recepcionista**: Agenda diária, cadastro de clientes, confirmações
- **✂️ Barbeiro**: Visualização da agenda, comissões, desempenho
- **👤 Cliente**: Agendamento online, histórico, avaliações

## 🛠️ Stack Tecnológica

### Backend

- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT + Bcrypt

### Frontend

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- Zustand
- React Hook Form + Zod

## 📁 Estrutura

```
ws_barber/
├── backend/     → API REST (Fastify)
├── frontend/    → Interface (Next.js)
└── docs/        → Documentação
```

## 🚀 Como Rodar

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📝 Licença

ISC License - WS Barber © 2024
