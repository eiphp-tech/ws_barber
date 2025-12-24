import dotenv from "dotenv";
dotenv.config();

import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import { authRoutes } from "./routes/auth.routes";
import { serviceRoutes } from "./routes/service.routes";
import { barberRoutes } from "./routes/barber.routes"; // ← NOVO
import { request } from "http";
import { timeStamp } from "console";
import { Stats } from "fs";
import { success } from "zod";

const app: FastifyInstance = fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});

const PORT = Number(process.env.PORT) || 5000; // Porta do servidor

//Function de inicialização

async function startServer() {
  try {
    // CORS
    await app.register(cors, {
      origin: "http://localhost:3000",
      credentials: true,
    });

    await app.register(formbody);

    //Rota raiz
    app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        message: "WS Barber API com Fastify",
        version: "1.0.0",
        timeStamp: new Date().toISOString(),
        endpoints: {
          auth: "/auth",
          docs: "/docs",
        },
      };
    });

    //Health check
    app.get("/health", async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        status: "OK",
        uptime: process.uptime(),
        anvitonment: process.env.NODE_ENV,
        db: "PostgreSQL Local",
      };
    });

    //Rota de Teste do banco
    app.get(
      "/test-db",
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const { default: prisma } = await import("./config/prisma");

          await prisma.$connect();

          const stats = {
            user: {
              total: await prisma.user.count(),
              byRole: await prisma.user.groupBy({
                by: ["role"],
                _count: true,
              }),
              active: await prisma.user.count({
                where: {
                  active: true,
                },
              }),
            },
            services: {
              total: await prisma.service.count(),
              active: await prisma.service.count({
                where: {
                  active: true,
                },
              }),
              totalValue: await prisma.service.aggregate({
                _sum: { price: true },
                _avg: { price: true },
              }),
            },
            bookings: {
              total: await prisma.booking.count(),
              byStatus: await prisma.booking.groupBy({
                by: ["status"],
                _count: true,
              }),
            },
            transactions: {
              total: await prisma.transaction.count(),
              totalRevenue: await prisma.transaction.aggregate({
                _sum: { amount: true },
              }),
            },
            reviews: {
              total: await prisma.review.count(),
              averageRating: await prisma.review.aggregate({
                _avg: { rating: true },
              }),
            },
            barberSchedules: {
              total: await prisma.barberSchedule.count(),
            },
          };

          return {
            status: "success",
            message: "PostgreSQL Local conectado!",
            database: "ws_barber",
            timestamp: new Date().toISOString(),
            Stats,
          };
        } catch (error) {
          app.log.error(error);

          return reply.status(500).send({
            status: "error",
            message: "Erro ao conectar no banco",
            error: error instanceof Error ? error.message : "Erro desconhecido",
          });
        }
      }
    );

    await app.register(authRoutes, {
      prefix: "/auth",
    });

    await app.register(serviceRoutes, { prefix: "/services" });

    await app.register(barberRoutes, { prefix: "/barbers" });

    //Erro global
    app.setErrorHandler((error, request, reply) => {
      app.log.error(error);

      reply.status(error.statusCode || 500).send({
        success: false,
        message: error.message || "Erro interno do servidor",
      });
    });

    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log("");
    console.log("========================================");
    console.log("Servidor Fastify rodando!");
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
    console.log(`Banco: PostgreSQL Local`);
    console.log(`Autenticação: JWT`);
    console.log(`Iniciado: ${new Date().toLocaleString("pt-BR")}`);
    console.log("========================================");
    console.log("");
    console.log("📚 Rotas disponíveis:");
    console.log("   GET  / (raiz)");
    console.log("   GET  /health");
    console.log("   GET  /test-db");
    console.log("   POST /auth/register");
    console.log("   POST /auth/login");
    console.log("   GET  /auth/me (protegida)");
    console.log("   GET  /services (autenticada)");
    console.log("   POST /services (BARBER)");
    console.log("   PUT  /services/:id (BARBER)");
    console.log("   DELETE /services/:id (BARBER)");
    console.log("   GET  /barbers (autenticada)"); // ← NOVO
    console.log("   GET  /barbers/:id (autenticada)"); // ← NOVO
    console.log("   POST /barbers (BARBER)"); // ← NOVO
    console.log("   PUT  /barbers/:id (BARBER)"); // ← NOVO
    console.log("   DELETE /barbers/:id (BARBER)"); // ← NOVO
    console.log("   POST /barbers/:id/schedule (BARBER)"); // ← NOVO
    console.log("   GET  /barbers/:id/schedule (autenticada)"); // ← NOVO
    console.log("");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();
