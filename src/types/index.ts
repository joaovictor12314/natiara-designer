export type PaymentMethod = "pix" | "credito" | "debito";

export type AppointmentStatus = "confirmado" | "pendente" | "cancelado" | "reagendado";

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  priority: "Alta" | "Media" | "Baixa";
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

export type Appointment = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  serviceIds: string[];
  scheduledAt: string;
  distanceKm: number;
  displacementFee: number;
  paymentMethod: PaymentMethod;
  status: AppointmentStatus;
  total: number;
  createdAt: string;
};

export type Requirement = {
  code: string;
  title: string;
  priority: "Alta" | "Media" | "Baixa";
  testCases: string[];
};

export type RiskItem = {
  risk: string;
  probability: "Baixa" | "Media" | "Alta";
  impact: "Baixo" | "Medio" | "Alto";
  treatment: string;
};
