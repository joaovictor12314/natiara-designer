import { loginSchema, userRegistrationSchema, type UserRegistrationInput } from "@/lib/schemas";

export type AppUser = Omit<UserRegistrationInput, "password"> & {
  id: string;
  createdAt: string;
  password?: string;
};

const STORAGE_KEY = "natiara-users";

export const adminUser: AppUser = {
  id: "admin-joao-victor",
  name: "Joao Victor Campos de Oliveira",
  email: "victoroliveira12334@gmail.com",
  phone: "64993351744",
  address: "Cadastro administrativo",
  city: "Goiania",
  role: "admin",
  createdAt: "2026-06-16T00:00:00.000Z"
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function listUsers(): AppUser[] {
  if (!canUseStorage()) {
    return [adminUser];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  const users = stored ? (JSON.parse(stored) as AppUser[]) : [];
  const usersWithoutOldAdminPassword = users.filter((user) => user.email !== adminUser.email);
  const allUsers = [adminUser, ...usersWithoutOldAdminPassword];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
  return allUsers;
}

export function createUser(input: UserRegistrationInput) {
  const data = userRegistrationSchema.parse(input);
  const users = listUsers();
  const emailExists = users.some((user) => user.email.toLowerCase() === data.email.toLowerCase());

  if (emailExists) {
    throw new Error("Este e-mail ja esta cadastrado.");
  }

  const user: AppUser = {
    ...data,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([user, ...users]));
  return user;
}

export function loginUser(input: { email: string; password: string }) {
  const data = loginSchema.parse(input);
  const user = listUsers().find(
    (item) =>
      item.role !== "admin" &&
      item.email.toLowerCase() === data.email.toLowerCase() &&
      item.password === data.password
  );

  if (!user) {
    throw new Error("E-mail ou senha incorretos.");
  }

  window.localStorage.setItem("natiara-current-user", JSON.stringify(user));
  return user;
}
