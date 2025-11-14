// Arquivo: backend/src/server.ts

import Fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

// Criar instância do Fastify
const app: FastifyInstance = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty", // Logs coloridos
      options: {
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});

// Porta do servidor
const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    // CORS: Permite frontend acessar a API
    await app.register(cors, {
      origin: "http://localhost:3000",
      credentials: true,
    });

    // Form Body: Parse de dados de formulários
    await app.register(formbody);

    // Rota raiz (teste)
    app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        message: "WS Barber API com Fastify!",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      };
    });

    // Health check
    app.get("/health", async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        status: "OK",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: "PostgreSQL Local",
      };
    });

    // 404 - Rota não encontrada
    app.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        error: "Rota não encontrada",
        path: request.url,
      });
    });

    // Erro global
    app.setErrorHandler((error, request, reply) => {
      app.log.error(error);

      reply.status(error.statusCode || 500).send({
        error: "Erro interno do servidor",
        message: error.message,
      });
    });

    await app.listen({ port: PORT, host: "0.0.0.0" });

    console.log("");
    console.log("========================================");
    console.log("Servidor rodando!");
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
    console.log(
      `Banco: PostgreSQL Local (${
        process.env.DATABASE_URL?.split("@")[1]?.split("/")[0]
      })`
    );
    console.log(`Iniciado: ${new Date().toLocaleString("pt-BR")}`);
    console.log("========================================");
    console.log("");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

// Iniciar o servidor
startServer();
