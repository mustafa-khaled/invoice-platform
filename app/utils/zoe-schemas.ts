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
