import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/schemas";
import { adminUser } from "@/lib/users";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = adminLoginSchema.safeParse({
    ...payload,
    email: typeof payload.email === "string" ? payload.email.trim() : payload.email,
    twoFactorCode:
      typeof payload.twoFactorCode === "string" ? payload.twoFactorCode.trim() : payload.twoFactorCode
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "E-mail, senha ou codigo invalidos." }, { status: 422 });
  }

  const adminEmail = process.env.ADMIN_EMAIL || adminUser.email;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminTwoFactorCode = process.env.ADMIN_2FA_CODE || "123456";

  if (!adminPassword) {
    return NextResponse.json(
      { message: "ADMIN_PASSWORD nao configurada no ambiente." },
      { status: 500 }
    );
  }

  const valid =
    parsed.data.email.toLowerCase() === adminEmail.toLowerCase() &&
    parsed.data.password === adminPassword &&
    parsed.data.twoFactorCode === adminTwoFactorCode;

  if (!valid) {
    return NextResponse.json(
      { message: "E-mail, senha ou codigo de administrador incorretos." },
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
