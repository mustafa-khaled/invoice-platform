import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  address: z
    .string()
    .nonempty("Address is required")
    .min(2, "Address must be at least 2 characters"),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0, "Rate must be a positive number"),
});

export const invoiceSchema = z.object({
  invoiceName: z
    .string()
    .nonempty("Invoice name is required")
    .min(2, "Invoice name must be at least 2 characters"),

  status: z.enum(["PAID", "PENDING", "CANCELLED"]).default("PENDING"),
  total: z.coerce.number().min(1, "Minimum total is 1$"),
  currency: z.string().nonempty("Currency is required"),
  invoiceNumber: z
    .number()
    .min(1, "Invoice number must be a valid number")
    .transform(Number),

  date: z
    .string()
    .nonempty("Date is required")
    .min(1, "Date is required")
    .transform((value) => new Date(value)),

  dueDate: z
    .string()
    .nonempty("Due date is required")
    .regex(/^\d+$/, "Due date must be a valid number")
    .transform(Number),

  fromName: z
    .string()
    .nonempty("Sender name is required")
    .min(2, "Sender name must be at least 2 characters"),

  fromEmail: z
    .string()
    .nonempty("Sender email is required")
    .email("Sender email must be a valid email address"),

  fromAddress: z
    .string()
    .nonempty("Sender address is required")
    .min(2, "Sender address must be at least 2 characters"),

  clientName: z
    .string()
    .nonempty("Client name is required")
    .min(2, "Client name must be at least 2 characters"),

  clientEmail: z
    .string()
    .nonempty("Client email is required")
    .email("Client email must be a valid email address"),

  clientAddress: z
    .string()
    .nonempty("Client address is required")
    .min(2, "Client address must be at least 2 characters"),

  note: z.string().optional(),

  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one invoice item is required"),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
