import { FastifyInstance } from "fastify";
import {
  list,
  getById,
  create,
  update,
  remove,
  toggle,
} from "../controllers/service.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";

export const serviceRoutes = async (app: FastifyInstance) => {
  // Listar serviços (todos os usuários autenticados podem ver)
  app.get(
    "/",
    {
      preHandler: [authenticate],
    },
    list
  );

  // Buscar serviço por ID (todos os usuários autenticados)
  app.get(
    "/:id",
    {
      preHandler: [authenticate],
    },
    getById
  );

  // Criar serviço (apenas DONO)
  app.post(
    "/",
    {
      preHandler: [authenticate, authorize(Role.DONO)],
    },
    create
  );

  // Atualizar serviço (apenas DONO)
  app.put(
    "/:id",
    {
      preHandler: [authenticate, authorize(Role.DONO)],
    },
    update
  );

  // Deletar serviço (apenas DONO)
  app.delete(
    "/:id",
    {
      preHandler: [authenticate, authorize(Role.DONO)],
    },
    remove
  );

  // Ativar/Desativar serviço (apenas DONO)
  app.patch(
    "/:id/toggle",
    {
      preHandler: [authenticate, authorize(Role.DONO)],
    },
    toggle
  );
};
