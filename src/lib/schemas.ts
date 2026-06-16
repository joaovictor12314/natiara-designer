import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(10, "Telefone obrigatório."),
  address: z.string().min(8, "Informe o endereco completo."),
  city: z.string().min(2, "Informe a cidade.")
});

export const bookingSchema = customerSchema.extend({
  serviceIds: z.array(z.string()).min(1, "Selecione pelo menos um serviço para continuar."),
  scheduledAt: z.string().min(1, "Escolha uma data e horario."),
  distanceKm: z.coerce.number().min(0, "Distancia invalida.").max(80, "Distancia fora da area inicial."),
  paymentMethod: z.enum(["pix", "credito", "debito"])
});

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.")
});

export const userRegistrationSchema = customerSchema.extend({
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  role: z.enum(["cliente", "admin"]).default("cliente")
});

export const serviceSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  durationMinutes: z.coerce.number().int().positive()
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
