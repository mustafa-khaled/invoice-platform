import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(2, "Address must be at least 2 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0, "Rate must be a positive number"),
});

export const invoiceSchema = z.object({
  invoiceName: z
    .string()
    .min(1, "Invoice name is required")
    .min(2, "Invoice name must be at least 2 characters"),

  status: z.enum(["PAID", "PENDING", "CANCELLED"]).default("PENDING"),

  // Total is calculated on server, but we validate it exists
  total: z.coerce.number().min(0, "Total must be a positive number"),

  currency: z.string().min(1, "Currency is required"),

  invoiceNumber: z.coerce
    .number()
    .int()
    .min(1, "Invoice number must be at least 1"),

  date: z
    .string()
    .min(1, "Date is required")
    .transform((value) => new Date(value))
    .pipe(z.date()),

  dueDate: z.coerce.number().int().min(0, "Due date must be a valid number"),

  fromName: z
    .string()
    .min(1, "Sender name is required")
    .min(2, "Sender name must be at least 2 characters"),

  fromEmail: z
    .string()
    .min(1, "Sender email is required")
    .email("Sender email must be a valid email address"),

  fromAddress: z
    .string()
    .min(1, "Sender address is required")
    .min(2, "Sender address must be at least 2 characters"),

  clientName: z
    .string()
    .min(1, "Client name is required")
    .min(2, "Client name must be at least 2 characters"),

  clientEmail: z
    .string()
    .min(1, "Client email is required")
    .email("Client email must be a valid email address"),

  clientAddress: z
    .string()
    .min(1, "Client address is required")
    .min(2, "Client address must be at least 2 characters"),

  note: z.string().optional(),

  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one invoice item is required"),
});

export type InvoiceItemData = z.infer<typeof invoiceItemSchema>;
export type InvoiceData = z.infer<typeof invoiceSchema>;

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().optional(),
});

export type ProductData = z.infer<typeof productSchema>;
