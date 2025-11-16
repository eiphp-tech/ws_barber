import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// Veirificar se JWT_SECRET está configurado
if (!process.env.JWT_SECRET) {
  console.warn("AVISO: JWT_SECRET não configurado no .env");
}

//Gerar token JWT
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

//Verificar e decodificar token JWT
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expirado");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token inválido");
    }
    throw new Error("Erro ao verificar token");
  }
};
