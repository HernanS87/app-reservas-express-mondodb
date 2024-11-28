import { z } from "zod";

// En este esquema ambos campos son obligatorios
const registerUserSchema = z.object({
  userName: z.string().min(1, "El nombre del cliente es obligatorio"), // Valida que no esté vacío
  email: z.string().min(1, "El email es obligatorio").email("Formato de email inválido"), // Validación de formato de email
});

// En este esquema al menos uno de los campos es obligatorio
const loginUserSchema = z
  .object({
    userName: z.string().optional(),
    email: z.string().email("Formato de email inválido").optional(),
  })
  .refine((data) => data.userName || data.email, "Debes proporcionar al menos un campo: userName o email");

// Inferir el tipo de TypeScript a partir del esquema de Zod
export type RegisterUserValidation = z.infer<typeof registerUserSchema>;

export type LoginUserValidation = z.infer<typeof loginUserSchema>;

export const validateRegisterUser = (reserva: RegisterUserValidation) => registerUserSchema.safeParseAsync(reserva);

export const validateLoginUser = (reserva: LoginUserValidation) => loginUserSchema.safeParseAsync(reserva);
