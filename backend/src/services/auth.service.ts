import { date, email } from "zod";
import prisma from "../config/prisma";
import { RegisterDto, LoginDto, AuthResponde } from "../types/auth.types";
import { hashPassword, comparePassword } from "../utils/hash.util";
import { generateToken } from "../utils/jwt.util";
import { fa, tr } from "zod/v4/locales";

//SERVIÇO DE AUTENTICAÇÃO - Onde ira conter a lógica de negócio

//Registrar novo usuário

export const registerUser = async (
  data: RegisterDto
): Promise<AuthResponde> => {
  //Verificar se email já existe

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email já cadastrado");
  }

  //Hash da senha
  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: data.role || "CLIENTE",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  // Gerar token JWT
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user,
  };
};

// Fazer Login

export const loginUser = async (data: LoginDto): Promise<AuthResponde> => {
  //Buscar usuário por email
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Email ou senha inválido");
  }

  //Verificar se usuário está ativo
  if (!user.active) {
    throw new Error("Usuário inativo. Entre em contato com o administrador.");
  }

  //Verificar senha
  const IsPasswordValid = await comparePassword(data.password, user.password);

  if (!IsPasswordValid) {
    throw new Error("Email ou senha inválido");
  }

  //Gerar token JWT
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
};

//buscar usuário autenticado
export const getAuthenticatedUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
};
