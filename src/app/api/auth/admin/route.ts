import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { adminUser } from "@/lib/users";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "E-mail ou senha invalidos." }, { status: 422 });
  }

  const adminEmail = process.env.ADMIN_EMAIL || adminUser.email;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { message: "ADMIN_PASSWORD nao configurada no ambiente." },
      { status: 500 }
    );
  }

  const valid =
    parsed.data.email.toLowerCase() === adminEmail.toLowerCase() &&
    parsed.data.password === adminPassword;

  if (!valid) {
    return NextResponse.json(
      { message: "E-mail ou senha de administrador incorretos." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: {
      ...adminUser,
      email: adminEmail
    }
  });
}
