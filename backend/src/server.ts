import express, { Application, request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { timeStamp } from "console";
import { uptime } from "process";

//Vai carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app: Application = express();

//Porta do servidor | puxa do .env ou usa a 5000
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======
// ROTAS
// ======

//Rota de teste
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "WS Barber API está funcionando!",
    version: "1.0.0",
    timeStamp: new Date().toISOString(),
  });
});

//Rota de veirificação da saúde da API
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

//Rota não encontrada (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log("Sevidor rodando!");
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
  console.log(`Iniciado em: ${new Date().toLocaleString("pt-BR")}`);
});
