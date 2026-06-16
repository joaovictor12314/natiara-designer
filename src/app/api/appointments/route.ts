import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = bookingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados invalidos", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  return NextResponse.json({
    message: "Agendamento validado",
    appointment: parsed.data
  });
}
