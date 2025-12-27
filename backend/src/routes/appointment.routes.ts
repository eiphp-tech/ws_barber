import { FastifyInstance } from "fastify";
import { AppointmentController } from "../controllers/appointment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const appointmentController = new AppointmentController();

export async function appointmentRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  app.post("/", appointmentController.create);

  app.get("/", appointmentController.list);

  app.patch("/:id/cancel", appointmentController.cancel);
}
