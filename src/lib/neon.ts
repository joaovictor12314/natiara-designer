import { neon } from "@neondatabase/serverless";

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL nao configurada.");
  }

  return neon(databaseUrl);
}

export async function listAppointmentsFromNeon() {
  const sql = getSql();

  return sql`
    select
      a.id,
      c.name as customer_name,
      a.scheduled_at,
      a.status,
      a.distance_km,
      a.displacement_fee,
      a.total
    from appointments a
    join clients c on c.id = a.client_id
    order by a.scheduled_at desc
  `;
}
