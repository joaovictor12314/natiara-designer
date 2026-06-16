import { services } from "@/lib/data";

export const DISPLACEMENT_THRESHOLD_KM = 10;
export const DISPLACEMENT_FEE = 15;
export const RESCHEDULE_LIMIT_HOURS = 24;

export function calculateDisplacementFee(distanceKm: number) {
  return distanceKm >= DISPLACEMENT_THRESHOLD_KM ? DISPLACEMENT_FEE : 0;
}

export function calculateServicesTotal(serviceIds: string[]) {
  return services
    .filter((service) => serviceIds.includes(service.id))
    .reduce((total, service) => total + service.price, 0);
}

export function calculateAppointmentTotal(serviceIds: string[], distanceKm: number) {
  return calculateServicesTotal(serviceIds) + calculateDisplacementFee(distanceKm);
}

export function canChangeAppointment(scheduledAt: string, now = new Date()) {
  const scheduledDate = new Date(scheduledAt);
  const diffMs = scheduledDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= RESCHEDULE_LIMIT_HOURS;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
