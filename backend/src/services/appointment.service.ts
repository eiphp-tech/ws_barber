import { tr } from "zod/v4/locales";
import prisma from "../config/prisma";

interface CreateAppointmentDTO {
  userId: string;
  barberId: string;
  serviceId: string;
  date: Date;
}

interface ListAppointmentsDTO {
  userId: string;
  role: string;
  startDate?: Date;
  endDate?: Date;
}

export class AppointmentService {
  async create({ userId, barberId, serviceId, date }: CreateAppointmentDTO) {
    if (date < new Date()) {
      throw new Error("Não é possível agendar em uma data passada.");
    }

    const barber = await prisma.user.findFirst({
      where: {
        id: barberId,
        role: "BARBEIRO",
        active: true,
      },
    });
    if (!barber) throw new Error("Barbeiro não encontrado ou inativo.");

    const service = await prisma.service.findUnique({
      where: { id: serviceId, active: true },
    });
    if (!service) throw new Error("Serviço não encontrado ou inativo.");

    const conflict = await prisma.booking.findFirst({
      where: {
        barberId,
        date: date,
        status: { not: "CANCELLED" },
      },
    });
    if (conflict) throw new Error("Horário indisponível para o barbeiro.");

    const booking = await prisma.booking.create({
      data: {
        clientId: userId,
        barberId,
        serviceId,
        date,
        status: "CONFIRMED",
      },
      include: {
        service: true,
        barber: { select: { name: true, id: true } },
        client: { select: { name: true, id: true } },
      },
    });
    return booking;
  }

  async list({ userId, role, startDate, endDate }: ListAppointmentsDTO) {
    const where: any = {};
    if (role === "BARBEIRO") {
      where.barberId = userId;
    } else {
      where.clientId = userId;
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const appointments = await prisma.booking.findMany({
      where,
      orderBy: {
        date: "asc", // Ordenar do mais antigo para o mais recente (ou desc)
      },
      include: {
        service: {
          select: { name: true, price: true, duration: true },
        },
        barber: {
          select: { name: true, avatar: true },
        },
        client: {
          select: { name: true, phone: true },
        },
      },
    });

    return appointments;
  }

  async cancel(bookingId: string, userId: string, role: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new Error("Agendamento não encontrado.");

    if (role === "CLIENT" && booking.clientId !== userId)
      throw new Error("Você não tem permissão para cancelar este agendamento.");

    if (role === "BARBEIRO" && booking.barberId !== userId)
      throw new Error("Você não tem permissão para cancelar este agendamento.");

    if (booking.status === "CANCELLED")
      throw new Error("Este agendamento já foi cancelado.");

    const now = new Date();
    if (booking.date < now)
      throw new Error("Não é possível cancelar um agendamento passado.");

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
    return updatedBooking;
  }
}
