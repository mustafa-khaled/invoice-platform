"use server";

import { parseWithZod } from "@conform-to/zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { registerSchema, loginSchema } from "../utils/zod-schemas";
import { signIn } from "../utils/auth";
import { AuthError } from "next-auth";

export async function registerUser(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: registerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { firstName, lastName, email, password, address } = submission.value;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return submission.reply({
      formErrors: ["User with this email already exists"],
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
    },
  });

  return redirect("/login");
}

export async function loginUser(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: loginSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email, password } = submission.value;

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return submission.reply({
            formErrors: ["Invalid credentials"],
          });
        default:
          return submission.reply({
            formErrors: ["Something went wrong"],
          });
      }
    }
    throw error;
  }

  return redirect("/dashboard");
}
