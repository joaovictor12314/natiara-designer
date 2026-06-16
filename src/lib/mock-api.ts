import { initialAppointments, initialClients, services, weeklyRevenueSeed } from "@/lib/data";
import {
  calculateAppointmentTotal,
  calculateDisplacementFee,
  calculateServicesTotal
} from "@/lib/pricing";
import { bookingSchema, type BookingInput } from "@/lib/schemas";
import type { Appointment } from "@/types";

let appointments: Appointment[] = [...initialAppointments];

function wait(ms = 260) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function selectedServiceNames(serviceIds: string[]) {
  return services.filter((service) => serviceIds.includes(service.id)).map((service) => service.name);
}

function buildServiceDemand() {
  return services.map((service) => ({
    name: service.name.replace("Design de ", "").replace("Extensao de ", ""),
    total: appointments.filter((appointment) => appointment.serviceIds.includes(service.id)).length
  }));
}

function buildRevenueTrend() {
  const currentRevenue = appointments.reduce((total, appointment) => total + appointment.total, 0);
  const currentAppointments = appointments.length;

  return [
    ...weeklyRevenueSeed,
    {
      label: "Atual",
      revenue: currentRevenue,
      appointments: currentAppointments
    }
  ];
}

export async function listDashboardData() {
  await wait();

  const confirmed = appointments.filter((appointment) => appointment.status !== "cancelado");
  const revenue = confirmed.reduce((total, appointment) => total + appointment.total, 0);
  const popularService = buildServiceDemand().sort((a, b) => b.total - a.total)[0];

  return {
    metrics: {
      revenue,
      clients: initialClients.length,
      appointments: confirmed.length,
      popularService: popularService?.name ?? "Sem dados"
    },
    appointments: [...appointments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    revenueTrend: buildRevenueTrend(),
    serviceDemand: buildServiceDemand()
  };
}

export async function createAppointment(input: BookingInput) {
  await wait(180);
  const data = bookingSchema.parse(input);
  const total = calculateAppointmentTotal(data.serviceIds, data.distanceKm);

  const appointment: Appointment = {
    id: `ag-${Date.now()}`,
    customerName: data.name,
    customerEmail: data.email,
    customerPhone: data.phone,
    address: data.address,
    city: data.city,
    serviceIds: data.serviceIds,
    scheduledAt: data.scheduledAt,
    distanceKm: data.distanceKm,
    displacementFee: calculateDisplacementFee(data.distanceKm),
    paymentMethod: data.paymentMethod,
    status: "confirmado",
    total,
    createdAt: new Date().toISOString()
  };

  appointments = [appointment, ...appointments];
  return appointment;
}

export async function createSampleAppointment() {
  const sample: BookingInput = {
    name: "Camila Rocha",
    email: `camila.${appointments.length + 1}@email.com`,
    phone: "(62) 98888-1000",
    address: "Setor Marista, Goiania",
    city: "Goiania",
    serviceIds: appointments.length % 2 === 0 ? ["sobrancelhas"] : ["limpeza-pele", "sobrancelhas"],
    scheduledAt: "2026-06-25T15:00",
    distanceKm: appointments.length % 2 === 0 ? 8 : 12,
    paymentMethod: "pix"
  };

  return createAppointment(sample);
}

export function describeAppointmentServices(serviceIds: string[]) {
  return selectedServiceNames(serviceIds).join(", ");
}

export function previewBookingTotal(serviceIds: string[], distanceKm: number) {
  return {
    subtotal: calculateServicesTotal(serviceIds),
    displacementFee: calculateDisplacementFee(distanceKm),
    total: calculateAppointmentTotal(serviceIds, distanceKm)
  };
}
